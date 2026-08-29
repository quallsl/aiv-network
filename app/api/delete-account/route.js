import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Service-role client — server-only. Never import this pattern in a
// client component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const RETENTION_DAYS = 180;

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify the requester is who they say they are
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Find their filmmaker profile
    const { data: artist, error: artistError } = await supabaseAdmin
      .from("public_artists")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (artistError || !artist) {
      return NextResponse.json(
        { error: "Filmmaker profile not found" },
        { status: 404 }
      );
    }

    const removalDate = new Date();
    removalDate.setDate(removalDate.getDate() + RETENTION_DAYS);

    // Schedule their films for removal in 180 days (only films not
    // already scheduled — avoids resetting the clock if this is called twice)
    const { error: filmsError } = await supabaseAdmin
      .from("films")
      .update({ scheduled_removal_at: removalDate.toISOString() })
      .eq("artist_id", artist.id)
      .is("scheduled_removal_at", null);

    if (filmsError) {
      console.error("Film scheduling error:", filmsError);
      return NextResponse.json(
        { error: "Could not schedule film removal" },
        { status: 500 }
      );
    }

    // Soft-delete the artist profile
    const { error: profileError } = await supabaseAdmin
      .from("public_artists")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", artist.id);

    if (profileError) {
      console.error("Profile deletion error:", profileError);
      return NextResponse.json(
        { error: "Could not delete profile" },
        { status: 500 }
      );
    }

    // Block sign-in immediately without hard-deleting the auth user
    // (hard delete happens later, once films are actually swept)
    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { ban_duration: "87600h" } // ~10 years
    );

    if (banError) {
      console.error("Ban error:", banError);
    }

    return NextResponse.json({
      success: true,
      filmsScheduledRemovalDate: removalDate.toISOString(),
    });
  } catch (err) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}