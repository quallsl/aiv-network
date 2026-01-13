"use client"

import { useEffect, useMemo, useState } from "react"

function cloudinaryVideoUrl(cloudName, publicId) {
  if (!cloudName || !publicId) return null
  // publicId should NOT include file extension; we append .mp4 for consistency
  return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`
}

function cloudinaryImageUrl(cloudName, publicId) {
  if (!cloudName || !publicId) return null
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.jpg`
}

function Row({ title, items }) {
  if (!items || items.length === 0) return null
  return (
    <section style={{ marginTop: 22 }}>
      <h2 style={{ padding: "0 24px", fontSize: 18, fontWeight: 700 }}>{title}</h2>
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          padding: "10px 24px 6px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((it) => (
          <div
            key={it.id || it.publicId || it.title}
            style={{
              minWidth: 160,
              width: 160,
              borderRadius: 12,
              overflow: "hidden",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              transform: "translateZ(0)",
            }}
            title={it.title || it.id}
          >
            {it.posterUrl ? (
              <img
                src={it.posterUrl}
                alt={it.title || "Poster"}
                style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ width: "100%", height: 240, display: "grid", placeItems: "center" }}>
                <span style={{ opacity: 0.7, fontSize: 12 }}>No poster</span>
              </div>
            )}
            <div style={{ padding: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: "16px" }}>
                {it.title || it.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
  const trailerPublicId = process.env.NEXT_PUBLIC_AIV_FEATURED_TRAILER_ID || ""
  const featuredTitle = process.env.NEXT_PUBLIC_AIV_FEATURED_TITLE || "Wonderboy"
  const featuredTagline =
    process.env.NEXT_PUBLIC_AIV_FEATURED_TAGLINE || "An AI-generated cinematic experiment."

  // Optional poster publicId if you have one; leave blank if not.
  const posterPublicId = process.env.NEXT_PUBLIC_AIV_FEATURED_POSTER_ID || ""

  const heroVideo = useMemo(
    () => cloudinaryVideoUrl(cloudName, trailerPublicId),
    [cloudName, trailerPublicId]
  )

  const heroPoster = useMemo(
    () => cloudinaryImageUrl(cloudName, posterPublicId),
    [cloudName, posterPublicId]
  )

  const [rows, setRows] = useState([])

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/films", { cache: "no-store" })
        const json = await res.json()

        // Try multiple shapes safely
        const apiRows =
          json?.catalog?.rows ||
          json?.rows ||
          json?.data?.rows ||
          []

        // Normalize items -> posterUrl if possible
        const normalized = Array.isArray(apiRows)
          ? apiRows.map((r) => {
              const items = Array.isArray(r.items) ? r.items : []
              return {
                title: r.title || r.name || "Row",
                items: items.map((it) => ({
                  ...it,
                  // try common fields for poster public id
                  posterUrl:
                    it.posterUrl ||
                    (cloudName && it.poster
                      ? cloudinaryImageUrl(cloudName, it.poster)
                      : null) ||
                    (cloudName && it.posterPublicId
                      ? cloudinaryImageUrl(cloudName, it.posterPublicId)
                      : null) ||
                    null,
                })),
              }
            })
          : []

        if (isMounted) setRows(normalized)
      } catch {
        // If API fails, keep rows empty (no crash)
        if (isMounted) setRows([])
      }
    })()
    return () => {
      isMounted = false
    }
  }, [cloudName])

  // Fallback demo rows if API returns nothing (keeps “Netflix feel”)
  const fallbackRows = [
    {
      title: "Featured",
      items: [
        {
          id: "featured",
          title: featuredTitle,
          posterUrl: heroPoster,
        },
      ],
    },
  ]

  const renderRows = rows.length > 0 ? rows : fallbackRows

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh" }}>
      {/* HERO */}
      <section style={{ position: "relative", height: "92vh", overflow: "hidden" }}>
        {/* HERO VIDEO (bulletproof: never renders if heroVideo is empty) */}
        {typeof heroVideo === "string" && heroVideo.length > 0 && (
          <video
            key={heroVideo}
            src={heroVideo}
            poster={heroPoster || undefined}
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
        )}

        {/* Overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 10%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)" }} />

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 720, padding: "0 24px" }}>
          <div style={{ height: 90 }} />
          <h1 style={{ fontSize: 56, lineHeight: "58px", fontWeight: 900, margin: 0 }}>
            {featuredTitle}
          </h1>
          <p style={{ marginTop: 14, fontSize: 18, opacity: 0.9, maxWidth: 560 }}>
            {featuredTagline}
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              style={{
                background: "white",
                color: "black",
                border: "none",
                padding: "12px 18px",
                borderRadius: 10,
                fontWeight: 800,
                cursor: "pointer",
              }}
              onClick={() => {
                // simple: scroll a bit to rows; you can wire this to a player/modal later
                window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" })
              }}
            >
              ▶ Play
            </button>

            <button
              style={{
                background: "rgba(120,120,120,0.35)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.18)",
                padding: "12px 18px",
                borderRadius: 10,
                fontWeight: 800,
                cursor: "pointer",
              }}
              onClick={() => alert(`${featuredTitle}\n\n${featuredTagline}`)}
            >
              More Info
            </button>
          </div>
        </div>

        {/* Bottom fade into rows */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -1, height: 140, background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 95%)" }} />
      </section>

      {/* ROWS */}
      <div style={{ paddingBottom: 40 }}>
        {renderRows.map((r) => (
          <Row key={r.title} title={r.title} items={r.items} />
        ))}
      </div>
    </main>
  )
}
