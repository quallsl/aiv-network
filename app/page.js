"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AVODPlayer from "./AVODPlayer";

export default function Page() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const videos = [
    "https://picsum.photos/300/200?1",
    "https://picsum.photos/300/200?2",
    "https://picsum.photos/300/200?3",
    "https://picsum.photos/300/200?4",
    "https://picsum.photos/300/200?5",
  ];

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      
      {/* 🔴 TOP BAR */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          alignItems: "center",
          background: "#111",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* MENU BUTTON */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            background: "#e50914",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          ☰ Menu
        </button>

        {/* SEARCH */}
        <input
          placeholder="Search films..."
          style={{
            padding: "6px",
            width: "200px",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
          }}
        />

        {/* DROPDOWN MENU */}
        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "10px",
              background: "#111",
              border: "1px solid #333",
              padding: "10px",
              zIndex: 20,
            }}
          >
            <button
              onClick={() => router.push("/submit")}
              style={{
                display: "block",
                background: "#e50914",
                color: "#fff",
                border: "none",
                padding: "8px",
                marginBottom: "5px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Submit Film
            </button>

            <button
              style={{
                display: "block",
                background: "#222",
                color: "#fff",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Browse
            </button>
          </div>
        )}
      </div>

      {/* 🔴 HERO — WONDERBOY TRAILER (RESTORED) */}
      <div style={{ width: "100%", height: "500px" }}>
        <AVODPlayer src="https://res.cloudinary.com/dbefmxqss/video/upload/v1768880039/aiv-films-wonderboy-trailer_vae68x.mp4" />
      </div>

      {/* 🔴 CONTENT ROWS */}
      {["Trending", "New Releases", "AIV Originals"].map((section) => (
        <div key={section} style={{ padding: "20px" }}>
          <h2>{section}</h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              overflowX: "auto",
            }}
          >
            {videos.map((src, i) => (
              <video
                key={i}
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                muted
                loop
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => {
                  e.target.pause();
                  e.target.currentTime = 0;
                }}
                style={{
                  width: "200px",
                  height: "120px",
                  objectFit: "cover",
                  background: "#222",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}