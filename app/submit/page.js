"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /* =========================
     FILE HANDLING
  ========================= */
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /* =========================
     UPLOAD FLOW
  ========================= */
  const handleUpload = async () => {
  try {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setUploading(true);
    setProgress(0);

    // Get Cloudinary signature
    const sigRes = await fetch("/api/sign-cloudinary");
    const sig = await sigRes.json();

    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", sig.timestamp);
    formData.append("signature", sig.signature);
    formData.append("folder", "aiv-films");

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round(
          (event.loaded / event.total) * 100
        );
        setProgress(percent);
      }
    };

    xhr.onload = async () => {
      try {
        const uploadData = JSON.parse(xhr.responseText);

        if (xhr.status !== 200) {
          throw new Error(
            uploadData?.error?.message || "Upload failed"
          );
        }

        const filmRes = await fetch("/api/films", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            video_url: uploadData.secure_url,
            public_id: uploadData.public_id,
          }),
        });

        const filmData = await filmRes.json();

        if (!filmRes.ok) {
          throw new Error(
            filmData.error || "Failed to save film"
          );
        }

        window.location.href = "/";
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setUploading(false);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      alert("Upload failed");
    };

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`
    );

    xhr.send(formData);

  } catch (err) {
    console.error(err);
    alert(err.message);
    setUploading(false);
  }
};