"use client"

import { useEffect, useMemo, useState } from "react"

function Row({ title, items, onPlay }) {
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
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => onPlay(it)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onPlay(it)
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.15) 60%, transparent)",
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
  )
}

function ModalPlayer({ open, title, videoUrl, posterUrl, onClose }) {
  // ESC to close + lock background scroll
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose()
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
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ fontWeight: 800, color: "white", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </div>

          <button
            onClick={onClose}
            style={{
              appearance: "none",
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

        {/* Video */}
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
  )
}

export default function HomePage() {
  const [api, setApi] = useState(null)

  // modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTitle, setActiveTitle] = useState("Wonderboy")
  const [activeVideoUrl, setActiveVideoUrl] = useState("")
  const [activePosterUrl, setActivePosterUrl] = useState("")

  useEffect(() => {
    fetch("/api/films", { cache: "no-store" })
      .then((r) => r.json())
      .then(setApi)
      .catch(() => {})
  }, [])

  // Prefer exact working URL from env (your proven good URL)
  const trailerUrl = process.env.NEXT_PUBLIC_AIV_FEATURED_TRAILER_URL || ""

  // Poster = a thumbnail derived from the trailer URL
  const trailerPoster = useMemo(() => {
    if (!trailerUrl) return ""
    return trailerUrl.replace(/\.mp4(\?.*)?$/i, ".jpg")
  }, [trailerUrl])

  const items = useMemo(
    () => [{ id: "wonderboy", title: "Wonderboy", poster: trailerPoster, video: trailerUrl }],
    [trailerPoster, trailerUrl]
  )

  const openPlayer = (item) => {
    setActiveTitle(item?.title || "Wonderboy")
    setActiveVideoUrl(item?.video || trailerUrl)
    setActivePosterUrl(item?.poster || trailerPoster)
    setModalOpen(true)
  }

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh" }}>
      {/* HERO */}
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
            }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "black" }} />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.45) 60%, transparent)",
          }}
        />

        <div style={{ position: "relative", padding: "120px 24px", maxWidth: 720 }}>
          <h1 style={{ fontSize: 64, fontWeight: 900, margin: 0 }}>Wonderboy</h1>
          <p style={{ marginTop: 12, fontSize: 18, marginBottom: 0, opacity: 0.92 }}>
            An AI-generated cinematic experiment.
          </p>

          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => openPlayer(items[0])}
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
              ▶ Play
            </button>

            <button
              onClick={() => alert("Wonderboy\n\nAn AI-generated cinematic experiment.")}
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
              More Info
            </button>
          </div>
        </div>
      </section>

      {/* ROWS */}
      <Row title="Featured" items={items} onPlay={openPlayer} />
      <Row title="Trailers" items={items} onPlay={openPlayer} />
      <Row title="AIV Originals" items={items} onPlay={openPlayer} />

      <ModalPlayer
        open={modalOpen}
        title={activeTitle}
        videoUrl={activeVideoUrl}
        posterUrl={activePosterUrl}
        onClose={() => setModalOpen(false)}
      />
    </main>
  )
}
