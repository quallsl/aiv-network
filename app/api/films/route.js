import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("films")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  console.log("Supabase data:", data);

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}