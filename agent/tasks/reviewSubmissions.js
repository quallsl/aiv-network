import { getPendingFilms, updateFilmStatus } from '../lib/supabase.js';
import { reviewFilmSubmission } from '../lib/claude.js';
import { notifySlack } from '../lib/notify.js';

export async function reviewSubmissions({ dryRun = false } = {}) {
  const pending = await getPendingFilms();
  const results = [];

  for (const film of pending) {
    const { verdict, reason } = await reviewFilmSubmission(film);
    results.push({ id: film.id, title: film.title, verdict, reason });

    if (dryRun) continue;

    if (verdict === 'approve') {
      await updateFilmStatus(film.id, 'awaiting_curation', reason);
    } else {
      await updateFilmStatus(film.id, 'needs_review', reason);
      await notifySlack(`⚠️ Film flagged for review: "${film.title}" — ${reason}`);
    }
  }

  return results;
}
