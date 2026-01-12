export const runtime = "nodejs";

function pickEnv(name, fallback = "") {
  return process.env[name] || fallback;
}

export async function GET() {
  const cloudinaryCloudName =
    pickEnv("CLOUDINARY_CLOUD_NAME") ||
    pickEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");

  const featuredPublicId = pickEnv("NEXT_PUBLIC_AIV_FEATURED_ID", "wonderboy");
  const trailerPublicId = pickEnv("NEXT_PUBLIC_AIV_TRAILER_ID", "aiv-films-wonderboy-trailer_vae68x");

  return Response.json({
    ok: true,
    films: [
      {
        id: "wonderboy",
        title: "Wonderboy",
        cloudinaryCloudName,
        featuredPublicId,
        trailerPublicId,
      },
    ],
  });
}
