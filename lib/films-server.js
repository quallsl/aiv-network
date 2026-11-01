// Server-side film helpers. Used by crawlable, server-rendered pages
// (/films, /film/[id], sitemap) so search and AdSense crawlers see real
// titles and synopses in the initial HTML instead of an empty client shell.
import { createClient } from "@supabase/supabase-js";

const BUNNY_CDN_HOSTNAME = "vz-b7971a5e-657.b-cdn.net";
// Matches what the homepage shows: older rows have no status set, so
// only exclude rows explicitly held back by the curator.
const PUBLIC_STATUS_FILTER = "status.is.null,status.not.in.(pending,rejected,removed)";
export const SITE_URL = "https://aivnetwork.online";

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null; // lets `next build` succeed without env vars
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getApprovedFilms() {
  const supabase = getServerSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("films")
    .select("*")
    .or(PUBLIC_STATUS_FILTER)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getApprovedFilms:", error.message);
    return [];
  }
  return data || [];
}

export async function getApprovedFilm(id) {
  const supabase = getServerSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("films")
    .select("*")
    .eq("id", id)
    .or(PUBLIC_STATUS_FILTER)
    .maybeSingle();
  if (error) {
    console.error("getApprovedFilm:", error.message);
    return null;
  }
  return data;
}

function parseBunnyUrl(url) {
  const m = url?.match(
    /player\.mediadelivery\.net\/(?:play|embed)\/(\d+)\/([a-f0-9-]+)/i
  );
  return m ? { libraryId: m[1], videoId: m[2] } : null;
}

function getYouTubeId(url) {
  const m = url?.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/
  );
  return m ? m[1] : null;
}

export function getStreamUrl(url) {
  if (!url) return null;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return url;
  const parsed = parseBunnyUrl(url);
  return parsed
    ? `https://${BUNNY_CDN_HOSTNAME}/${parsed.videoId}/playlist.m3u8`
    : url;
}

export function getThumbnail(film) {
  if (film?.thumbnail_url) return film.thumbnail_url;
  const yt = getYouTubeId(film?.video_url);
  if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  const bunny = parseBunnyUrl(film?.video_url);
  if (bunny) return `https://${BUNNY_CDN_HOSTNAME}/${bunny.videoId}/thumbnail.jpg`;
  return "/no-preview.png";
}

export function filmYear(film) {
  return film?.release_year || film?.year || null;
}
