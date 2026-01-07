import { NextResponse } from "next/server";

function b64(str) {
  return Buffer.from(str, "utf8").toString("base64");
}

function prettifyTitle(publicId) {
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
  const features = items.filter((x) => !isTrailerItem(x));
  return features[0] || items[0] || null;
}

function normalizeTokens(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => t !== "aiv" && t !== "films" && t !== "original" && t !== "trailer");
}

function bestMatchingTrailer(featureItem, trailers) {
  if (!featureItem || !Array.isArray(trailers) || trailers.length === 0) return null;
  if (trailers.length === 1) return trailers[0];

  const ft = new Set(normalizeTokens(featureItem.title));
  if (ft.size === 0) return trailers[0];

  let best = trailers[0];
  let bestScore = -1;

  for (const tr of trailers) {
    const tt = normalizeTokens(tr.title);
    let score = 0;
    for (const tok of tt) if (ft.has(tok)) score += 1;

    // small bonus if public_id shares a chunk
    const fid = String(featureItem.id || "").toLowerCase();
    const tid = String(tr.id || "").toLowerCase();
    if (fid && tid && (tid.includes(fid.replace(/_[a-z0-9]{6,}$/i, "")) || fid.includes(tid.replace(/_[a-z0-9]{6,}$/i, "")))) {
      score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      best = tr;
    }
  }

  return best;
}

// GET /api/catalog
export async function GET() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

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
        _created_at: r.created_at || "",
      };
    })
    .sort((a, b) => (a._created_at < b._created_at ? 1 : a._created_at > b._created_at ? -1 : a.id < b.id ? 1 : -1))
    .map(({ _created_at, ...rest }) => rest);

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

  const heroTrailer = bestMatchingTrailer(featured, trailers);

  const hero = {
    ...featured,
    trailerId: heroTrailer?.watchId || heroTrailer?.id || null,
    trailerTitle: heroTrailer?.title || null,
    synopsis:
      "Now streaming on AIV Network. Upload more films to your Cloudinary folder to expand your catalog.",
  };

  const rows = [];
  rows.push({ title: "Featured", items: [featured] });
  if (trailers.length) rows.push({ title: "Trailers", items: trailers });
  if (features.length) rows.push({ title: "AIV Originals", items: features });

  const catalog = { hero, rows };

  return NextResponse.json({ catalog, count: items.length, prefix });
}
