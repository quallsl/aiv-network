import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    // List image assets in your folder. Adjust prefix if needed.
    const res = await cloudinary.search
      .expression("resource_type:image AND folder:aiv-films")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute()

    const items = (res.resources || []).map((r) => ({
      public_id: r.public_id,
      format: r.format,
      secure_url: r.secure_url,
    }))

    return NextResponse.json({ ok: true, count: items.length, items })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    )
  }
}
