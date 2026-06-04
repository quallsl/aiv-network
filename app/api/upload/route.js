import { getSupabase } from "../../../lib/supabase";

export async function GET() {
  const supabase = getSupabase(); // ✅ NOW runtime only

  const { data, error } = await supabase
    .from("films")
    .select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}