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

function isTrailerItem(item) {
  const hay = `${item?.id ?? ""} ${item?.title ?? ""}`.toLowerCase();
  return hay.includes("trailer");
}

function pickFeatured(items) {
  // Prefer a non-trailer as the featured hero
  const features = items.filter((x) => !isTrailerItem(x));
  return features[0] || items[0] || null;
}

// GET /api/catalog
export async function GET() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
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

  const url =
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/video` +
    `?prefix=${encodeURIComponent(prefix)}` +
    `&max_results=100` +
    `&resource_type=video` +
    `&type=upload`;

  const res = await fetch(url, {
    headers: { Authorization: auth },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: "Cloudinary API error", details: data }, { status: res.status });
  }

  const resources = Array.isArray(data.resources) ? data.resources : [];

  // Newest-first (created_at desc), then id desc as tie-breaker
  const items = resources
    .map((r) => {
      const watchId = r.public_id;
      const title = prettifyTitle(watchId);
      return {
        id: watchId,
        watchId,
        title,
        year: (r.created_at || "").slice(0, 4),
        duration: durationText(r.duration),
        tags: ["AIV", "Original"],
        poster: posterFromVideo(cloudName, watchId),
        backdrop: backdropFromVideo(cloudName, watchId),
      };
    })
    .sort((a, b) => {
      const ad = a?.createdAt ?? "";
      const bd = b?.createdAt ?? "";
      if (ad !== bd) return ad < bd ? 1 : -1;
      return a.id < b.id ? 1 : -1;
    });

  const featured = pickFeatured(items);

  if (!featured) {
    const emptyCatalog = {
      hero: {
        id: "empty",
        watchId: "",
        title: "Upload a video to Cloudinary",
        synopsis: `No videos found under prefix "${prefix}".`,
        year: "",
        duration: "",
        tags: ["AIV"],
        poster: "",
        backdrop: "",
      },
      rows: [],
    };
    return NextResponse.json({ catalog: emptyCatalog, count: 0, prefix });
  }

  const trailers = items.filter(isTrailerItem);
  const features = items.filter((x) => !isTrailerItem(x));

  const hero = {
    ...featured,
    synopsis:
      "Now streaming on AIV Network. Upload more films to your Cloudinary folder to expand your catalog.",
  };

  const rows = [];

  // Always show featured as a row so it’s obvious + clickable
  rows.push({ title: "Featured", items: [featured] });

  if (trailers.length) rows.push({ title: "Trailers", items: trailers });
  if (features.length) rows.push({ title: "AIV Originals", items: features });

  const catalog = { hero, rows };

  return NextResponse.json({ catalog, count: items.length, prefix });
}
