"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroCarousel({ items = [] }) {
  const [index, setIndex] = useState(0);

  const current = items[index];

  // AUTO SLIDE
  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  if (!current) return null;

  const featureId = current?.watchId || current?.id;

  return (
    <section className="relative w-full h-[520px] overflow-hidden mb-10">
      
      {/* IMAGE */}
      <img
        src={current.backdrop || current.poster}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* GRADIENTS */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* CONTENT */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 max-w-xl space-y-5">
        
        <h1 className="text-5xl font-bold text-white">
          {current.title}
        </h1>

        <p className="text-gray-300 line-clamp-3">
          {current.synopsis}
        </p>

        <Link
          href={`/watch/${featureId}`}
          className="bg-red-600 px-6 py-3 rounded text-white font-semibold"
        >
          ▶ Watch Now
        </Link>
      </div>

      {/* ARROWS */}
      <button
        onClick={() =>
          setIndex((prev) => (prev - 1 + items.length) % items.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full"
      >
        ◀
      </button>

      <button
        onClick={() =>
          setIndex((prev) => (prev + 1) % items.length)
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full"
      >
        ▶
      </button>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-red-600" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}