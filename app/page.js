"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AVODPlayer from "./AVODPlayer";
import { getSupabase } from "../lib/supabase";

const BUNNY_CDN_HOSTNAME = "vz-b7971a5e-657.b-cdn.net";
const FALLBACK_THUMBNAIL = "/no-preview.png";
const BG = "#000";
const CARD_BG = "#181818";
const ACCENT = "#e50914";
const TEXT_SECONDARY = "#b3b3b3";
const TEXT_MUTED = "#808080";

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
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;
}

function isYouTubeUrl(url) {
  return Boolean(url?.includes("youtube.com") || url?.includes("youtu.be"));
}

function FilmThumbnail({ film, alt, style }) {
  const url = film?.video_url || "";
  const candidates = [
    film?.thumbnail_url,
    getYouTubeThumbnail(url),
    getBunnyThumbnail(url),
    FALLBACK_THUMBNAIL,
  ].filter(Boolean);

  const [index, setIndex] = useState(0);
  const currentSrc = candidates[index] || FALLBACK_THUMBNAIL;

  function handleError() {
    setIndex((prev) => (prev + 1 < candidates.length ? prev + 1 : prev));
  }

  return <img src={currentSrc} alt={alt} onError={handleError} style={style} />;
}

export default function Page() {
  const [showMenu, setShowMenu] = useState(false);
  const [films, setFilms] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [activeFilm, setActiveFilm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        console.error("Supabase load error:", error);
        return;
      }
      setFilms(data || []);
    } catch (error) {
      console.error("Load films error:", error);
    }
  }

  const filteredFilms = films.filter((film) => {
    const query = searchTerm.trim().toLowerCase();
    return (
      !query ||
      film.title?.toLowerCase().includes(query) ||
      film.creator?.toLowerCase().includes(query) ||
      film.genre?.toLowerCase().includes(query) ||
      film.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh" }}>
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "14px 24px",
          alignItems: "center",
          background: "rgba(0,0,0,0.95)",
          position: "sticky",
          top: 0,
          zIndex: 9999,
        }}
      >
        <button
          type="button"
          onClick={() => setShowMenu((c) => !c)}
          style={topBarButtonPrimary}
        >
          ☰ Menu
        </button>

        <input
          aria-label="Search films"
          placeholder="Search films..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "9px 12px",
            width: "230px",
            maxWidth: "42vw",
            background: "#222",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />

        <button
          type="button"
          onClick={() => router.push("/submit")}
          style={topBarButtonPrimary}
        >
          + Submit Film
        </button>

        <button
          type="button"
          onClick={() => router.push("/signin")}
          style={topBarButtonSecondary}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => router.push("/support")}
          style={{ ...topBarButtonSecondary, marginLeft: "auto" }}
        >
          Support
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "58px",
              left: "24px",
              background: "#181818",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              padding: "10px",
              zIndex: 10000,
              minWidth: "240px",
              maxHeight: "70vh",
              overflowY: "auto",
              boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
            }}
          >
            {films.map((film) => (
              <button
                key={film.id}
                type="button"
                onClick={() => {
                  setActiveFilm(film);
                  setShowMenu(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  background: "transparent",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2a2a2a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {film.title || "Untitled Film"}
              </button>
            ))}
            {films.length === 0 && (
              <div style={{ color: TEXT_MUTED, padding: "10px", fontSize: "14px" }}>
                No films yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* HERO */}
      <div
        style={{
          width: "100%",
          maxHeight: "500px",
          marginBottom: "24px",
          background: BG,
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%", padding: "0 24px", boxSizing: "border-box" }}>
          <AVODPlayer
            autoPlay
            src={getBunnyStreamUrl(
              "https://player.mediadelivery.net/embed/697977/264c75e3-cf23-4154-a081-98883ca50742"
            )}
          />
        </div>
      </div>

      {/* FULLSCREEN PLAYER */}
      {activeFilm && (
        <div
          onClick={() => setActiveFilm(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.96)",
            zIndex: 20000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            aria-label="Close player"
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
            style={{ width: "90%", maxWidth: "1100px", background: "#000" }}
          >
            <AVODPlayer
              src={
                isYouTubeUrl(activeFilm.video_url)
                  ? activeFilm.video_url
                  : getBunnyStreamUrl(activeFilm.video_url)
              }
            />
            <div style={{ padding: "16px 4px" }}>
              <h2 style={{ fontSize: "22px", margin: "0 0 6px" }}>
                {activeFilm.title || "Untitled Film"}
              </h2>
              <div style={{ fontSize: "14px", color: TEXT_SECONDARY }}>
                {activeFilm.genre || "AI Film"}
                {(activeFilm.release_year || activeFilm.year) &&
                  ` • ${activeFilm.release_year || activeFilm.year}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILM GRID */}
      <div style={{ padding: "0 24px 40px", boxSizing: "border-box", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px 16px",
          }}
        >
          {filteredFilms.map((film, filmIndex) => {
            const isHovered = hovered === film.id;

            return (
              <div
                key={film.id}
                onMouseEnter={() => setHovered(film.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setActiveFilm(film)}
                style={{
                  position: "relative",
                  cursor: "pointer",
                  zIndex: isHovered ? 50 : 1,
                  border: "2px solid lime",               
                 }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, background: "red", color: "white", fontSize: "11px", padding: "2px 6px", zIndex: 999 }}>
                  #{filmIndex} / {film?.id || "NO-ID"} / {film?.title || "NO-TITLE"}
                </div>                <div
                  style={{
                    position: "relative",
                    borderRadius: "4px",
                    overflow: "hidden",
                    background: "#222",
                    aspectRatio: "16 / 9",
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    boxShadow: isHovered
                      ? "0 16px 32px rgba(0,0,0,0.7)"
                      : "0 2px 6px rgba(0,0,0,0.3)",
                  }}
                >
                  <FilmThumbnail
                    film={film}
                    alt={film.title || "Film"}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Bottom gradient, always visible for legibility */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "55%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))",
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#fff",
                        textAlign: "left",
                        marginBottom: isHovered ? "4px" : 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {film.title || "Untitled Film"}
                    </div>

                    {isHovered && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: TEXT_SECONDARY,
                          textAlign: "left",
                        }}
                      >
                        {film.genre || "AI Film"}
                        {(film.release_year || film.year) &&
                          ` • ${film.release_year || film.year}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFilms.length === 0 && (
          <div style={{ color: TEXT_MUTED, marginTop: "16px", fontSize: "14px" }}>
            No films found.
          </div>
        )}
      </div>
    </div>
  );
}

const topBarButtonPrimary = {
  background: ACCENT,
  color: "#fff",
  border: "none",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  borderRadius: "4px",
  fontSize: "14px",
};

const topBarButtonSecondary = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #444",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  borderRadius: "4px",
  fontSize: "14px",
};