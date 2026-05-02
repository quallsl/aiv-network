import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
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