import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUNNY_LIBRARY_ID = "697977";
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findOrCreateArtist(email, name) {
  const { data: existing } = await supabaseAdmin
    .from("artists")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) return existing.id;

  const { data, error } = await supabaseAdmin
    .from("artists")
    .insert({ name, email })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("video");
  const title = formData.get("title");
  const description = formData.get("description");
  const genre = formData.get("genre");
  const creator = formData.get("creator");
  const email = formData.get("email");

  if (!file || !title || !email) {
    return NextResponse.json({ error: "Missing file, title, or email" }, { status: 400 });
  }

  const artistId = await findOrCreateArtist(email, creator);

  const createRes = await fetch(
    `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
    {
      method: "POST",
      headers: { AccessKey: BUNNY_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }
  );

  if (!createRes.ok) {
    return NextResponse.json({ error: "Bunny video creation failed" }, { status: 500 });
  }

  const { guid: videoId } = await createRes.json();
  const fileBuffer = await file.arrayBuffer();

  const uploadRes = await fetch(
    `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
    {
      method: "PUT",
      headers: { AccessKey: BUNNY_API_KEY },
      body: Buffer.from(fileBuffer),
    }
  );

  if (!uploadRes.ok) {
    return NextResponse.json({ error: "Bunny file upload failed" }, { status: 500 });
  }

  const { error: insertError } = await supabaseAdmin.from("films").insert({
    title,
    description,
    genre,
    creator,
    artist_id: artistId,
    video_url: `https://player.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}`,
    status: "pending",
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
