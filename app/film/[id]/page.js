import Link from "next/link";
import { notFound } from "next/navigation";
import AVODPlayer from "../../AVODPlayer";
import {
  SITE_URL,
  filmYear,
  getApprovedFilm,
  getStreamUrl,
  getThumbnail,
} from "../../../lib/films-server";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const film = await getApprovedFilm(id);
  if (!film) return { title: "Film not found — AIV Network" };
  const description =
    film.description?.slice(0, 160) ||
    `Watch ${film.title} free on AIV Network, the home of independent AI cinema.`;
  return {
    title: `${film.title} — Watch free on AIV Network`,
    description,
    alternates: { canonical: `/film/${film.id}` },
    openGraph: {
      title: film.title,
      description,
      images: [getThumbnail(film)],
      type: "video.movie",
    },
  };
}

export default async function FilmPage({ params }) {
  const { id } = await params;
  const film = await getApprovedFilm(id);
  if (!film) notFound();

  const year = filmYear(film);
  const thumbnail = getThumbnail(film);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: film.title,
    description: film.description || film.title,
    thumbnailUrl: thumbnail.startsWith("http") ? thumbnail : `${SITE_URL}${thumbnail}`,
    uploadDate: film.created_at || undefined,
    genre: film.genre || undefined,
    creator: film.creator ? { "@type": "Person", name: film.creator } : undefined,
    url: `${SITE_URL}/film/${film.id}`,
  };

  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        <nav style={{ marginBottom: 20, fontSize: 14 }}>
          <Link href="/" style={{ color: "#b3b3b3" }}>Home</Link>
          <span style={{ color: "#555" }}> / </span>
          <Link href="/films" style={{ color: "#b3b3b3" }}>All films</Link>
        </nav>

        <AVODPlayer src={getStreamUrl(film.video_url)} />

        <h1 style={{ fontSize: 32, margin: "24px 0 8px" }}>{film.title}</h1>
        <p style={{ color: "#b3b3b3", margin: "0 0 20px", fontSize: 15 }}>
          {[film.genre, year, film.creator && `Directed by ${film.creator}`]
            .filter(Boolean)
            .join(" • ")}
        </p>

        {film.description ? (
          <section>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Synopsis</h2>
            <p style={{ color: "#ccc", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {film.description}
            </p>
          </section>
        ) : null}

        <section style={{ marginTop: 32, borderTop: "1px solid #222", paddingTop: 20 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>About this release</h2>
          <p style={{ color: "#999", lineHeight: 1.7 }}>
            Every film on AIV Network is submitted by its creator and reviewed
            by our curator before it is published. Want your work here?{" "}
            <Link href="/submit" style={{ color: "#e50914" }}>Submit a film</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
