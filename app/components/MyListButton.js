"use client";

import { useEffect, useState } from "react";
import { isInMyList, toggleMyList } from "./storage";

export default function MyListButton({ item, variant = "ghost" }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInMyList(item.watchId));
  }, [item.watchId]);

  const base =
    variant === "solid"
      ? "rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
      : "rounded-lg bg-black/50 px-3 py-2 text-xs font-semibold text-white hover:bg-black/70 ring-1 ring-white/10";

  return (
    <button
      type="button"
      className={base}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const { exists } = toggleMyList(item);
        setSaved(exists);
      }}
      aria-label={saved ? "Remove from My List" : "Add to My List"}
      title={saved ? "Remove from My List" : "Add to My List"}
    >
      {saved ? "✓ In My List" : "+ My List"}
    </button>
  );
}
