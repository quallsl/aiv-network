import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("New Film Submission:", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}