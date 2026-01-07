"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { readProgress, removeProgress } from "./storage";

export default function ContinueWatchingRow() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const all = readProgress();
    const list = Object.entries(all)
      .map(([watchId, v]) => ({ watchId, ...v }))
      .filter((x) => x.duration && x.currentTime >= 3) // avoid noise
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 12);

    setItems(list);
  }, []);

  const hasItems = items.length > 0;

  const formatPct = (t, d) => {
    if (!d || d <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((t / d) * 100)));
    };

  if (!hasItems) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">Continue Watching</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const pct = formatPct(item.currentTime, item.duration);

          return (
            <Link
              key={item.watchId}
              href={`/watch/${encodeURIComponent(item.watchId)}`}
              className="block w-[160px] shrink-0 md:w-[200px]"
            >
              <div className="aspect-[2/3] overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 relative">
                <img
                  src={item.poster}
                  alt={item.title || item.watchId}
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-0 right-0 bottom-0 bg-black/60">
                  <div className="h-1 bg-white/20">
                    <div className="h-1 bg-white" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <button
                  type="button"
                  className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white ring-1 ring-white/10 hover:bg-black/80"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeProgress(item.watchId);
                    setItems((prev) => prev.filter((x) => x.watchId !== item.watchId));
                  }}
                >
                  Remove
                </button>
              </div>

              <div className="mt-2 text-sm">{item.title || "Untitled"}</div>
              <div className="text-xs text-white/60">
                {item.year ? `${item.year} · ` : ""}{item.durationText || ""}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
