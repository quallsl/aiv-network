import Link from "next/link";
import { filmYear, getApprovedFilms, getThumbnail } from "../../lib/films-server";

export const revalidate = 3600;

export const metadata = {
  title: "All Films — AIV Network",
  description:
    "Browse every curated AI-generated and independent film streaming free on AIV Network.",
  alternates: { canonical: "/films" },
};

export default async function FilmsIndex() {
  const films = await getApprovedFilms();

  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 34, marginBottom: 8 }}>All Films</h1>
        <p style={{ color: "#b3b3b3", lineHeight: 1.6, marginBottom: 32, maxWidth: 760 }}>
          AIV Network streams curated short and feature-length films made with
          generative AI, alongside AIV Originals. Every title is reviewed by our
          curator before release.
        </p>

        {films.length === 0 ? (
          <p style={{ color: "#999" }}>New films are coming soon.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 20 }}>
            {films.map((film) => (
              <li key={film.id} style={{ display: "flex", gap: 16, borderBottom: "1px solid #1c1c1c", paddingBottom: 20 }}>
                <Link href={`/film/${film.id}`} style={{ flex: "0 0 200px" }}>
                  <img
                    src={getThumbnail(film)}
                    alt={`${film.title} poster`}
                    loading="lazy"
                    style={{ width: 200, aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 4, background: "#222" }}
                  />
                </Link>
                <div>
                  <h2 style={{ fontSize: 20, margin: "0 0 4px" }}>
                    <Link href={`/film/${film.id}`} style={{ color: "#fff" }}>{film.title}</Link>
                  </h2>
                  <p style={{ color: "#808080", fontSize: 14, margin: "0 0 8px" }}>
                    {[film.genre, filmYear(film), film.creator].filter(Boolean).join(" • ")}
                  </p>
                  {film.description ? (
                    <p style={{ color: "#ccc", lineHeight: 1.6, margin: 0 }}>
                      {film.description.length > 280
                        ? `${film.description.slice(0, 280)}…`
                        : film.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
