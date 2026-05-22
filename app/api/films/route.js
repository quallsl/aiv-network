import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getThumbnail(videoUrl, customThumbnail) {
  // user supplied thumbnail
  if (customThumbnail && customThumbnail.trim() !== "") {
    return customThumbnail;
  }

  // YouTube
  if (
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be")
  ) {
    let id = "";

    if (videoUrl.includes("v=")) {
      id = videoUrl.split("v=")[1].split("&")[0];
    } else if (videoUrl.includes("youtu.be/")) {
      id = videoUrl.split("youtu.be/")[1];
    }

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  // Vimeo placeholder
  if (videoUrl.includes("vimeo.com")) {
    return "https://placehold.co/600x900/111/FFF?text=VIMEO";
  }

  // TikTok placeholder
  if (videoUrl.includes("tiktok.com")) {
    return "https://placehold.co/600x900/111/FFF?text=TIKTOK";
  }

  // Generic fallback
  return "https://placehold.co/600x900/111/FFF?text=FILM";
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return Response.json(data);

  } catch (err) {
    console.error("GET FILMS ERROR:", err);

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      creator,
      video_url,
      thumbnail_url,
      description,
    } = body;

    if (!title || !creator || !video_url) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const finalThumbnail = getThumbnail(
      video_url,
      thumbnail_url
    );

    const { data, error } = await supabase
      .from("films")
      .insert([
        {
          title,
          creator,
          video_url,
          thumbnail_url: finalThumbnail,
          description,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return Response.json(data);

  } catch (err) {
    console.error("POST FILMS ERROR:", err);

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}