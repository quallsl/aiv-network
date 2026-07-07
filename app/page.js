"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AVODPlayer from "./AVODPlayer";
import { getSupabase } from "../lib/supabase";

const BUNNY_CDN_HOSTNAME = "vz-b7971a5e-657.b-cdn.net";

function parseBunnyUrl(url) {
  if (!url) return null;

  const match = url.match(
    /player\.mediadelivery\.net\/(?:play|embed)\/(\d+)\/([a-f0-9-]+)/i
  );

  if (!match) return null;

  const [, libraryId, videoId] = match;
  return { libraryId, videoId };
}

function getBunnyStreamUrl(url) {
  const parsed = parseBunnyUrl(url);
  if (!parsed) return url;

  return `https://${BUNNY_CDN_HOSTNAME}/${parsed.videoId}/playlist.m3u8`;
}

function getBunnyPreviewUrl(url) {
  const parsed = parseBunnyUrl(url);
  if (!parsed) return url;

  return `https://${BUNNY_CDN_HOSTNAME}/${parsed.videoId}/play_480p.mp4`;
}

function getBunnyThumbnail(url) {
  const parsed = parseBunnyUrl(url);
  if (!parsed) return null;

  return `https://${BUNNY_CDN_HOSTNAME}/${parsed.videoId}/thumbnail.jpg`;
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
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

function isYouTubeUrl(url) {
  return url?.includes("youtube.com") || url?.includes("youtu.be");
}

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

  function getThumbnail(film) {
    const url = film?.video_url || "";

    return (
      film?.thumbnail_url ||
      getYouTubeThumbnail(url) ||
      getBunnyThumbnail(url) ||
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
          gap: "6px",
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

      {/* HERO */}
      <div
        style={{
          width: "100%",
          height: "500px",
          marginBottom: "8px",
          background: "#000",
        }}
      >
        <AVODPlayer
          autoPlay
          src={getBunnyStreamUrl(
            "https://player.mediadelivery.net/embed/697977/489bb454-5cb1-46ee-9353-09ebc899f726"
          )}
        />
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
            <AVODPlayer
              src={
                isYouTubeUrl(activeFilm.video_url)
                  ? activeFilm.video_url
                  : getBunnyStreamUrl(activeFilm.video_url)
              }
            />
          </div>
        </div>
      )}

      {/* FILM ROWS */}
      {Object.entries(categories).map(([section, list], sectionIndex) => (
        <div
          key={section}
          style={{
            padding: "20px",
            paddingTop: sectionIndex === 0 ? "8px" : "20px",
          }}
        >
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
              const previewUrl = isYouTube ? null : getBunnyPreviewUrl(url);
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
                      src={isHovered || isExpanded ? previewUrl : undefined}
                      muted
                      loop
                      autoPlay={isHovered || isExpanded}
                      controls={false}
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
                        padding: "16px",
                        borderRadius: "0 0 8px 8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "24px",
                          fontWeight: "700",
                          lineHeight: "1.2",
                          color: "#fff",
                        }}
                      >
                        {film.title || "Untitled Film"}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "15px",
                          color: "#cfcfcf",
                        }}
                      >
                        <span>👁 {film.views || 0} views</span>
                      </div>

                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#ffffff",
                        }}
                      >
                        {film.creator || "Independent Creator"}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                          fontSize: "15px",
                          color: "#b5b5b5",
                        }}
                      >
                        <span>{film.genre || "AI Film"}</span>
                        {film.year && <span>• {film.year}</span>}
                      </div>

                      {film.description && (
                        <p
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            lineHeight: "1.6",
                            color: "#d8d8d8",
                          }}
                        >
                          {film.description}
                        </p>
                      )}

                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "#ffffff",
                        }}
                      >
                        Click again to play fullscreen
                      </div>
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