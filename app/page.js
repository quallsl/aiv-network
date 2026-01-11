"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function videoUrl(cloud, publicId) {
  if (!cloud || !publicId) return "";
  const id = String(publicId).replace(/^\/+/, "");
  return `https://res.cloudinary.com/${cloud}/video/upload/f_mp4,vc_h264/${id}.mp4`;
}

function posterUrl(cloud, publicId) {
  if (!cloud || !publicId) return "";
  const id = String(publicId).replace(/^\/+/, "");
  return `https://res.cloudinary.com/${cloud}/video/upload/so_2,f_jpg,q_auto:good,w_1280/${id}.jpg`;
}

export default function HomePage() {
  const cloud =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NA ||
    "";

  const featuredId = process.env.NEXT_PUBLIC_AIV_FEATURED_ID || "wonderboy";
  const trailerId = process.env.NEXT_PUBLIC_AIV_TRAILER_ID || "";

  const [catalog, setCatalog] = useState(null);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (alive) setCatalog(j);
      })
      .catch((e) => {
        if (alive) setErr(String(e?.message || e));
      });
    return () => {
      alive = false;
    };
  }, []);

  const featured = useMemo(() => {
    // Prefer API featured if present, else env-based featured
    const apiFeatured = catalog?.featured?.publicId ? catalog.featured : null;
    return (
      apiFeatured || {
        title: "Wonderboy",
        publicId: featuredId,
      }
    );
  }, [catalog, featuredId]);

  const heroTrailerSrc = useMemo(() => {
    // Trailer should stay exactly as provided (yours works as a full id)
    return videoUrl(cloud, trailerId || "");
  }, [cloud, trailerId]);

  const heroFeatureSrc = useMemo(() => videoUrl(cloud, featured.publicId), [cloud, featured.publicId]);
  const heroPoster = useMemo(() => posterUrl(cloud, featured.publicId), [cloud, featured.publicId]);

  const rows = useMemo(() => {
    const apiRows = Array.isArray(catalog?.rows) ? catalog.rows : [];
    // Flatten row items for search
    const all = [];
    for (const r of apiRows) {
      const items = Array.isArray(r?.items) ? r.items : [];
      for (const it of items) all.push(it);
    }
    const q = query.trim().toLowerCase();
    const filtered =
      q.length === 0
        ? apiRows
        : [
            {
              id: "search",
              title: `Search results`,
              items: all.filter((it) => {
                const t = String(it?.title || "").toLowerCase();
                const id = String(it?.publicId || it?.id || "").toLowerCase();
                return t.includes(q) || id.includes(q);
              }),
            },
          ];
    return filtered;
  }, [catalog, query]);

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(10px)",
          background: "rgba(0,0,0,0.7)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 16px", display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontWeight: 800, letterSpacing: 0.5, fontSize: 18 }}>AIV Network</div>
          <div style={{ flex: 1 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles..."
            style={{
              width: 320,
              maxWidth: "60vw",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              borderRadius: 999,
              padding: "10px 14px",
              outline: "none",
            }}
          />
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 16px 0" }}>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)" }}>
            {/* Trailer video */}
            <video
              key={heroTrailerSrc || "no-trailer"}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroPoster}
              style={{ width: "100%", display: "block", aspectRatio: "16/9", background: "#111" }}
              src={heroTrailerSrc || heroFeatureSrc}
            />

            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.0) 70%), linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.9) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Hero text + buttons */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "62%", padding: 22, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12 }}>
              <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.05 }}>{featured?.title || "Wonderboy"}</div>
              <div style={{ opacity: 0.9, maxWidth: 520, lineHeight: 1.35 }}>
                Trailer autoplays. Hit Play to open the full feature.
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <Link
                  href={`/watch/${encodeURIComponent(featuredId || "wonderboy")}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "12px 18px",
                    borderRadius: 10,
                    background: "#fff",
                    color: "#000",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  ▶ Play
                </Link>

                <a
                  href={heroFeatureSrc}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 18px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.10)",
                    color: "#fff",
                    fontWeight: 700,
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  Feature Source
                </a>
              </div>

              <div style={{ fontSize: 12, opacity: 0.7 }}>
                featured publicId: <code style={{ opacity: 0.9 }}>{featured?.publicId}</code> • trailer publicId:{" "}
                <code style={{ opacity: 0.9 }}>{trailerId || "(none)"}</code>
              </div>

              {err ? <div style={{ marginTop: 6, color: "#ffb4b4" }}>Catalog error: {err}</div> : null}
            </div>
          </div>
        </div>
      </section>

      {/* ROWS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 16px 40px" }}>
        {rows?.length ? (
          rows.map((row) => {
            const items = Array.isArray(row?.items) ? row.items : [];
            if (items.length === 0) return null;
            return (
              <div key={row.id || row.title} style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>{row.title || "Row"}</div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  {items.map((it) => {
                    const pid = it.publicId || it.id;
                    const t = it.title || pid || "Untitled";
                    const img = it.poster || posterUrl(cloud, pid);
                    return (
                      <Link
                        key={pid}
                        href={`/watch/${encodeURIComponent(pid || "")}`}
                        style={{
                          textDecoration: "none",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "rgba(255,255,255,0.04)",
                        }}
                      >
                        <div style={{ aspectRatio: "16/9", background: "#111" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={t}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            loading="lazy"
                          />
                        </div>
                        <div style={{ padding: 10 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>{t}</div>
                          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6, wordBreak: "break-word" }}>{pid}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ opacity: 0.85, paddingTop: 18 }}>Catalog not loaded yet.</div>
        )}
      </section>
    </main>
  );
}
