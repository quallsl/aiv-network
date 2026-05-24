"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [films, setFilms] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
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
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/
    );
    return match ? match[1] : null;
  };

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

  const isYouTube = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const getYouTubeEmbed = (url) => {
    const id = getYouTubeId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`
      : null;
  };

  /* =========================
     CLICK LOGIC
  ========================= */
  const handleCardClick = (film) => {
    if (expandedId === film.id) {
      setFullscreenFilm(film); // second click → fullscreen
    } else {
      setExpandedId(film.id); // first click → expand
      setFullscreenFilm(null);
    }
  };

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
        <video
          src={trailerUrl}
          autoPlay
          muted
          loop
          playsInline
          style={styles.video}
        />
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

      {/* FULLSCREEN MODAL */}
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
                allow="autoplay"
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

      {/* FILM GRID */}
      <div style={styles.row}>
        {films.map((film) => {
          const isHovered = hoveredId === film.id;
          const isExpanded = expandedId === film.id;
          const thumbnail = getThumbnail(film);

          return (
            <div
              key={film.id}
              onClick={() => handleCardClick(film)}
              onMouseEnter={() => setHoveredId(film.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                ...styles.card,
                ...(isExpanded && styles.cardExpanded),
                transform: isHovered
                  ? "scale(1.08)"
                  : isExpanded
                  ? "scale(1.2)"
                  : "scale(1)",
              }}
            >
              <div style={styles.mediaWrapper}>
                {isHovered || isExpanded ? (
                  <video
                    src={film.video_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={styles.thumbnail}
                  />
                ) : (
                  <img
                    src={thumbnail}
                    alt={film.title}
                    style={styles.thumbnail}
                  />
                )}

                <div style={styles.playIcon}>▶</div>
              </div>

              <h3 style={styles.title}>{film.title}</h3>
              <p style={styles.creator}>{film.creator}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  page: { padding: "20px", fontFamily: "Arial" },

  nav: { display: "flex", justifyContent: "flex-end" },

  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
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
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },

  heroTitle: { fontSize: "48px" },

  playButton: {
    padding: "12px 24px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    marginTop: "20px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
    gap: "20px",
    overflow: "visible", // IMPORTANT FIX
  },

  card: {
    cursor: "pointer",
    transition: "transform 0.3s ease",
    transformOrigin: "center",
    position: "relative",
    zIndex: 1,
  },

  cardExpanded: {
    zIndex: 999,
  },

  mediaWrapper: {
    position: "relative",
    width: "100%",
    height: "170px",
    overflow: "hidden",
    borderRadius: "8px",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  playIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "30px",
    color: "white",
    pointerEvents: "none",
  },

  title: { marginTop: "10px" },

  creator: { color: "#666" },

  fullscreenOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
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