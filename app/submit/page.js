"use client";

export default function SubmitPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Submit Your Film</h1>

      <form>
        <input placeholder="Title" style={{ display: "block", marginBottom: 10 }} />
        <input type="file" style={{ display: "block", marginBottom: 10 }} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}