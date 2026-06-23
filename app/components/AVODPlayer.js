"use client";

import { useEffect, useRef, useState } from "react";

export default function AVODPlayer({ src }) {
  const videoRef = useRef(null);
  const adContainerRef = useRef(null);

  const [adsLoaded, setAdsLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let adsManager = null;
    let adsLoader = null;

    // ✅ Always allow content playback fallback
    const playContent = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    };

    // 🚫 If Google IMA not available → fallback immediately
    if (typeof window === "undefined" || !window.google || !window.google.ima) {
      console.warn("IMA not loaded → playing content");
      playContent();
      return;
    }

    try {
      const adDisplayContainer = new window.google.ima.AdDisplayContainer(
        adContainerRef.current,
        video
      );

      adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

      adsLoader.addEventListener(
        window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (event) => {
          adsManager = event.getAdsManager(video);

          adsManager.addEventListener(
            window.google.ima.AdErrorEvent.Type.AD_ERROR,
            () => {
              console.warn("Ad error → fallback to content");
              setAdError(true);
              playContent();
            }
          );

          adsManager.addEventListener(
            window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            () => {
              playContent();
            }
          );

          try {
            adDisplayContainer.initialize();

            adsManager.init(
              video.offsetWidth || 640,
              video.offsetHeight || 360,
              window.google.ima.ViewMode.NORMAL
            );

            adsManager.start();
            setAdsLoaded(true);
          } catch (err) {
            console.warn("Ads failed → fallback");
            playContent();
          }
        }
      );

      adsLoader.addEventListener(
        window.google.ima.AdErrorEvent.Type.AD_ERROR,
        () => {
          console.warn("Ad load failed → fallback");
          setAdError(true);
          playContent();
        }
      );

      // 🎯 ✅ REPLACE THIS WITH YOUR REAL VAST TAG
      const adsRequest = new window.google.ima.AdsRequest();
      adsRequest.adTagUrl =
        "PASTE_YOUR_GOOGLE_AD_MANAGER_VAST_TAG_HERE";

      adsRequest.linearAdSlotWidth = video.offsetWidth || 640;
      adsRequest.linearAdSlotHeight = video.offsetHeight || 360;

      adsLoader.requestAds(adsRequest);
    } catch (err) {
      console.warn("IMA crash → fallback");
      playContent();
    }

    // 🧹 Cleanup (VERY important for Next.js)
    return () => {
      try {
        if (adsManager) {
          adsManager.destroy();
        }
        if (adsLoader) {
          adsLoader.destroy();
        }
      } catch (e) {}
    };
  }, [src]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* 🎬 Main Video */}
      <video
        ref={videoRef}
        src={src}
        muted
        controls
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          background: "#000",
        }}
      />

      {/* 📺 Ad Overlay */}
      <div
        ref={adContainerRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: adsLoaded ? "auto" : "none",
        }}
      />
    </div>
  );
}