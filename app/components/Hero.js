import Link from "next/link";

export default function Hero({ item }) {
  if (!item) return null;

  return (
    <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={item.backdrop}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
      </div>

      <div className="relative z-10 flex h-full items-end px-4 pb-10 md:px-10">
        <div className="max-w-2xl">
          <div className="mb-3 flex flex-wrap gap-2 text-xs text-white/70">
            {item.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-white/5 px-2 py-1"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {item.title}
          </h1>

          <div className="mt-3 text-sm text-white/70">
            {item.year} · {item.duration}
          </div>

          <p className="mt-4 text-base text-white/80 md:text-lg">
            {item.synopsis}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href={`/watch/${encodeURIComponent(item.watchId)}`}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              ▶ Play
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              + My List (coming soon)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
