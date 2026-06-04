import { getSupabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic"; // (important)

export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("films")
    .select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}