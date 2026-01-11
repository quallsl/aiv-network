"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const LIST_KEY = "aiv_my_list_v1";

function useRowRefs() {
  const mapRef = useRef(new Map());
  const get = (key) => mapRef.current.get(key);
  const set = (key, el) => {
    if (el) mapRef.current.set(key, el);
  };
  return { get, set };
}

function scrollRow(el, dir = 1) {
  if (!el) return;
  const amount = Math.floor(el.clientWidth * 0.82);
  el.scrollBy({ left: dir * amount, behavior: "smooth" });
}

function safeLower(s) {
  return String(s || "").toLowerCase();
}

function loadMyList() {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMyList(list) {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
  } catch {}
}

function Modal({ open, item, onClose, onPlay, inList, onToggleList }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.75)",
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
    >
      <div
        style={{
          width: "min(980px, 96vw)",
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.10)",
          background: "#0a0a0a",
          boxShadow: "0 30px 120px rgba(0,0,0,0.75)",
        }}
      >
        <div style={{ position: "relative", height: 420, background: "#111" }}>
          {item?.video ? (
            <video
              src={item.video}
              poster={item.poster}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img src={item.poster} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          )}

          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.20) 65%, rgba(0,0,0,0) 100%)" }} />

          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(0,0,0,0.55)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 900,
            }}
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>

          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 18px 18px" }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.85, marginBottom: 8 }}>
              {item.kind || "film"}
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.05 }}>
              {item.title}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button
                onClick={() => onPlay(item)}
                style={{ background: "#fff", color: "#000", border: "none", padding: "10px 14px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }}
              >
                ▶ Play
              </button>

              <button
                onClick={() => onToggleList(item)}
                style={{
                  background: "rgba(255,255,255,0.10)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.14)",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {inList ? "✓ In My List" : "+ My List"}
              </button>

              <button
                onClick={onClose}
                style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.10)", padding: "10px 14px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: 18, display: "grid", gap: 10 }}>
          <div style={{ opacity: 0.9, fontSize: 14, lineHeight: 1.5 }}>
            <div style={{ opacity: 0.65, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Asset</div>
            <div style={{ fontFamily: "monospace", fontSize: 12, opacity: 0.85, wordBreak: "break-all" }}>
              {item.publicId}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", opacity: 0.9 }}>
            <a
              href={item.video}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", padding: "8px 10px", borderRadius: 10 }}
            >
              Open video URL
            </a>
            <a
              href={item.poster}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)", padding: "8px 10px", borderRadius: 10 }}
            >
              Open poster URL
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [catalog, setCatalog] = useState(null);
  const [err, setErr] = useState("");
  const [muted, setMuted] = useState(true);
  const [hoverRow, setHoverRow] = useState(null);

  // Search (A)
  const [q, setQ] = useState("");

  // My List (B)
  const [myList, setMyList] = useState([]);

  const [modalItem, setModalItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const rowsRefs = useRowRefs();

  useEffect(() => {
    // load list once
    setMyList(loadMyList());
  }, []);

  useEffect(() => {
    saveMyList(myList);
  }, [myList]);

  useEffect(() => {
    let alive = true;
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => { if (alive) setCatalog(j); })
      .catch((e) => { if (alive) setErr(String(e?.message || e)); });
    return () => { alive = false; };
  }, []);

  const featured = useMemo(() => catalog?.featured || null, [catalog]);

  const rowsRaw = useMemo(() => catalog?.rows || [], [catalog]);

  const myListSet = useMemo(() => new Set(myList.map((x) => x.publicId)), [myList]);

  function isInList(item) {
    return !!item?.publicId && myListSet.has(item.publicId);
  }

  function toggleList(item) {
    if (!item?.publicId) return;
    setMyList((prev) => {
      const exists = prev.some((x) => x.publicId === item.publicId);
      if (exists) return prev.filter((x) => x.publicId !== item.publicId);
      // keep a minimal shape, so it survives across catalog changes
      const safe = {
        id: item.id || item.publicId,
        title: item.title || item.publicId,
        publicId: item.publicId,
        kind: item.kind || "film",
        poster: item.poster || "",
        video: item.video || "",
      };
      return [safe, ...prev];
    });
  }

  const rows = useMemo(() => {
    const query = safeLower(q).trim();

    // Build "My List" row at top (even if empty)
    const myRow = { id: "mylist", title: "My List", items: myList };

    if (!query) return [myRow, ...rowsRaw];

    const filtered = rowsRaw
      .map((r) => {
        const items = (r.items || []).filter((it) => {
          const hay = `${it.title || ""} ${it.publicId || ""} ${it.kind || ""}`.toLowerCase();
          return hay.includes(query);
        });
        return { ...r, items };
      })
      .filter((r) => r.id === "featured" || r.id === "trailers" || (r.items || []).length > 0);

    // Filter My List too
    const myFiltered = {
      ...myRow,
      items: myRow.items.filter((it) => {
        const hay = `${it.title || ""} ${it.publicId || ""} ${it.kind || ""}`.toLowerCase();
        return hay.includes(query);
      }),
    };

    return [myFiltered, ...filtered];
  }, [rowsRaw, myList, q]);

  function goWatch(item) {
    if (!item?.publicId) return;
    router.push(`/watch/${encodeURIComponent(item.publicId)}`);
  }

  function openInfo(item) {
    if (!item) return;
    setModalItem(item);
    setModalOpen(true);
  }

  function closeInfo() {
    setModalOpen(false);
  }

  function firstTrailer() {
    const trailers = rowsRaw.find((r) => r.id === "trailers")?.items || [];
    return trailers[0] || null;
  }

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <style>{`
        .rowScroll { scrollbar-width: none; -ms-overflow-style: none; scroll-snap-type: x mandatory; }
        .rowScroll::-webkit-scrollbar { display: none; }
        .tile { scroll-snap-align: start; }
        .searchInput::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>

      <Modal
        open={modalOpen}
        item={modalItem}
        onClose={closeInfo}
        onPlay={(it) => { closeInfo(); goWatch(it); }}
        inList={isInList(modalItem)}
        onToggleList={toggleList}
      />

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(10px)",
          background: "rgba(0,0,0,0.65)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 900, letterSpacing: 1, fontSize: 18 }}>AIV</div>

          {/* Search (A) */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <input
              className="searchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles…"
              style={{
                width: "min(560px, 92%)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 999,
                padding: "10px 14px",
                outline: "none",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 14, opacity: 0.9, fontSize: 14, whiteSpace: "nowrap" }}>
            <span>Home</span>
            <span style={{ opacity: 0.5 }}>Catalog</span>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section style={{ position: "relative" }}>
          <div style={{ position: "relative", height: "72vh", minHeight: 540, overflow: "hidden" }}>
            {featured?.video ? (
              <video
                key={featured.video}
                src={featured.video}
                poster={featured.poster}
                autoPlay
                muted={muted}
                loop
                playsInline
                preload="metadata"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#111" }} />
            )}

            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 80%)" }} />

            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
              <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 18px 48px" }}>
                <div style={{ maxWidth: 660 }}>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.8, marginBottom: 10 }}>
                    AIV Originals
                  </div>
                  <h1 style={{ margin: 0, fontSize: 56, lineHeight: 1.02, letterSpacing: -1 }}>
                    {featured?.title || "Loading…"}
                  </h1>
                  <p style={{ marginTop: 12, opacity: 0.85, fontSize: 16, lineHeight: 1.5 }}>
                    Search + My List are live. Click a tile to watch. Use Info for details.
                  </p>

                  <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                    <button
                      onClick={() => featured && goWatch(featured)}
                      style={{ background: "#fff", color: "#000", border: "none", padding: "10px 14px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }}
                      disabled={!featured}
                    >
                      ▶ Play
                    </button>

                    <button
                      onClick={() => {
                        const t = firstTrailer();
                        if (t) goWatch(t);
                      }}
                      style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", padding: "10px 14px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }}
                    >
                      Trailer
                    </button>

                    <button
                      onClick={() => featured && openInfo(featured)}
                      style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 14px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }}
                      disabled={!featured}
                    >
                      More Info
                    </button>

                    <button
                      onClick={() => featured && toggleList(featured)}
                      style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 14px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }}
                      disabled={!featured}
                    >
                      {isInList(featured) ? "✓ In My List" : "+ My List"}
                    </button>

                    <button
                      onClick={() => setMuted((m) => !m)}
                      style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)", padding: "10px 14px", borderRadius: 10, fontWeight: 900, cursor: "pointer" }}
                    >
                      {muted ? "🔇" : "🔊"}
                    </button>
                  </div>

                  {err ? (
                    <div style={{ marginTop: 14, color: "#ff7a7a", fontFamily: "monospace", fontSize: 12 }}>
                      {err}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROWS */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 18px 70px" }}>
          {!catalog ? (
            <div style={{ marginTop: 14, opacity: 0.75 }}>Loading catalog…</div>
          ) : (
            rows.map((row) => {
              const showArrows = hoverRow === row.id;
              const empty = (row.items || []).length === 0;
              return (
                <div
                  key={row.id}
                  style={{ marginTop: 18, opacity: empty && row.id !== "mylist" ? 0.5 : 1 }}
                  onMouseEnter={() => setHoverRow(row.id)}
                  onMouseLeave={() => setHoverRow(null)}
                >
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <h2 style={{ margin: 0, fontSize: 18 }}>{row.title}</h2>
                    <div style={{ fontSize: 12, opacity: 0.55 }}>{row.items?.length || 0} items</div>
                  </div>

                  {row.id === "mylist" && empty ? (
                    <div style={{ marginTop: 10, opacity: 0.75 }}>
                      Your list is empty. Click <b>+ My List</b> on any title.
                    </div>
                  ) : null}

                  <div style={{ position: "relative" }}>
                    <button
                      aria-label="Scroll left"
                      onClick={() => scrollRow(rowsRefs.get(row.id), -1)}
                      style={{
                        position: "absolute",
                        left: -6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 5,
                        width: 40,
                        height: 64,
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        cursor: "pointer",
                        opacity: showArrows ? 1 : 0,
                        pointerEvents: showArrows ? "auto" : "none",
                        transition: "opacity 180ms ease",
                      }}
                      title="Left"
                    >
                      ‹
                    </button>

                    <button
                      aria-label="Scroll right"
                      onClick={() => scrollRow(rowsRefs.get(row.id), 1)}
                      style={{
                        position: "absolute",
                        right: -6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 5,
                        width: 40,
                        height: 64,
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        cursor: "pointer",
                        opacity: showArrows ? 1 : 0,
                        pointerEvents: showArrows ? "auto" : "none",
                        transition: "opacity 180ms ease",
                      }}
                      title="Right"
                    >
                      ›
                    </button>

                    <div
                      ref={(el) => rowsRefs.set(row.id, el)}
                      className="rowScroll"
                      style={{ display: "flex", gap: 12, overflowX: "auto", padding: "14px 0 8px" }}
                    >
                      {(row.items || []).map((it) => (
                        <div key={it.id} style={{ width: 240 }}>
                          <button
                            onClick={() => goWatch(it)}
                            style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", textAlign: "left", width: "100%" }}
                            title={`${it.title}${it.kind ? ` • ${it.kind}` : ""}`}
                          >
                            <div
                              className="tile"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.06)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                                e.currentTarget.style.boxShadow = "0 18px 50px rgba(0,0,0,0.60)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.45)";
                              }}
                              style={{
                                width: "100%",
                                height: 135,
                                borderRadius: 14,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.10)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                                transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                                background: "#111",
                                position: "relative",
                              }}
                            >
                              <img src={it.poster} alt={it.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                              {it.kind ? (
                                <div
                                  style={{
                                    position: "absolute",
                                    left: 10,
                                    bottom: 10,
                                    padding: "4px 8px",
                                    fontSize: 11,
                                    fontWeight: 900,
                                    letterSpacing: 0.6,
                                    textTransform: "uppercase",
                                    borderRadius: 999,
                                    border: "1px solid rgba(255,255,255,0.16)",
                                    background: "rgba(0,0,0,0.45)",
                                  }}
                                >
                                  {it.kind}
                                </div>
                              ) : null}
                            </div>
                          </button>

                          <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ fontSize: 13, opacity: 0.9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {it.title}
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                onClick={() => toggleList(it)}
                                style={{
                                  border: "1px solid rgba(255,255,255,0.14)",
                                  background: "rgba(255,255,255,0.06)",
                                  color: "#fff",
                                  padding: "6px 10px",
                                  borderRadius: 10,
                                  cursor: "pointer",
                                  fontWeight: 900,
                                  fontSize: 12,
                                  whiteSpace: "nowrap",
                                }}
                                title="My List"
                              >
                                {isInList(it) ? "✓" : "+"}
                              </button>

                              <button
                                onClick={() => openInfo(it)}
                                style={{
                                  border: "1px solid rgba(255,255,255,0.14)",
                                  background: "rgba(255,255,255,0.06)",
                                  color: "#fff",
                                  padding: "6px 10px",
                                  borderRadius: 10,
                                  cursor: "pointer",
                                  fontWeight: 900,
                                  fontSize: 12,
                                  whiteSpace: "nowrap",
                                }}
                                title="More Info"
                              >
                                Info
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
