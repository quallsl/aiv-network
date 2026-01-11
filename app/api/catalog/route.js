import { getCloudinary } from "../../../lib/cloudinary";

export const runtime = "nodejs";

function toTitle(publicId) {
  const base = publicId.split("/").pop();
  return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function videoUrl(cloud, publicId) {
  return `https://res.cloudinary.com/${cloud}/video/upload/f_mp4,vc_h264/${publicId}`;
}

function posterUrl(cloud, publicId) {
  return `https://res.cloudinary.com/${cloud}/video/upload/so_2,f_jpg,q_auto:good,w_640/${publicId}.jpg`;
}

function toItem(cloud, publicId, kind) {
  if (!publicId) return null;
  return {
    id: publicId,
    title: toTitle(publicId),
    publicId,
    kind, // "film" | "trailer"
    poster: posterUrl(cloud, publicId),
    video: videoUrl(cloud, publicId),
  };
}

export async function GET() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const folder = (process.env.CLOUDINARY_FOLDER || "aiv-films").trim();

  const pinnedFeatured = (process.env.NEXT_PUBLIC_AIV_FEATURED_ID || "").trim();
  const pinnedTrailer = (process.env.NEXT_PUBLIC_AIV_TRAILER_ID || "").trim();

  try {
    const cld = getCloudinary();

    const res = await cld.search
      .expression(`resource_type:video AND folder:${folder}`)
      .sort_by("created_at", "desc")
      .max_results(80)
      .execute();

    const assets = (res?.resources || []).map((r) => {
      const publicId = r.public_id;
      const isTrailer = /trailer/i.test(publicId) || publicId === pinnedTrailer;
      return {
        id: publicId,
        title: toTitle(publicId),
        publicId,
        kind: isTrailer ? "trailer" : "film",
        duration: r.duration || null,
        createdAt: r.created_at || null,
        poster: posterUrl(cloud, publicId),
        video: videoUrl(cloud, publicId),
      };
    });

    const featuredPinnedItem = toItem(cloud, pinnedFeatured, "film");
    const trailerPinnedItem = toItem(cloud, pinnedTrailer, "trailer");

    const trailers = assets.filter((a) => a.kind === "trailer");
    const films = assets.filter((a) => a.kind === "film");

    const featured = featuredPinnedItem || films[0] || assets[0] || null;

    const trailersRowItems = [
      ...(trailerPinnedItem ? [trailerPinnedItem] : []),
      ...trailers.filter((a) => a.publicId !== pinnedTrailer),
    ];

    return Response.json({
      ok: true,
      cloudinaryCloudName: cloud,
      folder,
      featured,
      pinned: { featured: pinnedFeatured || null, trailer: pinnedTrailer || null },
      rows: [
        { id: "featured", title: "Featured", items: featured ? [featured] : [] },
        { id: "trailers", title: "Trailers", items: trailersRowItems },
        { id: "films", title: "AIV Originals", items: films },
      ],
    });
  } catch (e) {
    return Response.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
