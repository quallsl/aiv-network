export const runtime = "nodejs";

function env(...keys) {
  for (const k of keys) {
    const v = process.env[k];
    if (v && String(v).trim()) return String(v).trim();
  }
  return "";
}

export async function GET() {
  const cloudinaryCloudName = env(
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_CLOUD_NAME"
  );

  const featuredPublicId = env(
    "NEXT_PUBLIC_AIV_FEATURED_ID",
    "AIV_FEATURED_ID"
  );

  const trailerPublicId = env(
    "NEXT_PUBLIC_AIV_TRAILER_ID",
    "AIV_TRAILER_ID"
  );

  return Response.json({
    ok: true,
    version: "films-route-v3-2026-01-12",
    cloudinaryCloudName,
    featuredPublicId,
    trailerPublicId,
    films: [
      {
        id: featuredPublicId || "wonderboy",
        title: "Featured",
        cloudinaryCloudName,
        featuredPublicId,
        trailerPublicId,
      },
    ],
  });
}
