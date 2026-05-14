"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

function Row({ title, items, onPlay }) {
  if (!items?.length) return null;

  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ padding: "0 24px", fontSize: 22, fontWeight: 700 }}>{title}</h2>

      <div style={{ display: "flex", gap: 16, padding: "14px 24px", overflowX: "auto" }}>
        {items.map((it) => (
          <div
            key={it.id}
            role="button"
            tabIndex={0}
            style={{
              minWidth: 180,
              height: 260,
              borderRadius: 12,
              backgroundImage: it.poster ? `url(${it.poster})` : "linear-gradient(135deg, #333, #000)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              cursor: "pointer",
              transition: "transform 0.25s ease",
              outline: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => onPlay(it)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onPlay(it);
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.15) 60%, transparent)",
                borderRadius: 12,
              }}
            />
            <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
              <div style={{ fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                {it.title}
              </div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>▶ Play</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModalPlayer({ open, title, videoUrl, posterUrl, onClose }) {
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.82)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "min(1100px, 96vw)",
          borderRadius: 16,
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 20px 80px rgba(0,0,0,0.65)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ fontWeight: 800, color: "white" }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              padding: "8px 10px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#000" }}>
          <video
            src={videoUrl}
            poster={posterUrl || undefined}
            controls
            autoPlay
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTitle, setActiveTitle] = useState("Wonderboy");
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [activePosterUrl, setActivePosterUrl] = useState("");

  const trailerUrl = process.env.NEXT_PUBLIC_AIV_FEATURED_TRAILER_URL || "";
  const featureUrl = process.env.NEXT_PUBLIC_AIV_FEATURED_FEATURE_URL || "";

  const posterFromVideo = (url) => (url ? url.replace(/\.mp4(\?.*)?$/i, ".jpg") : "");

  const trailerPoster = useMemo(() => posterFromVideo(trailerUrl), [trailerUrl]);
  const featurePoster = useMemo(() => posterFromVideo(featureUrl) || trailerPoster, [featureUrl, trailerPoster]);

  const featuredItem = useMemo(
    () => ({
      id: "wonderboy-feature",
      title: "Wonderboy (Feature)",
      poster: featurePoster,
      video: featureUrl,
    }),
    [featurePoster, featureUrl]
  );

  const trailerItem = useMemo(
    () => ({
      id: "wonderboy-trailer",
      title: "Wonderboy (Trailer)",
      poster: trailerPoster,
      video: trailerUrl,
    }),
    [trailerPoster, trailerUrl]
  );

  const openPlayer = (item) => {
    setActiveTitle(item?.title || "Wonderboy");
    setActiveVideoUrl(item?.video || "");
    setActivePosterUrl(item?.poster || "");
    setModalOpen(true);
  };

  return (
        <main style={{ background: "black", color: "white", minHeight: "100vh" }}>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 20, borderBottom: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px" }}>
          <div style={{ fontWeight: 800, letterSpacing: ".04em" }}>AIV Network</div>
          <div style={{ display: "flex", gap: 14 }}>
            <Link href="/catalog" style={{ color: "white", opacity: 0.85 }}>Catalog</Link>
            <Link href="/submit" style={{ color: "white", opacity: 0.85 }}>Submit</Link>
          </div>
        </div>
      </header>
      <section style={{ position: "relative", height: "92vh", overflow: "hidden" }}>
        {trailerUrl ? (
          <video
            src={trailerUrl}
            poster={trailerPoster || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "contrast(1.05) saturate(1.05)",
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "black" }} />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.96), rgba(0,0,0,0.45) 60%, transparent)",
          }}
        />

        <div style={{ position: "relative", padding: "120px 24px", maxWidth: 760 }}>
          <h1 style={{ fontSize: 64, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>
            Wonderboy
          </h1>

          <p style={{ marginTop: 12, fontSize: 18, marginBottom: 0, opacity: 0.92 }}>
            An AI-generated cinematic experience.
          </p>

          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => openPlayer(featuredItem)}
              style={{
                padding: "12px 20px",
                fontWeight: 900,
                borderRadius: 10,
                border: "none",
                background: "white",
                color: "black",
                cursor: "pointer",
              }}
            >
              ▶ Play Feature
            </button>

            <Link href="/submit">
              <button
                style={{
                  background: "white",
                  color: "black",
                  padding: "12px 20px",
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                + Submit Film
              </button>
            </Link>

            <button
              onClick={() => openPlayer(trailerItem)}
              style={{
                padding: "12px 20px",
                fontWeight: 900,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.10)",
                color: "white",
                cursor: "pointer",
              }}
            >
              ▶ Play Trailer
            </button>

            <button
              onClick={() => alert("Wonderboy\n\nAn AI-generated cinematic experiment.")}
              style={{
                padding: "12px 20px",
                fontWeight: 900,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                cursor: "pointer",
              }}
            >
              More Info
            </button>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -1,
            height: 140,
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 95%)",
          }}
        />
      </section>

      <Row title="Featured" items={[featuredItem]} onPlay={openPlayer} />
      <Row title="Trailers" items={[trailerItem]} onPlay={openPlayer} />
      <Row title="AIV Originals" items={[featuredItem]} onPlay={openPlayer} />

      <ModalPlayer
        open={modalOpen}
        title={activeTitle}
        videoUrl={activeVideoUrl}
        posterUrl={activePosterUrl}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}