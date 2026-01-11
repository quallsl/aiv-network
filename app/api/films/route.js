export const runtime = "nodejs";

export async function GET() {
  const cloud =
    (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "").trim();

  const featuredPublicId = (process.env.NEXT_PUBLIC_AIV_FEATURED_ID || "").trim();
  const trailerPublicId = (process.env.NEXT_PUBLIC_AIV_TRAILER_ID || "").trim();

  return Response.json({
    ok: true,
    films: [
      {
        id: "wonderboy",
        title: "Wonderboy",
        cloudinaryCloudName: cloud,
        featuredPublicId,
        trailerPublicId
      }
    ]
  });
}
