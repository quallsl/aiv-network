import { uploadLargeToCloudinary } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const result = await uploadLargeToCloudinary(file);

    return Response.json({
      secure_url: result.secure_url,
      thumbnail_url: result.secure_url.replace(
        "/upload/",
        "/upload/so_1,w_400,h_225,c_fill/"
      ).replace(/\.\w+$/, ".jpg"),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}