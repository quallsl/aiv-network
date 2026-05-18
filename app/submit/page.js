"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("films").insert([
      {
        title,
        creator,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      },
    ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setCreator("");
    setVideoUrl("");
    setThumbnailUrl(""); // ✅ reset thumbnail
    setLoading(false);

    alert("Film submitted 🎬");
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Submit Your Film</h1>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Film Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Creator Name"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Thumbnail Image URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Submitting..." : "Submit Film"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  page: {
    backgroundColor: "#141414",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#1f1f1f",
    padding: "40px",
    borderRadius: "12px",
    width: "400px",
  },
  title: {
    color: "white",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#e50914",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};