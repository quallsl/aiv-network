"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [films, setFilms] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [fullscreenFilm, setFullscreenFilm] = useState(null);

  /* =========================
     FETCH FILMS
  ========================= */
  useEffect(() => {
    async function fetchFilms() {
      try {
        const res = await fetch("/api/films");
        const data = await res.json();
        console.log("DATA:", data);
        setFilms(data);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    }
    fetchFilms();
  }, []);

  /* =========================
     HERO VIDEO
  ========================= */
  const trailerUrl =
    "https://res.cloudinary.com/dbefmxqss/video/upload/v1768880039/aiv-films-wonderboy-trailer_vae68x.mp4";

  /* =========================
     CATEGORY LOGIC
  ========================= */
  const categories = {
  Trending:
    films.filter((f) => f.trending === true).length > 0
      ? films.filter((f) => f.trending === true)
      : films.slice(0, 10),

  "New Releases":
    films.filter((f) => f.new_release === true).length > 0
      ? films.filter((f) => f.new_release === true)
      : films.slice(0, 10),

  "AIV Originals":
    films.filter((f) => f.aiv_original === true).length > 0
      ? films.filter((f) => f.aiv_original === true)
      : films.slice(0, 10),
};

  /* =========================
     HELPERS
  ========================= */
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
    );
    return match ? match[1] : null;
  };

  const isYouTube = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const getYouTubePreview = (url) => {
    const id = getYouTubeId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}`
      : null;
  };

  const getThumbnail = (film) => {
    if (film.thumbnail_url?.startsWith("http")) {
      return film.thumbnail_url;
    }

    const yt = getYouTubeId(film.video_url);
    if (yt) {
      return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
    }

    if (film.video_url?.includes("res.cloudinary.com")) {
      return film.video_url
        .replace("/upload/", "/upload/so_1,w_400,h_225,c_fill/")
        .replace(/\.\w+$/, ".jpg");
    }

    return "https://placehold.co/300x170?text=No+Thumbnail";
  };

  const handleCardClick = (film) => {
    setExpandedId(expandedId === film.id ? null : film.id);
  };

  /* =========================
     FILM CARD
  ========================= */
  function FilmCard({ film }) {
    const [hovered, setHovered] = useState(false);
    const isExpanded = expandedId === film.id;
    const thumbnail = getThumbnail(film);

    return (
      <div
        onClick={() => handleCardClick(film)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          minWidth: "220px",
          height: "130px",
          position: "relative",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          transform: isExpanded
            ? "scale(1.25)"
            : hovered
            ? "scale(1.15)"
            : "scale(1)",
          zIndex: isExpanded ? 50 : 1,
        }}
      >
        {hovered || isExpanded ? (
          isYouTube(film.video_url) ? (
            <iframe
              src={getYouTubePreview(film.video_url)}
              style={styles.thumbnail}
              allow="autoplay"
            />
          ) : (
            <video
              src={film.video_url}
              autoPlay
              muted
              loop
              style={styles.thumbnail}
            />
          )
        ) : (
          <img
            src={thumbnail}
            alt={film.title}
            style={styles.thumbnail}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/300x170?text=Thumbnail+Error";
            }}
          />
        )}
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <main style={styles.page}>
      {/* NAV */}
      <div style={styles.nav}>
        <button
          style={styles.submitButton}
          onClick={() => (window.location.href = "/submit")}
        >
          + Submit Film
        </button>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <video src={trailerUrl} autoPlay muted loop style={styles.video} />

        <div style={styles.overlay}>
          <div>
            <h1 style={styles.heroTitle}>AIV Films</h1>
            <button
              style={styles.playButton}
              onClick={() => window.open(trailerUrl, "_blank")}
            >
              ▶ Play Trailer
            </button>
          </div>
        </div>
      </div>

      {/* ROWS */}
      {films.length === 0 ? (
        <p>Loading...</p>
      ) : (
        Object.entries(categories).map(([title, list]) => (
          <div key={title}>
            <h2>{title}</h2>
            <div style={styles.row}>
              {list.map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  page: {
    background: "#000",
    color: "#fff",
    padding: "20px",
    fontFamily: "Optima",
  },

  nav: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },

  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  hero: {
    position: "relative",
    height: "400px",
    marginBottom: "30px",
    overflow: "hidden",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
  },

  playButton: {
    padding: "12px 24px",
    backgroundColor: "#e50914",
    color: "#fff",
    border: "none",
    marginTop: "20px",
    cursor: "pointer",
  },

  row: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    marginBottom: "20px",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "6px",
  },
};