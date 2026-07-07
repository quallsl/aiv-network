"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

const BUNNY_LIBRARY_ID = "697977";

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    creator: "",
    description: "",
    genre: "",
    year: "",
    thumbnail_url: "",
    video_url: "",
  });

  function updateField(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function getYouTubeThumbnail(url) {
    if (!url) return "";

    try {
      const regex =
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;

      const match = url.match(regex);
      const videoId = match ? match[1] : null;

      return videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : "";
    } catch {
      return "";
    }
  }

  function getBunnyVideoId(value) {
    if (!value) return null;

    const cleanValue = value.trim();

    if (/^[a-f0-9-]{36}$/i.test(cleanValue)) {
      return cleanValue;
    }

    const match = cleanValue.match(
      /player\.mediadelivery\.net\/(?:play|embed)\/(\d+)\/([a-f0-9-]+)/i
    );

    return match ? match[2] : null;
  }

  function getBunnyLibraryId(value) {
    if (!value) return BUNNY_LIBRARY_ID;

    const match = value.trim().match(
      /player\.mediadelivery\.net\/(?:play|embed)\/(\d+)\/([a-f0-9-]+)/i
    );

    return match ? match[1] : BUNNY_LIBRARY_ID;
  }

  function normalizeVideoUrl(value) {
    const cleanValue = value.trim();

    const bunnyVideoId = getBunnyVideoId(cleanValue);
    const bunnyLibraryId = getBunnyLibraryId(cleanValue);

    if (/^[a-f0-9-]{36}$/i.test(cleanValue)) {
      return `https://player.mediadelivery.net/play/${bunnyLibraryId}/${bunnyVideoId}`;
    }

    return cleanValue;
  }

  function getBunnyThumbnail(value) {
    if (!value) return "";

    const bunnyVideoId = getBunnyVideoId(value);
    const bunnyLibraryId = getBunnyLibraryId(value);

    if (!bunnyVideoId) return "";

    return `https://vz-${bunnyLibraryId}.b-cdn.net/${bunnyVideoId}/thumbnail.jpg`;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.video_url.trim()) {
      alert("Film title and video URL are required.");
      return;
    }

    try {
      setLoading(true);

      const supabase = getSupabase();

      const normalizedVideoUrl = normalizeVideoUrl(form.video_url);

      const thumbnail =
        form.thumbnail_url.trim() ||
        getBunnyThumbnail(form.video_url) ||
        getYouTubeThumbnail(form.video_url) ||
        "";

      const { error } = await supabase.from("films").insert([
        {
          title: form.title.trim(),
          creator: form.creator.trim(),
          description: form.description.trim(),
          genre: form.genre.trim(),
          year: form.year.trim(),
          thumbnail_url: thumbnail,
          video_url: normalizedVideoUrl,
        },
      ]);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      alert("Film submitted successfully.");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "#111",
          border: "1px solid #333",
          borderRadius: "10px",
          padding: "40px",
          boxShadow: "0 0 30px rgba(0,0,0,.5)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "38px",
          }}
        >
          Submit Your Film
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#999",
            marginBottom: "30px",
          }}
        >
          Upload your independent film to AIV Films
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <input
            name="title"
            placeholder="Film Title"
            value={form.title}
            onChange={updateField}
            style={inputStyle}
          />

          <input
            name="creator"
            placeholder="Creator / Director"
            value={form.creator}
            onChange={updateField}
            style={inputStyle}
          />

          <textarea
            rows={5}
            name="description"
            placeholder="Film Description"
            value={form.description}
            onChange={updateField}
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <input
            name="genre"
            placeholder="Genre"
            value={form.genre}
            onChange={updateField}
            style={inputStyle}
          />

          <input
            name="year"
            placeholder="Release Year"
            value={form.year}
            onChange={updateField}
            style={inputStyle}
          />

          <input
            name="video_url"
            placeholder="Bunny Video ID or Video URL (Bunny.net, YouTube, Vimeo)"
            value={form.video_url}
            onChange={updateField}
            style={inputStyle}
          />

          <input
            name="thumbnail_url"
            placeholder="Thumbnail URL (optional — Bunny/YouTube can auto-generate)"
            value={form.thumbnail_url}
            onChange={updateField}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "20px",
              background: "#e50914",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Submitting..." : "Submit Film"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              padding: "14px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  background: "#222",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px",
  fontSize: "15px",
};