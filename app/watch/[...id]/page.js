import Link from "next/link";

function decodePart(part) {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

export default async function WatchPage({ params }) {
  // catch-all gives params.id as an array like ["v1767...", "aiv-films-..."]
  const { id = [] } = await params;

  const decodedPath = Array.isArray(id)
    ? id.map(decodePart).join("/")
    : decodePart(id);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Build the exact URL Cloudinary serves (.mp4)
  const src = cloudName
    ? `https://res.cloudinary.com/${cloudName}/video/upload/${decodedPath}.mp4`
    : "";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="px-4 py-4 md:px-10 flex items-center gap-3">
        <Link href="/" className="text-sm opacity-80 hover:opacity-100">
          ← Back
        </Link>
        <div className="text-sm opacity-80 truncate">{decodedPath}</div>
      </div>

      <div className="px-4 pb-10 md:px-10">
        {!cloudName ? (
          <div className="rounded-xl border border-white/10 p-4 text-sm opacity-80">
            Missing <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> in{" "}
            <code>.env.local</code>
          </div>
        ) : (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow">
            <video controls autoPlay playsInline className="h-full w-full">
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </main>
  );
}
