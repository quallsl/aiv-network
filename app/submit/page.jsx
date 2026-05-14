"use client";

import { useState } from "react";
import PageShell from "../components/PageShell";

const initialState = { kind: "idle", message: "" };
const fieldStyle = {
  width: "100%",
  display: "block",
  padding: "12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "#fff",
  color: "#000",
  marginBottom: 12,
};

export default function SubmitPage() {
  const [status, setStatus] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ kind: "info", message: "Submitting your film..." });

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/submit-film", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const payload = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({ kind: "success", message: "Thanks! Your film was submitted to AIV Network for review." });
        e.currentTarget.reset();
      } else {
        setStatus({ kind: "error", message: payload.message || "Submission failed. Please verify your info and try again." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error while submitting. Please try again in a minute." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell title="Submit Your Film" subtitle="Share your project with the AIV Network programming team.">
      <section style={{ margin: "0 auto", width: "100%", maxWidth: 760, padding: "0 24px 64px" }}>
        <div style={{ marginBottom: 20, borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", padding: 14, color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
          Upload your file privately to Google Drive, Dropbox, or WeTransfer, then paste the link below.
        </div>

        <form onSubmit={handleSubmit} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", padding: 20 }}>
          <input name="creatorName" required placeholder="Creator Name" style={fieldStyle} />
          <input name="email" type="email" required placeholder="Email Address" style={fieldStyle} />
          <input name="filmTitle" required placeholder="Film Title" style={fieldStyle} />
          <input name="runtime" required placeholder="Runtime (e.g., 1h 42m)" style={fieldStyle} />
          <input name="genre" placeholder="Genre" style={fieldStyle} />
          <textarea name="synopsis" required placeholder="Film Synopsis" style={{ ...fieldStyle, minHeight: 120 }} />
          <input name="videoLink" type="url" required placeholder="Google Drive / Dropbox / WeTransfer Link" style={fieldStyle} />

          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 14 }}>
            <input type="checkbox" name="rightsConfirmed" required style={{ marginTop: 2 }} />
            I confirm that I own or control the rights to submit this film to AIV Network.
          </label>

          <button
            disabled={submitting}
            style={{ width: "100%", borderRadius: 8, border: "none", background: "#fff", color: "#000", fontWeight: 700, padding: "12px", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Submitting..." : "Submit Film"}
          </button>
        </form>

        {status.message && (
          <p style={{ marginTop: 18, fontSize: 14, color: status.kind === "error" ? "#f87171" : status.kind === "success" ? "#4ade80" : "rgba(255,255,255,0.85)" }}>
            {status.message}
          </p>
        )}
      </section>
    </PageShell>
  );
}
