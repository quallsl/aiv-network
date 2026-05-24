"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilm, setActiveFilm] = useState(null);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const isYouTube =
      videoUrl.includes("youtube.com") ||
      videoUrl.includes("youtu.be");

    const isVimeo = videoUrl.includes("vimeo.com");
    const isMp4 = videoUrl.endsWith(".mp4");

    if (!isYouTube && !isVimeo && !isMp4) {
      alert("Please enter a valid YouTube, Vimeo, or MP4 URL");
      setLoading(false);
      return;
    }

    let thumbnailUrl = null;

    // 🎯 SAFE YouTube thumbnail extraction
    if (isYouTube) {
      let videoId = "";

      if (videoUrl.includes("youtu.be/")) {
        videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      } else if (videoUrl.includes("watch?v=")) {
        videoId = videoUrl.split("watch?v=")[1]?.split("&")[0];
      }

      if (videoId) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    // 🎯 fallback thumbnail (prevents crashes + keeps UI filled)
    if (!thumbnailUrl) {
      thumbnailUrl = "https://via.placeholder.com/300x170?text=Preview";
    }

    try {
      const res = await fetch("/api/films", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          creator,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("SERVER ERROR:", errorText);
        alert("Server Error: " + errorText);
        setLoading(false);
        return;
      }

      alert("Film submitted!");
      setTitle("");
      setCreator("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
      alert("Error submitting film");
    }

    setLoading(false);
  }

  return (
    <main style={styles.page}>
      {/* BACK BUTTON */}
      <button
        style={styles.back}
        onClick={() => (window.location.href = "/")}
      >
        ← Back
      </button>

      {/* CENTERED FORM */}
      <div style={styles.container}>
        <h1 style={styles.title}>Submit a Film</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Film Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />

          <input
            placeholder="Creator Name"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            required
            style={styles.input}
          />

          <input
            placeholder="Video URL (YouTube, Vimeo, MP4)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.submit}>
            {loading ? "Submitting..." : "Submit Film"}
          </button>
        </form>
      </div>
    </main>
  );
}

/* 🎬 NETFLIX STYLE PRESERVED */
const styles = {
  page: {
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },

  back: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },

  container: {
    backgroundColor: "rgba(0,0,0,0.85)",
    padding: "40px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 0 30px rgba(0,0,0,0.9)",
    transition: "all 0.3s ease",
  },

  title: {
    fontSize: "32px",
    marginBottom: "20px",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#222",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },

  submit: {
    padding: "12px",
    backgroundColor: "#e50914",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    transition: "transform 0.2s ease, background 0.2s",
  },
};