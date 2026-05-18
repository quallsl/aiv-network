"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [films, setFilms] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    async function fetchFilms() {
      try {
        const res = await fetch("/api/films");
        const data = await res.json();
        setFilms(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFilms();
  }, []);

  const trailerUrl =
    "https://res.cloudinary.com/dbefmxqss/video/upload/v1768880039/aiv-films-wonderboy-trailer_vae68x.mp4";

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

      {/* HERO TRAILER */}
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

      {/* FILM ROW */}
      <div style={styles.row}>
        {films.map((film) => {
          const thumbnail =
            film.thumbnail_url ||
            (film.video_url
              ? film.video_url
                  .replace("/video/upload/", "/image/upload/")
                  .replace(".mp4", ".jpg")
              : "");

          return (
            <div key={film.id} style={styles.card}>
              {hoveredId === film.id ? (
                <video
                  src={film.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={styles.thumbnail}
                  onMouseEnter={() => setHoveredId(film.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() =>
                    window.open(film.video_url, "_blank")
                  }
                />
              ) : thumbnail ? (
                <img
                  src={thumbnail}
                  style={styles.thumbnail}
                  onMouseEnter={() => setHoveredId(film.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() =>
                    window.open(film.video_url, "_blank")
                  }
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div style={styles.placeholder}>No Image</div>
              )}

              <h3 style={styles.title}>{film.title}</h3>
              <p style={styles.creator}>{film.creator}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
} // ✅ THIS WAS MISSING

/* ✅ STYLES OUTSIDE COMPONENT */
const styles = {
  page: {
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  nav: {
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 10,
  },

  submitButton: {
    padding: "10px 16px",
    backgroundColor: "#e50914",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  hero: {
    position: "relative",
    height: "70vh",
    overflow: "hidden",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
    display: "flex",
    alignItems: "center",
    paddingLeft: "40px",
  },

  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
  },

  playButton: {
    marginTop: "20px",
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#e50914",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  row: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    overflowX: "auto",
  },

  card: {
    minWidth: "200px",
  },

  thumbnail: {
    width: "200px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "6px",
    cursor: "pointer",
  },

  placeholder: {
    width: "200px",
    height: "120px",
    backgroundColor: "#222",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    color: "#888",
  },

  title: {
    marginTop: "8px",
    fontSize: "14px",
  },

  creator: {
    fontSize: "12px",
    color: "#aaa",
  },
};