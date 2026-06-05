import { getSupabase } from "../../../lib/supabase";
import { uploadLargeToCloudinary } from "../../../src/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const supabase = getSupabase();

    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadLargeToCloudinary(buffer);

    // Save to Supabase
    const { data, error } = await supabase
      .from("films")
      .insert([
        {
          title: title || "Untitled",
          video_url: uploadResult.secure_url,
          thumbnail_url: uploadResult.secure_url, // can improve later
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