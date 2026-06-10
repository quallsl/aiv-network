import { getSupabase } from "../../../lib/supabase";

export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("site_stats")
    .select("total_views")
    .eq("id", 1)
    .single();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}

export async function POST() {
  const supabase = getSupabase();

  await supabase.rpc("increment_site_views");

  const { data } = await supabase
    .from("site_stats")
    .select("total_views")
    .eq("id", 1)
    .single();

  return Response.json(data);
}