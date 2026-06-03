"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#111] border-b border-gray-800">
      
      {/* LEFT: LOGO + TABS */}
      <div className="flex items-center gap-8">
        
        {/* LOGO */}
        <h1 className="text-red-600 text-2xl font-bold">AIV</h1>

        {/* TABS */}
        <div className="flex gap-6 text-sm">
          <span className="text-white border-b-2 border-red-600 pb-1">
            Movies
          </span>
          <span className="text-gray-400 hover:text-white cursor-pointer">
            TV Shows
          </span>
          <span className="text-gray-400 hover:text-white cursor-pointer">
            Anime
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        
        {/* SEARCH */}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch?.(e.target.value);
          }}
          placeholder="Search..."
          className="bg-black border border-gray-700 px-3 py-1 rounded text-sm"
        />

        {/* SUBMIT FILM BUTTON */}
        <Link href="/submit">
          <button className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-sm font-medium">
            Submit Film
          </button>
        </Link>

        {/* PROFILE */}
        <div className="w-8 h-8 bg-gray-600 rounded-full" />
      </div>
    </div>
  );
}