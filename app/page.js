"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [catalog, setCatalog] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        if (!j?.ok) throw new Error("Catalog API returned not ok");
        setCatalog(j);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(String(e?.message || e));
      });
    return () => { alive = false; };
  }, []);

  const featured = catalog?.featured || null;

  // Netflix behavior:
  // - Hero autoplay = trailer
  // - Play button = feature
  const trailerItem = useMemo(() => {
    const trailersRow = (catalog?.rows || []).find((r) => r.id === "trailers");
    return trailersRow?.items?.[0] || null;
  }, [catalog]);

  const heroVideo = trailerItem?.video || "";
  const heroPoster = trailerItem?.poster || "";
  const playHref = featured?.publicId ? `/watch/${encodeURIComponent(featured.publicId)}` : "#";

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 18px" }}>
        <header style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>AIV Network</h1>
          <div style={{ opacity: 0.75 }}>Trailer hero + Feature play</div>
        </header>

        {err ? (
          <div style={{ padding: 14, border: "1px solid #333", borderRadius: 12, background: "#0b0b0b" }}>
            Error: {err}
          </div>
        ) : null}

        {/* HERO */}
        <section
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #1c1c1c",
            background: "#050505",
            boxShadow: "0 20px 80px rgba(0,0,0,0.65)",
            marginBottom: 22,
          }}
        >
          <div style={{ position: "relative" }}>
            <video
              key={heroVideo}
              src={heroVideo}
              poster={heroPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{ width: "100%", display: "block" }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0) 100%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "absolute", left: 24, bottom: 22, right: 24 }}>
              <div style={{ maxWidth: 680 }}>
                <h2 style={{ margin: 0, fontSize: 42, fontWeight: 900, letterSpacing: -0.6 }}>
                  {featured?.title || trailerItem?.title || "Featured"}
                </h2>
                <div style={{ marginTop: 10, opacity: 0.85 }}>
                  Autoplaying trailer. Press Play to watch the full feature.
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                  <Link
                    href={playHref}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 16px",
                      borderRadius: 10,
                      background: "#fff",
                      color: "#000",
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    ▶ Play
                  </Link>
                </div>

                <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
                  heroPoster: {heroPoster ? "ok" : "(missing)"} • heroVideo: {heroVideo ? "ok" : "(missing)"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROWS */}
        {!catalog ? (
          <div style={{ opacity: 0.8 }}>Loading catalog…</div>
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            {(catalog.rows || []).map((row) => (
              <section key={row.id}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: 18, fontWeight: 800 }}>{row.title}</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  {(row.items || []).map((item) => (
                    <Link
                      key={item.id}
                      href={`/watch/${encodeURIComponent(item.publicId)}`}
                      style={{
                        textDecoration: "none",
                        color: "#fff",
                        borderRadius: 12,
                        overflow: "hidden",
                        border: "1px solid #1c1c1c",
                        background: "#0b0b0b",
                        display: "block",
                      }}
                    >
                      <div style={{ aspectRatio: "16/9", background: "#111" }}>
                        <img
                          src={item.poster}
                          alt={item.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          loading="lazy"
                        />
                      </div>
                      <div style={{ padding: 10, fontWeight: 700, fontSize: 13, opacity: 0.95 }}>
                        {item.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
