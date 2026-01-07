"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Nav({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
    <nav className="sticky top-0 z-50 flex items-center gap-4 bg-black/80 px-4 py-3 backdrop-blur md:px-10">
      <div className="text-lg font-semibold tracking-tight">AIV</div>

      <SearchBar
        value={query}
        onChange={(q) => {
          setQuery(q);
          onSearch?.(q);
        }}
      />
    </nav>
  );
}
