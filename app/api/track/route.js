import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Service-role client — server-only, bypasses RLS since this endpoint
// receives unauthenticated pings directly from the video player/ad SDK.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1x1 transparent pixel, returned so the request always resolves cleanly
// even though VAST trackers don't care about the response body.
const EMPTY_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7",
  "base64"
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adId = searchParams.get("ad") || "unknown";
    const eventType = searchParams.get("event") || "impression";

    await supabaseAdmin.from("ad_events").insert({
      ad_id: adId,
      event_type: eventType,
    });
  } catch (err) {
    console.error("Ad tracking error:", err);
  }

  return new NextResponse(EMPTY_GIF, {
    status: 200,
    headers: { "Content-Type": "image/gif" },
  });
}