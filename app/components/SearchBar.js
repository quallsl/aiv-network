"use client";

import { useState } from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search titles, genres, tags…"
        className="w-full rounded-xl bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:ring-white/30"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}
