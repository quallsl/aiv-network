"use client";

import { useEffect, useRef } from "react";

export default function AVODPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // ✅ ensure safe play
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      muted
      autoPlay
      loop
      playsInline
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        background: "#000",
      }}
    />
  );
}