"use client";

import { useEffect } from "react";

export default function VideoModal({ item, onClose }) {
  if (!item) return null;

  // ESC to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center">
      
      {/* BACKDROP CLICK */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* MODAL CONTENT */}
      <div className="relative w-[90%] max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl z-10">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/60 px-3 py-1 rounded text-white"
        >
          ✕
        </button>

        {/* VIDEO */}
        {item.video_url ? (
          <video
            src={item.video_url}
            controls
            autoPlay
            className="w-full h-[60vh] object-cover"
          />
        ) : (
          <div className="h-[60vh] flex items-center justify-center text-gray-400">
            No video available
          </div>
        )}

        {/* INFO */}
        <div className="p-4 space-y-2">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="text-sm text-gray-400">
            {item.year} • {item.duration}
          </p>
          <p className="text-sm text-gray-300">
            {item.synopsis}
          </p>
        </div>
      </div>
    </div>
  );
}