"use client";
import { useEffect, useState } from "react";
import AVODPlayer from "../components/AVODPlayer";
export default function HomePage() {
  const [films, setFilms] = useState([]);
  const [fullscreenFilm, setFullscreenFilm] = useState(null);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  /* =========================
     FETCH FILMS
  ========================= */
  useEffect(() => {
    async function fetchFilms() {
      try {
        const res = await fetch("/api/films");
        const data = await res.json();
        console.log("DATA:", data);
        setFilms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    }
    fetchFilms();
  }, []);

  /* =========================
     HERO
  ========================= */
  const trailerUrl =
    "https://res.cloudinary.com/dbefmxqss/video/upload/v1768880039/aiv-films-wonderboy-trailer_vae68x.mp4";

  /* =========================
     CATEGORY LOGIC
  ========================= */
  const filteredFilms = films.filter((film) =>
  film.title?.toLowerCase().includes(searchTerm.toLowerCase())
);
  const categories = {
    Trending:
      filteredFilms.filter((f) => f.trending).length > 0
        ? filteredFilms.filter((f) => f.trending)
        : filteredFilms.slice(0, 10),

    "New Releases":
      filteredFilms.filter((f) => f.new_release).length > 0
        ? filteredFilms.filter((f) => f.new_release)
        : filteredFilms.slice(0, 10),

    "AIV Originals":
      filteredFilms.filter((f) => f.aiv_original).length > 0
        ? filteredFilms.filter((f) => f.aiv_original)
        : filteredFilms.slice(0, 10),
  };

  /* =========================
     YOUTUBE HELPERS (ROBUST)
  ========================= */
  const getYouTubeId = (url) => {
    if (!url) return null;

    try {
      const u = new URL(url);

      if (u.hostname.includes("youtu.be")) {
        return u.pathname.slice(1);
      }

      if (u.searchParams.get("v")) {
        return u.searchParams.get("v");
      }

      const embed = u.pathname.match(/embed\/([^/?]+)/);
      if (embed) return embed[1];

      const shorts = u.pathname.match(/shorts\/([^/?]+)/);
      if (shorts) return shorts[1];

      return null;
    } catch {
      return null;
    }
  };

  const isYouTube = (url) =>
    url?.includes("youtube.com") || url?.includes("youtu.be");

  const getYouTubePreview = (url) => {
    const id = getYouTubeId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}`
      : null;
  };

  const getYouTubeEmbed = (url) => {
    const id = getYouTubeId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1`
      : null;
  };

  /* =========================
     THUMBNAIL LOGIC
  ========================= */
  const getThumbnail = (film) => {
    const yt = getYouTubeId(film?.video_url);
    if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;

    if (film?.thumbnail_url?.startsWith("http")) {
      return film.thumbnail_url;
    }

    if (film?.video_url?.includes("res.cloudinary.com")) {
      return film.video_url
        .replace("/upload/", "/upload/so_1,w_400,h_225,c_fill,f_jpg/")
        .replace(/\.\w+$/, ".jpg");
    }

    return "https://placehold.co/300x170?text=No+Thumbnail";
  };

  /* =========================
     FILM CARD
  ========================= */
  function FilmCard({ film }) {
    const [hovered, setHovered] = useState(false);
    const thumbnail = getThumbnail(film);

    return (
      <div
        onClick={() => setSelectedFilm(film)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          minWidth: "220px",
          height: "130px",
          position: "relative",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          zIndex: hovered ? 50 : 1,
        }}
      >
        {hovered ? (
          isYouTube(film.video_url) ? (
            <iframe
              src={getYouTubePreview(film.video_url)}
              style={styles.thumbnail}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              title={film.title}
            />
          ) : (
            <video
  src={trailerUrl}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="https://res.cloudinary.com/dbefmxqss/video/upload/so_1/aiv-films-wonderboy-trailer_vae68x.jpg"
  style={styles.video}
/>
          )
        ) : (
          <img
            src={thumbnail}
            alt={film.title}
            style={styles.thumbnail}
          />
        )}

        {hovered && (
          <div style={styles.overlayCard}>
            <p>{film.title}</p>
          </div>
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
      {menuOpen && (
  <div style={styles.menuDropdown}>
    <div
      style={styles.menuItem}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Home
    </div>

    <div style={styles.menuItem}>
      Trending
    </div>

    <div style={styles.menuItem}>
      New Releases
    </div>

    <div style={styles.menuItem}>
      AIV Originals
    </div>
  </div>
)}
  <button
    style={styles.menuButton}
    onClick={() => setMenuOpen(!menuOpen)}
  >
    ☰ Menu
  </button>

  <input
    type="text"
    placeholder="Search films..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={styles.searchBar}
  />

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
  preload="metadata"
  poster="/hero.jpg"
  style={styles.video}
/>
        <div style={styles.overlay}>
          <h1 style={styles.heroTitle}>AIV Films</h1>
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

      {/* =========================
          FULLSCREEN PLAYER
      ========================= */}
      {/* =========================
    FILM DETAILS MODAL
========================= */}
{selectedFilm && (
  <div
    style={styles.detailsOverlay}
    onClick={() => setSelectedFilm(null)}
  >
    <div
      style={styles.detailsCard}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={
          selectedFilm.poster_url ||
          getThumbnail(selectedFilm)
        }
        alt={selectedFilm.title}
        style={styles.detailsPoster}
      />

      <div style={{ flex: 1 }}>
        <h1>{selectedFilm.title}</h1>

        <p>
          {selectedFilm.description ||
            "No description available."}
        </p>

        <p>
          ⭐ {selectedFilm.rating || "NR"}
        </p>

        <p>
          🎬 {selectedFilm.genre || "Unknown"}
        </p>

        <p>
          ⏱ {selectedFilm.runtime || "N/A"}
        </p>

        <button
          style={styles.watchButton}
          onClick={() => {
            setFullscreenFilm(selectedFilm);
            setSelectedFilm(null);
          }}
        >
          ▶ Watch Now
        </button>
      </div>
    </div>
  </div>
)}
      {fullscreenFilm && (
        <div
          style={styles.fullscreenOverlay}
          onClick={() => setFullscreenFilm(null)}
        >
          <div
            style={styles.fullscreenContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={styles.backButton}
              onClick={() => setFullscreenFilm(null)}
            >
              ← Back to Home
            </button>

            {isYouTube(fullscreenFilm.video_url) ? (
              <iframe
                src={getYouTubeEmbed(fullscreenFilm.video_url)}
                style={styles.fullscreenVideo}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={fullscreenFilm.title}
              />
            ) : (
              const isMP4 = fullscreenFilm.video_url?.includes(".mp4");

{isMP4 ? (
  <AVODPlayer src={fullscreenFilm.video_url} />
) : (
  <iframe
    src={fullscreenFilm.video_url}
    style={styles.fullscreenVideo}
    allow="autoplay; fullscreen"
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
  },
  hero: {
    position: "relative",
    height: "400px",
    marginBottom: "30px",
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
  },
  heroTitle: { fontSize: "48px" },
  row: {
    display: "flex",
    overflowX: "auto",
    gap: "12px",
    marginBottom: "20px",
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
    fontSize: "12px",
    padding: "6px",
  },

  fullscreenOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  fullscreenContent: {
    width: "90%",
    maxWidth: "1200px",
    position: "relative",
  },

  fullscreenVideo: {
    width: "100%",
    height: "80vh",
    border: "none",
  },

  backButton: {
    position: "absolute",
    top: "-50px",
    left: 0,
    background: "#e50914",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    cursor: "pointer",
  },

  menuDropdown: {
    background: "#111",
    border: "1px solid #333",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "20px",
    width: "220px",
  },

  menuItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #222",
  },
  
 detailsOverlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
},

detailsCard: {
  background: "#111",
  color: "#fff",
  width: "85%",
  maxWidth: "900px",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  gap: "20px",
},

detailsPoster: {
  width: "250px",
  borderRadius: "8px",
  objectFit: "cover",
},

watchButton: {
  background: "#e50914",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "20px",
},
  
};