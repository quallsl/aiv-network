import { SITE_URL, getApprovedFilms } from "../lib/films-server";

export const revalidate = 3600;

export default async function sitemap() {
  const films = await getApprovedFilms();
  const staticPages = ["", "/films", "/about", "/support", "/privacy", "/terms", "/submit"].map(
    (path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.6 })
  );
  const filmPages = films.map((film) => ({
    url: `${SITE_URL}/film/${film.id}`,
    lastModified: film.updated_at || film.created_at || undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticPages, ...filmPages];
}
