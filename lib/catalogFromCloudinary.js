export function buildCatalogFromCloudinary(input) {
  // Accept either:
  // - an array of resources
  // - an object that contains { resources: [...] } or { items: [...] }
  const items = Array.isArray(input)
    ? input
    : Array.isArray(input?.resources)
    ? input.resources
    : Array.isArray(input?.items)
    ? input.items
    : [];

  const videos = items
    .filter((v) => v && v.resource_type === "video")
    .map((v) => {
      const publicId = v.public_id || "";
      const title =
        v?.context?.custom?.title ||
        v?.display_name ||
        publicId.split("/").pop()?.replace(/[-_]/g, " ") ||
        "Untitled";

      const year = v?.context?.custom?.year || (v?.created_at ? new Date(v.created_at).getFullYear() : "");
      const duration = typeof v.duration === "number" ? `${Math.round(v.duration)}s` : "";

      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME ||
        "";

      const poster =
        cloudName && publicId
          ? `https://res.cloudinary.com/${cloudName}/video/upload/so_0,f_jpg,q_auto/${publicId}.jpg`
          : "";

      return {
        id: publicId,
        title,
        year,
        duration,
        publicId,
        poster,
      };
    });

  const hero =
    videos[0] || {
      id: "aiv-hero",
      title: "AIV Originals",
      year: "",
      duration: "",
      publicId: "",
      poster: "",
    };

  const rows = [
    { title: "AIV Originals", items: videos },
    { title: "Trailers", items: videos.filter((v) => v.publicId.toLowerCase().includes("trailer")) },
    { title: "Recently Added", items: [...videos].reverse() },
  ].filter((r) => r.items.length);

  return { hero, rows };
}
