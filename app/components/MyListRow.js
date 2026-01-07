"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readMyList, toggleMyList } from "./storage";

export default function MyListRow() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readMyList());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">My List</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.watchId}
            href={`/watch/${encodeURIComponent(item.watchId)}`}
            className="block w-[160px] shrink-0 md:w-[200px]"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 relative">
              <img
                src={item.poster}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white ring-1 ring-white/10 hover:bg-black/80"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMyList(item);
                  setItems((prev) => prev.filter((x) => x.watchId !== item.watchId));
                }}
              >
                Remove
              </button>
            </div>

            <div className="mt-2 text-sm">{item.title}</div>
            <div className="text-xs text-white/60">
              {item.year} · {item.duration}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
