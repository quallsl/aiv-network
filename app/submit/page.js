"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubmitPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleSubmit = async () => {
    if (!title || !videoUrl) {
      alert("Please fill in required fields");
      return;
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
          thumbnail_url: videoUrl, // fallback
        }),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Film submitted!");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Error submitting film");
    }
  };

  return (
    <div style={styles.page}>
      
      {/* 🔙 BACK BUTTON */}
      <div style={styles.back} onClick={() => router.push("/")}>
        ← Back
      </div>

      <div style={styles.container}>
        <h1 style={styles.title}>Submit a Film</h1>

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
          placeholder="Video URL (YouTube, Vimeo, MP4)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          Submit Film
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "black",
    height: "100vh",
    color: "white",
    padding: "20px",
  },
  back: {
    cursor: "pointer",
    marginBottom: "40px",
    fontSize: "16px",
  },
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#222",
    color: "white",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "red",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};