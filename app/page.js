"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [films, setFilms] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [fullscreenFilm, setFullscreenFilm] = useState(null);

  /* =========================
     FETCH
  ========================= */
  useEffect(() => {
    async function fetchFilms() {
      try {
        const res = await fetch("/api/films");
        const text = await res.text();

        let data = [];
        try {
          data = JSON.parse(text);
        } catch {
          console.error("Bad JSON:", text);
        }

        setFilms(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("FETCH FAILED:", err);
        setFilms([]);
      }
    }

    fetchFilms();
  }, []);

  /* =========================
     CATEGORIES
  ========================= */
  const categories = {
    Trending: films.slice(0, 10),
    "New Releases": films.slice(10, 20),
    "AIV Originals": films.slice(20, 30),
  };

  /* =========================
     HERO VIDEO
  ========================= */
  const trailerUrl =
    "https://res.cloudinary.com/dbefmxqss/video/upload/v1768880039/aiv-films-wonderboy-trailer_vae68x.mp4";

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

  const getYouTubeEmbed = (url) => {
    const id = getYouTubeId(url);

    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1&rel=0`
      : null;
  };

  // 🔥 NEW: hover preview version
  const getYouTubePreview = (url) => {
    const id = getYouTubeId(url);

    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${id}`
      : null;
  };

  const isYouTube = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const getThumbnail = (film) => {
    if (film.thumbnail_url?.startsWith("http")) {
      return film.thumbnail_url;
    }

    const yt = getYouTubeId(film.video_url);
    if (yt) {
      return `https://img.youtube.com/vi/${yt}/maxresdefault.jpg`;
    }

    if (film.video_url?.includes("/video/upload/")) {
      return film.video_url
        .replace("/video/upload/", "/image/upload/")
        .replace(".mp4", ".jpg");
    }

    return "https://via.placeholder.com/300x170?text=Preview";
  };

  const handleCardClick = (film) => {
    setExpandedId(expandedId === film.id ? null : film.id);
  };

  /* =========================
     FILM CARD (POLISHED)
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
        {/* MEDIA */}
        {hovered || isExpanded ? (
          isYouTube(film.video_url) ? (
            <iframe
              src={getYouTubePreview(film.video_url)}
              style={styles.thumbnail}
              frameBorder="0"
              allow="autoplay; encrypted-media"
            />
          ) : (
            <video
              src={film.video_url}
              autoPlay
              muted
              loop
              playsInline
              style={styles.thumbnail}
            />
          )
        ) : (
          <img src={thumbnail} alt={film.title} style={styles.thumbnail} />
        )}

        {/* OVERLAY */}
        {(hovered || isExpanded) && (
          <div style={styles.overlayCard}>
            <p>{film.title}</p>
          </div>
        )}

        {/* FULLSCREEN BUTTON */}
        {isExpanded && (
          <button
            style={styles.fullscreenButton}
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenFilm(film);
            }}
          >
            ⛶
          </button>
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
      {films.length > 0 ? (
        Object.entries(categories).map(([title, categoryFilms]) => (
          <div key={title} style={{ marginBottom: "40px" }}>
            <h2 style={styles.rowTitle}>{title}</h2>

            <div style={styles.row}>
              {categoryFilms.map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Loading films...</p>
      )}

      {/* FULLSCREEN */}
      {fullscreenFilm && (
        <div
          style={styles.fullscreenOverlay}
          onClick={() => setFullscreenFilm(null)}
        >
          <div
            style={styles.fullscreenContent}
            onClick={(e) => e.stopPropagation()}
          >
            {isYouTube(fullscreenFilm.video_url) ? (
              <iframe
                src={getYouTubeEmbed(fullscreenFilm.video_url)}
                style={styles.fullscreenVideo}
                title={fullscreenFilm.title}
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={fullscreenFilm.video_url}
                autoPlay
                controls
                style={styles.fullscreenVideo}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  page: {
    padding: "20px",
    background: "#000",
    color: "#fff",
    fontFamily: "Arial",
  },

  nav: { display: "flex", justifyContent: "flex-end" },

  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#e50914",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },

  hero: {
    position: "relative",
    height: "400px",
    marginBottom: "40px",
    overflow: "hidden",
  },

  video: { width: "100%", height: "100%", objectFit: "cover" },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  heroTitle: { fontSize: "48px" },

  playButton: {
    padding: "12px 24px",
    backgroundColor: "#e50914",
    color: "white",
    border: "none",
    marginTop: "20px",
  },

  rowTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  row: {
    display: "flex",
    overflowX: "auto",
    gap: "12px",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "6px",
  },

  overlayCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "rgba(0,0,0,0.7)",
    padding: "6px",
    fontSize: "12px",
  },

  fullscreenButton: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    background: "rgba(0,0,0,0.7)",
    color: "white",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },

  fullscreenOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },

  fullscreenContent: {
    width: "90%",
    maxWidth: "1000px",
  },

  fullscreenVideo: {
    width: "100%",
    height: "80vh",
  },
};