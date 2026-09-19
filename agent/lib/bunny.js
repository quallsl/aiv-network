const BUNNY_API_BASE = 'https://video.bunnycdn.com/library';

export async function regenerateThumbnail(libraryId, videoId) {
  // No thumbnailUrl in the body -> Bunny picks a default frame from the video.
  const res = await fetch(`${BUNNY_API_BASE}/${libraryId}/videos/${videoId}/thumbnail`, {
    method: 'POST',
    headers: { AccessKey: process.env.BUNNY_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  if (!res.ok) throw new Error(`Bunny thumbnail regen failed: ${res.status}`);
  return res.json();
}

export function buildThumbnailUrl(cdnHostname, videoId) {
  return `https://${cdnHostname}/${videoId}/thumbnail.jpg`;
}

export async function thumbnailIsBroken(url) {
  if (!url) return true;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return !res.ok;
  } catch {
    return true;
  }
}
