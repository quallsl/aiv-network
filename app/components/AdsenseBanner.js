"use client";

import { useEffect, useRef } from "react";

export default function AdsenseBanner() {
  const adRef = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (pushedRef.current) return;

        const width = adRef.current?.offsetWidth || 0;

        if (width < 250) {
          console.warn("AdSense skipped: container width too small", width);
          return;
        }

        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn("AdSense error:", err.message);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "728px",
        minWidth: "300px",
        minHeight: "90px",
        margin: "0 auto",
        display: "block",
        overflow: "hidden",
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          minWidth: "300px",
          minHeight: "90px",
        }}
        data-ad-client="ca-pub-4013153499723354"
        data-ad-slot="9629408157"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}