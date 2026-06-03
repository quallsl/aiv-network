import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data || []);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return Response.json({ error: "Server failed" }, { status: 500 });
  }
}