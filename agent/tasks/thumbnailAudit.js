import {
  getAllApprovedFilms,
  updateFilmThumbnail,
} from "../lib/supabase.js";

import {
  thumbnailIsBroken,
  regenerateThumbnail,
  buildThumbnailUrl,
} from "../lib/bunny.js";

const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const CDN_HOST = process.env.BUNNY_CDN_HOSTNAME;

export async function thumbnailAudit({ dryRun = false } = {}) {
  const films = await getAllApprovedFilms();

  const fixed = [];

  for (const film of films) {
    const broken = await thumbnailIsBroken(film.thumbnail_url);

    if (!broken) continue;

    fixed.push(film.id);

    if (dryRun) continue;

    await regenerateThumbnail(LIBRARY_ID, film.id);

    await updateFilmThumbnail(
      film.id,
      buildThumbnailUrl(CDN_HOST, film.id)
    );
  }

  return {
    checked: films.length,
    fixed,
  };
}