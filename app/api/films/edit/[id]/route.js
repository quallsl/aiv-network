import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/* =========================
   GET SINGLE FILM
========================= */
export async function GET(request, { params }) {
  const { id } = params;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("films")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

/* =========================
   UPDATE FILM
========================= */
export async function PUT(request, { params }) {
  const { id } = params;

  const body = await request.json();

  const {
    title,
    creator,
    description,
    genre,
    rating,
    runtime,
    poster_url,
    thumbnail_url,
    video_url,
    trending,
    new_release,
    aiv_original,
  } = body;

  const { data, error } = await supabase
    .from("films")
    .update({
      title,
      creator,
      description,
      genre,
      rating,
      runtime,
      poster_url,
      thumbnail_url,
      video_url,
      trending,
      new_release,
      aiv_original,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}