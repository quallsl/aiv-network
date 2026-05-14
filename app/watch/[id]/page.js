import Link from "next/link";
import VideoPlayer from "../../components/VideoPlayer";
import { catalog } from "../../../lib/mockCatalog";

function decodeId(id) {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

function findMetaByWatchId(watchId) {
  // try hero
  if (catalog?.hero?.watchId === watchId) return catalog.hero;

  // try rows
  for (const row of catalog?.rows || []) {
    for (const item of row.items || []) {
      if (item.watchId === watchId) return item;
    }
  }
  return null;
}

export default async function WatchPage({ params }) {
  const { id } = await params;
  const decoded = decodeId(id);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Auto format + quality (consumer-ready)
  const src = cloudName
    ? `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${decoded}`
    : "";

  const meta = findMetaByWatchId(decoded) || {
    title: decoded,
    year: "",
    duration: "",
    poster:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
    watchId: decoded,
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="px-4 py-4 md:px-10 flex items-center gap-3">
        <Link href="/" className="text-sm opacity-80 hover:opacity-100">← Back</Link>
        <Link href="/catalog" className="text-sm opacity-80 hover:opacity-100">Catalog</Link>
        <Link href="/submit" className="text-sm opacity-80 hover:opacity-100">Submit</Link>
        <div className="text-sm opacity-80 truncate">{meta.title}</div>
      </div>

      <div className="px-4 pb-10 md:px-10 space-y-4">
        {!cloudName ? (
          <div className="rounded-xl border border-white/10 p-4 text-sm opacity-80">
            Missing <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> in{" "}
            <code>.env.local</code>
          </div>
        ) : (
          <VideoPlayer
            src={src}
            meta={{
              watchId: meta.watchId,
              title: meta.title,
              poster: meta.poster,
              year: meta.year,
              duration: meta.duration,
            }}
          />
        )}

        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold">{meta.title}</h1>
          <div className="mt-2 text-sm text-white/70">
            {meta.year ? `${meta.year} · ` : ""}{meta.duration || ""}
          </div>
          {meta.synopsis && (
            <p className="mt-3 text-base text-white/80">{meta.synopsis}</p>
          )}
        </div>
      </div>
    </main>
  );
}
