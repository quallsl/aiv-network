import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY");
      return NextResponse.json(
        { success: false, message: "Missing email configuration" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);
    const data = await req.json();

    const {
      creatorName,
      email,
      filmTitle,
      runtime,
      genre,
      synopsis,
      videoLink,
    } = data;

    await resend.emails.send({
      from: "AIVNetwork Submissions <onboarding@resend.dev>",
      to: ["aiv.stream@mail.com"],
      subject: `New Film Submission: ${filmTitle || "Untitled"}`,
      html: `
        <h2>New AIVNetwork Film Submission</h2>
        <p><strong>Creator:</strong> ${creatorName || ""}</p>
        <p><strong>Email:</strong> ${email || ""}</p>
        <p><strong>Film Title:</strong> ${filmTitle || ""}</p>
        <p><strong>Runtime:</strong> ${runtime || ""}</p>
        <p><strong>Genre:</strong> ${genre || ""}</p>
        <p><strong>Video Link:</strong> <a href="${videoLink || "#"}">${videoLink || ""}</a></p>
        <p><strong>Synopsis:</strong></p>
        <p>${synopsis || ""}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission email failed:", error);

    return NextResponse.json(
      { success: false, message: "Submission failed" },
      { status: 500 }
    );
  }
}