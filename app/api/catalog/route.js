import { NextResponse } from "next/server";

function b64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

function prettifyTitle(publicId) {
  // "aiv-films-wonderboy-trailer_vae68x" -> "Aiv Films Wonderboy Trailer"
  // or "aiv-films/wonderboy-trailer_vae68x" -> "Wonderboy Trailer"
  const last = publicId.split("/").pop() || publicId;
  const noHash = last.replace(/_[a-z0-9]{6,}$/i, "");
  return noHash
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function durationText(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function posterFromVideo(cloudName, watchId) {
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,c_fill,w_600,h_900,q_auto,f_auto/${watchId}.jpg`;
}

function backdropFromVideo(cloudName, watchId) {
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,c_fill,w_1600,h_900,q_auto,f_auto/${watchId}.jpg`;
}

// GET /api/catalog
export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Optional: limit to a folder/prefix (recommended)
  const prefix = process.env.CLOUDINARY_FOLDER || "aiv-films";

  if (!cloudName) {
    return NextResponse.json(
      { error: "Missing CLOUDINARY_CLOUD_NAME (or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)" },
      { status: 500 }
    );
  }

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET. Add these to .env.local and Vercel (server-side env vars).",
      },
      { status: 500 }
    );
  }

  const auth = `Basic ${b64(`${apiKey}:${apiSecret}`)}`;

  // Cloudinary Admin API list videos
  const url =
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/video` +
    `?prefix=${encodeURIComponent(prefix)}` +
    `&max_results=100` +
    `&resource_type=video` +
    `&type=upload`;

  const res = await fetch(url, {
    headers: { Authorization: auth },
    // avoid caching during dev; in prod you can enable revalidate
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: "Cloudinary API error", details: data },
      { status: res.status }
    );
  }

  const resources = Array.isArray(data.resources) ? data.resources : [];

  const items = resources
    .map((r) => {
      const watchId = r.public_id; // this is the correct Cloudinary ID for playback (no extension)
      return {
        id: watchId,
        watchId,
        title: prettifyTitle(watchId),
        year: (r.created_at || "").slice(0, 4),
        duration: durationText(r.duration),
        tags: ["AIV", "Original"],
        poster: posterFromVideo(cloudName, watchId),
        backdrop: backdropFromVideo(cloudName, watchId),
      };
    })
    .sort((a, b) => (a.id < b.id ? 1 : -1));

  const hero = items[0] || {
    id: "empty",
    watchId: "",
    title: "Upload a video to Cloudinary",
    synopsis: `No videos found under prefix "${prefix}".`,
    year: "",
    duration: "",
    tags: ["AIV"],
    poster: "",
    backdrop: "",
  };

  const catalog = {
    hero: {
      ...hero,
      synopsis:
        hero.synopsis ||
        "Now streaming on AIV Network. Upload more films to your Cloudinary folder to expand your catalog.",
    },
    rows: [
      { title: "AIV Originals", items },
    ],
  };

  return NextResponse.json({ catalog, count: items.length, prefix });
}
