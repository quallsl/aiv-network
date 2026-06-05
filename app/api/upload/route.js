import { getSupabase } from "../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const supabase = getSupabase();

    const body = await req.json();
    const { title, creator, video_url } = body;

    if (!title || !video_url) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("films")
      .insert([
        {
          title,
          creator: creator || null,
          video_url,
          thumbnail_url: video_url,
        },
      ])
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      film: data,
    });

  } catch (err) {
    return Response.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}