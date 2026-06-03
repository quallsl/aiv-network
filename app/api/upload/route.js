import { uploadLargeToCloudinary } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ success: false, error: "No file uploaded" });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🔥 IMPORTANT: Cloudinary upload_large prefers file path or stream
    // For now we use a temporary file (Node environment)

    const fs = await import("fs");
    const path = await import("path");
    const os = await import("os");

    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, file.name);

    await fs.promises.writeFile(filePath, buffer);

    // 🚀 Upload to Cloudinary
    const result = await uploadLargeToCloudinary(filePath);

    // 🧹 Clean up temp file
    await fs.promises.unlink(filePath);

    return Response.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}