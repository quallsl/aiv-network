"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import AVODPlayer from "../components/AVODPlayer";
import "videojs-contrib-ads";
import "videojs-ima";

export default function AVODPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
      });

      // 🔥 GOOGLE IMA ADS CONFIG
      player.ima({
        adTagUrl:
          "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&cust_params=sample_ct%3Dlinear&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
      });

      player.src({
        src,
        type: "video/mp4",
      });

      playerRef.current = player;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}