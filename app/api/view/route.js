import { NextResponse } from "next/server";
import { getSupabase } from "../../../lib/supabase";
export async function POST(req) {
  const { id } = await req.json();

  const supabase = getSupabase();

  const { data, error } = await supabase
    .rpc("increment_views", { film_id: id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}