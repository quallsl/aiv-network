"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const TEST_VAST_TAG =
  "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&cust_params=sample_ct%3Dlinear&gdfp_req=1&output=vast&env=vp&unviewed_position_start=1&impl=s&correlator=";

function loadSource(videoElement, src) {
  if (!videoElement || !src) return null;

  const isHLS = src.includes(".m3u8");

  if (isHLS && Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(videoElement);
    return hls;
  }

  if (isHLS && videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = src;
    return null;
  }

  // Plain mp4 or other direct-playable source
  videoElement.src = src;
  return null;
}

export default function AVODPlayer({ src, vastTag, autoPlay = false }) {
  const videoRef = useRef(null);
  const adContainerRef = useRef(null);

  const [adsLoaded, setAdsLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) return;

    let adsManager = null;
    let adsLoader = null;
    const hls = loadSource(video, src);

    const playContent = () => {
      video.muted = true; // required for resume to succeed without a user gesture
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Resume playback blocked:", err);
        });
      }
    };

    if (typeof window === "undefined" || !window.google || !window.google.ima) {
      console.warn("IMA not loaded → playing content");
      playContent();
      return () => {
        if (hls) hls.destroy();
      };
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
            window.google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            () => {
              video.pause();
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

      const adsRequest = new window.google.ima.AdsRequest();
      adsRequest.adTagUrl =
        vastTag ||
        process.env.NEXT_PUBLIC_VAST_TAG ||
        `${TEST_VAST_TAG}${Date.now()}`;

      adsRequest.linearAdSlotWidth = video.offsetWidth || 640;
      adsRequest.linearAdSlotHeight = video.offsetHeight || 360;

      adsLoader.requestAds(adsRequest);
    } catch (err) {
      console.warn("IMA crash → fallback");
      playContent();
    }

    return () => {
      if (hls) hls.destroy();
      try {
        if (adsManager) adsManager.destroy();
        if (adsLoader) adsLoader.destroy();
      } catch (e) {}
    };
  }, [src]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={videoRef}
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