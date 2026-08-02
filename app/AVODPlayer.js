"use client";

import { useEffect, useMemo, useRef } from "react";
import Hls from "hls.js";

const TEST_VAST_TAG =
  "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&cust_params=sample_ct%3Dlinear&gdfp_req=1&output=vast&env=vp&unviewed_position_start=1&impl=s&correlator=";

function loadHlsVideo(videoElement, src, autoPlay) {
  if (!videoElement || !src) return null;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(videoElement);

    // autoPlay attribute doesn't reliably fire for MSE-attached sources —
    // explicitly play once the manifest is actually parsed and ready.
    if (autoPlay) {
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.muted = true;
        const playPromise = videoElement.play();
        if (playPromise) playPromise.catch(() => {});
      });
    }

    return hls;
  }

  if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = src;

    if (autoPlay) {
      videoElement.muted = true;
      videoElement.addEventListener(
        "loadedmetadata",
        () => {
          const playPromise = videoElement.play();
          if (playPromise) playPromise.catch(() => {});
        },
        { once: true }
      );
    }

    return null;
  }

  console.error("HLS not supported in this browser");
  return null;
}

export default function AVODPlayer({ src, vastTag, autoPlay = false }) {
  const videoRef = useRef(null);
  const adContainerRef = useRef(null);
  const adsStartedRef = useRef(false);

  const cleanSrc = src || "";

  const isYouTube =
    cleanSrc.includes("youtube.com") || cleanSrc.includes("youtu.be");
  const isHLS = cleanSrc.includes(".m3u8");

  function getYouTubeId(url) {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;

    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const playerSrc = useMemo(() => {
    if (isYouTube) {
      const id = getYouTubeId(cleanSrc);
      return id
        ? `https://www.youtube.com/embed/${id}?autoplay=${autoPlay ? 1 : 0}&mute=${autoPlay ? 1 : 0}&rel=0`
        : "";
    }

    return cleanSrc;
  }, [cleanSrc, isYouTube, autoPlay]);

  // Attach hls.js for Bunny/HLS streams
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isHLS || isYouTube) return;

    const hls = loadHlsVideo(video, playerSrc, autoPlay);

    return () => {
      if (hls) hls.destroy();
    };
  }, [playerSrc, isHLS, isYouTube, autoPlay]);

  // Google IMA ad insertion (Bunny/native video only, not YouTube)
  useEffect(() => {
    const video = videoRef.current;
    const adContainer = adContainerRef.current;

    if (!video || !adContainer) return;
    if (!cleanSrc) return;
    if (isYouTube) return;

    if (typeof window === "undefined" || !window.google?.ima) {
      console.warn("Google IMA SDK not loaded. Playing content only.");
      return;
    }

    let adsLoader = null;
    let adsManager = null;
    let adDisplayContainer = null;

        function playContent() {
  video.controls = true;

  if (autoPlay) {
    video.muted = true;
  }

  // iOS Safari sometimes loses its play-readiness after IMA ad teardown
  video.load();

  const playPromise = video.play();
  if (playPromise) {
    playPromise.catch((err) => {
      console.warn("Resume playback blocked:", err);
    });
  }
}


    function startAds() {
      if (adsStartedRef.current) return;
      adsStartedRef.current = true;

      try {
        adDisplayContainer = new window.google.ima.AdDisplayContainer(
          adContainer,
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
                console.warn("IMA ad error. Playing content.");
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
    setTimeout(playContent, 150);
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
            } catch (err) {
              console.warn("AdsManager failed. Playing content.", err);
              playContent();
            }
          },
          false
        );

        adsLoader.addEventListener(
          window.google.ima.AdErrorEvent.Type.AD_ERROR,
          () => {
            console.warn("IMA ad load failed. Playing content.");
            playContent();
          },
          false
        );

        const adsRequest = new window.google.ima.AdsRequest();

        adsRequest.adTagUrl =
          vastTag ||
          process.env.NEXT_PUBLIC_VAST_TAG ||
          `${TEST_VAST_TAG}${Date.now()}`;

        adsRequest.linearAdSlotWidth = video.offsetWidth || 640;
        adsRequest.linearAdSlotHeight = video.offsetHeight || 360;
        adsRequest.nonLinearAdSlotWidth = video.offsetWidth || 640;
        adsRequest.nonLinearAdSlotHeight = 150;

        adsLoader.requestAds(adsRequest);
      } catch (err) {
        console.warn("IMA setup failed. Playing content.", err);
        playContent();
      }
    }

    video.addEventListener("play", startAds, { once: true });

    return () => {
      video.removeEventListener("play", startAds);
      try {
        if (adsManager) adsManager.destroy();
        if (adsLoader) adsLoader.destroy();
      } catch {}
    };
  }, [cleanSrc, isYouTube, vastTag]);

  if (!cleanSrc) {
    return <div style={styles.empty}>No video source</div>;
  }

  if (isYouTube) {
    return (
      <iframe
        src={playerSrc}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={styles.player}
      />
    );
  }

  return (
    <div style={styles.wrapper}>
      <video
        ref={videoRef}
        src={isHLS ? undefined : playerSrc}
        controls
        playsInline
        preload="metadata"
        style={styles.player}
      />
      <div ref={adContainerRef} style={styles.adLayer} />
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: "#000",
  },
  player: {
    width: "100%",
    height: "100%",
    border: "none",
    objectFit: "cover",
    background: "#000",
  },
  adLayer: {
    position: "absolute",
    inset: 0,
    zIndex: 5,
    pointerEvents: "none",
  },
  empty: {
    width: "100%",
    height: "100%",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};