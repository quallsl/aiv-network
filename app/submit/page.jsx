"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Submitting...");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch("/api/submit-film", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("Your film has been submitted to AIVNetwork.");
      e.currentTarget.reset();
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Submit Your Film</h1>

        <p className="text-gray-300 mb-8">
          Submit your film to AIVNetwork for distribution review. Upload your film to Google Drive, Dropbox, or WeTransfer and paste the link below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="creatorName" required placeholder="Creator Name" className="w-full p-3 rounded text-black" />
          <input name="email" type="email" required placeholder="Email Address" className="w-full p-3 rounded text-black" />
          <input name="filmTitle" required placeholder="Film Title" className="w-full p-3 rounded text-black" />
          <input name="runtime" required placeholder="Runtime" className="w-full p-3 rounded text-black" />
          <input name="genre" placeholder="Genre" className="w-full p-3 rounded text-black" />

          <textarea name="synopsis" required placeholder="Film Synopsis" className="w-full p-3 rounded text-black h-32" />

          <input name="videoLink" type="url" required placeholder="Google Drive / Dropbox / WeTransfer Link" className="w-full p-3 rounded text-black" />

          <label className="flex gap-3 text-sm text-gray-303">
            <input type="checkbox" name="rightsConfirmed" required />
            I confirm that I own or control the rights to submit this film to AIVNetwork.
          </label>

          <button className="w-full bg-white text-black font-bold py-3 rounded">
            Submit Film
          </button>
        </form>

        {status && <p className="mt-6 text-green-400">{status}</p>}
      </div>
    </main>
  );
}
