"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [films, setFilms] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    async function fetchFilms() {
      try {
        const res = await fetch("/api/films");

        const text = await res.text(); // ✅ SAFE
        console.log("RAW API:", text);

        let data = [];

try {
  const response = await fetch("/api/films");

  const text = await response.text();

  console.log("RAW RESPONSE:", text);

  data = JSON.parse(text);
} catch (e) {
  console.error("JSON BROKEN:", e);
  data = [];
}

        setFilms(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("FETCH FAILED:", err);
        setFilms([]);
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

      {/* ROW */}
      <div style={styles.row}>
        {films.map((film) => {
          const isHovered = hoveredId === film.id;

          const getYouTubeId = (url) => {
  if (!url) return null;
  const reg =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&]+)/;
  const match = url.match(reg);
  return match ? match[1] : null;
};

const youtubeId = getYouTubeId(film.video_url);

const thumbnail =
  film.thumbnail_url ||
  (youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : film.video_url?.includes("/video/upload/")
    ? film.video_url
        .replace("/video/upload/", "/image/upload/")
        .replace(".mp4", ".jpg")
    : "https://via.placeholder.com/300x170?text=Preview");

          return (
            <div
              key={film.id}
              style={{
                ...styles.card,
                transform: isHovered ? "scale(1.08)" : "scale(1)",
                zIndex: isHovered ? 5 : 1,
              }}
              onMouseEnter={() => setHoveredId(film.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={styles.mediaWrapper}>
                {isHovered ? (
                  film.type === "youtube" || film.type === "vimeo" ? (
                    <iframe
                      src={film.embed_url}
                      style={styles.thumbnail}
                      allow="autoplay"
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
                  <img
                    src={thumbnail}
                    alt={film.title}
                    style={styles.thumbnail}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x170?text=Broken";
                    }}
                  />
                )}
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

/* STYLES */
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
    transition: "transform 0.3s ease",
  },

  mediaWrapper: {
    position: "relative",
  },

  thumbnail: {
    width: "200px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "6px",
    cursor: "pointer",
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