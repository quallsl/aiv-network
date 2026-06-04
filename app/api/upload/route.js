import { uploadLargeToCloudinary } from "../../lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadLargeToCloudinary(buffer);

    return Response.json({
      secure_url: result.secure_url,
      thumbnail_url: result.secure_url
        .replace("/upload/", "/upload/so_1,w_400,h_225,c_fill/")
        .replace(/\.\w+$/, ".jpg"),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}