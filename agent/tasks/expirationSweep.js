import { getAllApprovedFilms, updateFilmStatus } from '../lib/supabase.js';
import { notifySlack } from '../lib/notify.js';

const WARNING_WINDOW_DAYS = 14;

export async function expirationSweep({ dryRun = false } = {}) {
  const films = await getAllApprovedFilms();
  const now = new Date();
  const flagged = [];

  for (const film of films) {
    if (!film.scheduled_removal_at) continue;
    const removalDate = new Date(film.scheduled_removal_at);
    const daysLeft = (removalDate - now) / (1000 * 60 * 60 * 24);

    if (daysLeft <= 0) {
      flagged.push({ id: film.id, action: 'removed' });
      if (!dryRun) await updateFilmStatus(film.id, 'removed', 'Auto-removed: scheduled_removal_at passed');
    } else if (daysLeft <= WARNING_WINDOW_DAYS) {
      flagged.push({ id: film.id, action: 'warning', daysLeft: Math.ceil(daysLeft) });
      if (!dryRun) await notifySlack(`⏳ "${film.title}" is scheduled for removal in ${Math.ceil(daysLeft)} day(s).`);
    }
  }

  return flagged;
}
