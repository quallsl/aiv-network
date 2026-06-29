"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AVODPlayer from "./AVODPlayer";
import AdsenseBanner from "./components/AdsenseBanner";
import { getSupabase } from "../lib/supabase";

export default function Page() {
  const [showMenu, setShowMenu] = useState(false);
  const [films, setFilms] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [activeFilm, setActiveFilm] = useState(null);
  const [expandedFilm, setExpandedFilm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const router = useRouter();

  useEffect(() => {
    loadFilms();
  }, []);

  async function loadFilms() {
    try {
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("films")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setFilms(data || []);
    } catch (err) {
      console.error("Load films error:", err);
    }
  }

  function getYouTubeId(url) {
    if (!url) return null;

    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;

    const match = url.match(regex);
    return match ? match[1] : null;
  }

  function getYouTubeThumbnail(url) {
    const videoId = getYouTubeId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  }

  function getYouTubeEmbed(url) {
    const videoId = getYouTubeId(url);
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
      : null;
  }

  function isYouTubeUrl(url) {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  }

  function getThumbnail(film) {
    const url = film?.video_url || "";

    return (
      film?.thumbnail_url ||
      getYouTubeThumbnail(url) ||
      "https://via.placeholder.com/320x180?text=No+Preview"
    );
  }

  const filteredFilms = films.filter((film) => {
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      !query ||
      film.title?.toLowerCase().includes(query) ||
      film.creator?.toLowerCase().includes(query) ||
      film.genre?.toLowerCase().includes(query) ||
      film.description?.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      film.genre?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

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

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          alignItems: "center",
          background: "#111",
          position: "sticky",
          top: 0,
          zIndex: 9999,
        }}
      >
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          style={{
            background: "#e50914",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ☰ Menu
        </button>

        <input
          placeholder="Search films..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "230px",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
          }}
        />

        <button
          type="button"
          onClick={() => router.push("/submit")}
          style={{
            background: "#e50914",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          + Submit Film
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "55px",
              left: "10px",
              background: "#111",
              border: "1px solid #333",
              padding: "10px",
              zIndex: 10000,
              minWidth: "190px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");
                setShowMenu(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                background: "#222",
                color: "#fff",
                border: "1px solid #444",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              Browse All
            </button>
          </div>
        )}
      </div>

      {/* WONDERBOY HERO */}
      <div
        style={{
          width: "100%",
          height: "500px",
          marginBottom: "30px",
          background: "#000",
        }}
      >
        <AVODPlayer src="https://res.cloudinary.com/dbefmxqss/video/upload/v1768880039/aiv-films-wonderboy-trailer_vae68x.mp4" />
      </div>

      {/* ADSENSE BANNER */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "24px 0",
        }}
      >
        <AdsenseBanner />
      </div>

      {/* FULLSCREEN PLAYER */}
      {activeFilm && (
        <div
          onClick={() => setActiveFilm(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 20000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveFilm(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "25px",
              fontSize: "28px",
              background: "none",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              zIndex: 20001,
            }}
          >
            ✕
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "1100px",
              aspectRatio: "16/9",
              background: "#000",
            }}
          >
            {isYouTubeUrl(activeFilm.video_url) ? (
              <iframe
                src={getYouTubeEmbed(activeFilm.video_url)}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                title={activeFilm.title || "Film"}
              />
            ) : (
              <video
                src={activeFilm.video_url}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* FILM ROWS */}
      {Object.entries(categories).map(([section, list]) => (
        <div key={section} style={{ padding: "20px" }}>
          <h2 style={{ marginBottom: "10px" }}>{section}</h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingTop: "20px",
              paddingBottom: "40px",
            }}
          >
            {list.map((film) => {
              const url = film.video_url || "";
              const isYouTube = isYouTubeUrl(url);
              const thumbnail = getThumbnail(film);
              const isExpanded = expandedFilm === film.id;
              const isHovered = hovered === film.id;

              return (
                <div
                  key={`${section}-${film.id}`}
                  onClick={() => {
                    if (expandedFilm === film.id) {
                      setActiveFilm(film);
                    } else {
                      setExpandedFilm(film.id);
                    }
                  }}
                  onMouseEnter={() => setHovered(film.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    width: isHovered || isExpanded ? "320px" : "200px",
                    transition: "all .25s ease",
                    zIndex: isHovered || isExpanded ? 999 : 1,
                    cursor: "pointer",
                  }}
                >
                  {isYouTube ? (
                    <img
                      src={thumbnail}
                      alt={film.title || "Film"}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/320x180?text=No+Preview";
                      }}
                      style={{
                        width: "100%",
                        height: isHovered || isExpanded ? "180px" : "120px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        background: "#222",
                      }}
                    />
                  ) : (
                    <video
                      src={url}
                      muted
                      loop
                      autoPlay={isHovered || isExpanded}
                      controls={isHovered || isExpanded}
                      poster={thumbnail}
                      style={{
                        width: "100%",
                        height: isHovered || isExpanded ? "180px" : "120px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        background: "#222",
                      }}
                    />
                  )}

                  {(isHovered || isExpanded) && (
                    <div
                      style={{
                        background: "#181818",
                        padding: "10px",
                        borderRadius: "0 0 6px 6px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "16px",
                        }}
                      >
                        {film.title || "Untitled Film"}
                      </h4>

                      <p
                        style={{
                          marginTop: "6px",
                          marginBottom: 0,
                          color: "#bbb",
                          fontSize: "12px",
                        }}
                      >
                        👁 {film.views || 0} views
                      </p>

                      <p
                        style={{
                          marginTop: "6px",
                          marginBottom: 0,
                          color: "#ccc",
                          fontSize: "13px",
                        }}
                      >
                        {film.creator || "Independent Creator"}
                      </p>

                      <p
                        style={{
                          marginTop: "6px",
                          marginBottom: 0,
                          color: "#aaa",
                          fontSize: "12px",
                        }}
                      >
                        {film.genre || "AI Film"}{" "}
                        {film.year ? `• ${film.year}` : ""}
                      </p>

                      {film.description && (
                        <p
                          style={{
                            marginTop: "6px",
                            marginBottom: 0,
                            color: "#aaa",
                            fontSize: "12px",
                          }}
                        >
                          {film.description}
                        </p>
                      )}

                      <p
                        style={{
                          marginTop: "8px",
                          marginBottom: 0,
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Click again to play fullscreen
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {list.length === 0 && (
            <div
              style={{
                color: "#999",
                marginTop: "10px",
              }}
            >
              No films found.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}