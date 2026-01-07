"use client";

import { useEffect, useRef, useState } from "react";
import { setProgress } from "./storage";

export default function VideoPlayer({ src, meta }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  // Save progress periodically
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastSaved = 0;

    const onLoaded = () => {
      setReady(true);
      // initial write
      setProgress(meta.watchId, {
        title: meta.title,
        poster: meta.poster,
        year: meta.year,
        durationText: meta.duration,
        duration: el.duration || 0,
        currentTime: el.currentTime || 0,
      });
    };

    const onTime = () => {
      const now = Date.now();
      // save at most every ~3 seconds
      if (now - lastSaved < 3000) return;
      lastSaved = now;

      setProgress(meta.watchId, {
        title: meta.title,
        poster: meta.poster,
        year: meta.year,
        durationText: meta.duration,
        duration: el.duration || 0,
        currentTime: el.currentTime || 0,
      });
    };

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [meta, meta.watchId]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow relative">
      {!ready && (
        <div className="absolute inset-0 grid place-items-center text-sm text-white/70">
          Loading…
        </div>
      )}

      <video
        ref={ref}
        src={src}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full"
      />
    </div>
  );
}
