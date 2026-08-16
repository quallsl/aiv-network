import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const { userId, email } = await request.json();

  if (!userId || !email) {
    return NextResponse.json({ error: "Missing userId or email" }, { status: 400 });
  }

  // Mark the artist record as deleted — stops future ad revenue
  // attribution but leaves their films in the catalog. Films remain
  // eligible for admin removal 180 days after this timestamp, per
  // the Terms of Service.
  const { error: artistError } = await supabaseAdmin
    .from("artists")
    .update({
      deleted_at: new Date().toISOString(),
      revenue_eligible: false,
    })
    .eq("email", email);

  if (artistError) {
    console.error("[account delete] artist update error:", artistError);
    // Continue anyway — the account deletion itself is the Apple
    // requirement; artist bookkeeping is secondary and shouldn't block it.
  }

  // Delete the actual login/auth record — this is what satisfies
  // Apple's Guideline 5.1.1(v) requirement.
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) {
    console.error("[account delete] auth delete error:", authError);
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}