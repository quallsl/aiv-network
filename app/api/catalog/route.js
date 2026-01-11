export const runtime = "nodejs";

function videoUrl(cloud, publicId) {
  if (!cloud || !publicId) return "";
  const id = String(publicId).replace(/^\/+/, "");
  return `https://res.cloudinary.com/${cloud}/video/upload/f_mp4,vc_h264/${id}.mp4`;
}

function posterUrl(cloud, publicId) {
  if (!cloud || !publicId) return "";
  const id = String(publicId).replace(/^\/+/, "");
  return `https://res.cloudinary.com/${cloud}/video/upload/so_2,f_jpg,q_auto:good,w_1280/${id}.jpg`;
}

export async function GET() {
  const cloud =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "dbefmxqss";

  // IMPORTANT: Wonderboy is at ROOT (you proved /video/upload/wonderboy.mp4 is 200)
  const featuredPublicId = process.env.NEXT_PUBLIC_AIV_FEATURED_ID || "wonderboy";

  // Your trailer is working as provided (keep exact id)
  const trailerPublicId =
    process.env.NEXT_PUBLIC_AIV_TRAILER_ID || "aiv-films-wonderboy-trailer_vae68x";

  const featured = {
    id: featuredPublicId,
    title: "Wonderboy",
    publicId: featuredPublicId,
    poster: posterUrl(cloud, featuredPublicId),
    video: videoUrl(cloud, featuredPublicId),
  };

  const trailer = {
    id: trailerPublicId,
    title: "Wonderboy (Trailer)",
    publicId: trailerPublicId,
    poster: posterUrl(cloud, trailerPublicId),
    video: videoUrl(cloud, trailerPublicId),
  };

  const rows = [
    { id: "trailers", title: "Trailers", items: [trailer] },
    { id: "originals", title: "AIV Originals", items: [featured] },
    { id: "featured", title: "Featured", items: [featured] },
  ];

  return Response.json({
    ok: true,
    cloudinaryCloudName: cloud,
    featured,
    rows,
    ts: Date.now(),
  });
}
