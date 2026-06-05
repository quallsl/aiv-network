import { getSupabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

/* GET FILMS */
export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("films")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}

/* SUBMIT FILM */
export async function POST(req) {
  try {
    const supabase = getSupabase();

    const body = await req.json();

    console.log("POST BODY:", body);

    const { data, error } = await supabase
      .from("films")
      .insert([body])
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}