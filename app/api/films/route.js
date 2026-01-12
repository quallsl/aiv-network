export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    version: "films-route-v2-2026-01-12",
    cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    featuredPublicId: process.env.NEXT_PUBLIC_AIV_FEATURED_ID || "",
    trailerPublicId: process.env.NEXT_PUBLIC_AIV_TRAILER_ID || "",
  });
}
