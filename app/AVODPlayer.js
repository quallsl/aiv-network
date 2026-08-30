"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";

const TEST_VAST_TAG =
  "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&cust_params=sample_ct%3Dlinear&gdfp_req=1&output=vast&env=vp&unviewed_position_start=1&impl=s&correlator=";

const SKIP_AFTER_SECONDS = 5;

function attachHls(videoElement, src, autoPlay, onReady) {
  if (!videoElement || !src) return null;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(videoElement);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (onReady) {
        onReady();
      } else if (autoPlay) {
        videoElement.muted = true;
        const playPromise = videoElement.play();
        if (playPromise) playPromise.catch(() => {});
      }
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("HLS error:", data.type, data.details, data.fatal);

      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.warn("Network error — retrying manifest load");
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.warn("Media error — attempting recovery");
            hls.recoverMediaError();
            break;
          default:
            console.error("Unrecoverable HLS error, destroying instance");
            hls.destroy();
            break;
        }
      }
    });

    return hls;
  }

  if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = src;

    videoElement.addEventListener(
      "loadedmetadata",
      () => {
        if (onReady) {
          onReady();
        } else if (autoPlay) {
          videoElement.muted = true;
          const playPromise = videoElement.play();
          if (playPromise) playPromise.catch(() => {});
        }
      },
      { once: true }
    );

    return null;
  }

  console.error("HLS not supported in this browser");
  return null;
}

export default function AVODPlayer({ src, vastTag, autoPlay = false }) {
  const videoRef = useRef(null);
  const adContainerRef = useRef(null);
  const adsStartedRef = useRef(false);
  const adsManagerRef = useRef(null);
  const hlsRef = useRef(null);
  const savedTimeRef = useRef(0);
  const countdownTimerRef = useRef(null);

  const [adPlaying, setAdPlaying] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState(SKIP_AFTER_SECONDS);
  const [skipReady, setSkipReady] = useState(false);

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

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isHLS || isYouTube) return;

    const hls = attachHls(video, playerSrc, autoPlay);
    hlsRef.current = hls;

    return () => {
      if (hls) hls.destroy();
      hlsRef.current = null;
    };
  }, [playerSrc, isHLS, isYouTube, autoPlay]);

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

    function stopAdUI() {
      setAdPlaying(false);
      setSkipReady(false);
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    }

    function startSkipCountdown() {
      setSkipCountdown(SKIP_AFTER_SECONDS);
      setSkipReady(false);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = setInterval(() => {
        setSkipCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            setSkipReady(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    function playContent() {
      stopAdUI();
      video.controls = true;

      if (isHLS) {
        savedTimeRef.current = video.currentTime || 0;

        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }

        const hls = attachHls(video, playerSrc, autoPlay, () => {
          if (savedTimeRef.current > 0) {
            video.currentTime = savedTimeRef.current;
          }
          if (autoPlay) {
            video.muted = true;
          }
          const playPromise = video.play();
          if (playPromise) {
            playPromise.catch((err) => {
              console.warn("Resume playback blocked:", err);
            });
          }
        });

        hlsRef.current = hls;
        return;
      }

      if (autoPlay) {
        video.muted = true;
      }

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
            adsManagerRef.current = adsManager;

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
                video.controls = false;
                setAdPlaying(true);
                startSkipCountdown();
              }
            );

            adsManager.addEventListener(
              window.google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
              () => {
                playContent();
              }
            );

            adsManager.addEventListener(
              window.google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
              () => {
                stopAdUI();
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
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      try {
        if (adsManager) adsManager.destroy();
        if (adsLoader) adsLoader.destroy();
      } catch {}
    };
  }, [cleanSrc, isYouTube, vastTag, isHLS, playerSrc, autoPlay]);

  function handleSkip() {
    if (adsManagerRef.current && skipReady) {
      try {
        adsManagerRef.current.stop();
      } catch (err) {
        console.warn("Skip failed:", err);
      }
    }
  }

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
        controls={!adPlaying}
        playsInline
        preload="metadata"
        style={styles.player}
      />
      <div
        ref={adContainerRef}
        style={{
          ...styles.adLayer,
          pointerEvents: adPlaying ? "auto" : "none",
        }}
      />

      {adPlaying && (
        <>
          <div style={styles.adLabel}>Advertisement</div>

          <button
            onClick={handleSkip}
            disabled={!skipReady}
            style={{
              ...styles.skipButton,
              background: skipReady
                ? "rgba(0,0,0,0.85)"
                : "rgba(0,0,0,0.5)",
              cursor: skipReady ? "pointer" : "default",
            }}
          >
            {skipReady ? "Skip Ad ▶" : `Skip in ${skipCountdown}s`}
          </button>
        </>
      )}
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
  },
  adLabel: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: 12,
    padding: "3px 8px",
    borderRadius: 4,
    fontWeight: 600,
    letterSpacing: 0.5,
    pointerEvents: "none",
    zIndex: 10,
  },
  skipButton: {
    position: "absolute",
    bottom: 14,
    right: 14,
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: 4,
    padding: "6px 12px",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 6,
    zIndex: 10,
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