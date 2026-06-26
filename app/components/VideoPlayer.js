"use client";

import { useEffect, useRef, useState } from "react";
import { setProgress } from "./storage";

const VAST_TAG = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/21775744923/external/single_ad_samples&ciu_szs=300x250&cust_params=sample_ct%3Dlinear&gdfp_req=1&output=vast&env=vp&unviewed_position_start=1&impl=s&correlator=";

export default function VideoPlayer({ src, meta }) {
  const videoRef = useRef(null);
  const adContainerRef = useRef(null);

  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const adContainer = adContainerRef.current;

    if (!window.google || !window.google.ima) {
      console.log("IMA SDK not loaded");
      return;
    }

    const adDisplayContainer = new window.google.ima.AdDisplayContainer(
      adContainer,
      video
    );

    const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

    adsLoader.addEventListener(
      window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      (event) => {
        const adsManager = event.getAdsManager(video);

        try {
          adsManager.init(640, 360, window.google.ima.ViewMode.NORMAL);
          adsManager.start(); // ▶️ PLAY AD
        } catch (e) {
          console.log("Ad error, playing content");
          video.play();
        }

        adsManager.addEventListener(
          window.google.ima.AdEvent.Type.COMPLETE,
          () => {
            video.play(); // ▶️ START MOVIE AFTER AD
          }
        );
      }
    );

    adsLoader.addEventListener(
      window.google.ima.AdErrorEvent.Type.AD_ERROR,
      () => {
        console.log("Ad failed, skipping");
        video.play();
      }
    );

    // 👇 REQUIRED: user interaction for autoplay policies
    const startAds = () => {
      adDisplayContainer.initialize();

      const adsRequest = new window.google.ima.AdsRequest();
      adsRequest.adTagUrl = VAST_TAG;

      adsRequest.linearAdSlotWidth = 640;
      adsRequest.linearAdSlotHeight = 360;

      adsLoader.requestAds(adsRequest);
      setAdsLoaded(true);
    };

    video.addEventListener("play", startAds, { once: true });

    return () => {
      video.removeEventListener("play", startAds);
    };
  }, []);

  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative">

      {/* 🎬 Ad container (sits on top of video) */}
      <div
        ref={adContainerRef}
        className="absolute inset-0 z-10"
      />

      {/* 🎥 Video */}
      <video
        ref={videoRef}
        src={src}
        controls
        playsInline
        className="w-full h-full"
      />

    </div>
  );
}