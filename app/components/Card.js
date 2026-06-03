"use client";

import { useState } from "react";
import VideoModal from "./VideoModal";

export default function Card({ item }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="relative w-[180px] h-[260px] flex-shrink-0 group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        {/* BASE IMAGE */}
        <img
           src={item?.poster || "https://picsum.photos/300/450"}
           alt={item?.title || "Poster"}
           className="w-[180px] h-[260px] object-cover rounded-md"
        />

        {/* HOVER CARD */}
        {hovered && (
          <div
            className="
              absolute 
              top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2
              w-[320px]
              z-[999]
              bg-zinc-900
              rounded-xl
              shadow-2xl
              overflow-hidden
              animate-in fade-in zoom-in-95
            "
          >
            {/* VIDEO / IMAGE */}
            {item.trailer_url ? (
              <video
                src={item.trailer_url}
                autoPlay
                muted
                loop
                className="w-full h-[180px] object-cover"
              />
            ) : (
              <img
                src={item.poster}
                className="w-full h-[180px] object-cover"
              />
            )}

            {/* INFO */}
            <div className="p-3 space-y-1">
              <div className="text-sm font-semibold leading-tight">
                {item.title}
              </div>

              <p className="text-xs text-gray-400">
                {item.year} • {item.duration}
              </p>

              {item.synopsis && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.synopsis}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL PLAYER */}
      {open && (
        <VideoModal
          item={item}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}