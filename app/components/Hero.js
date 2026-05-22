import Link from "next/link";

export default function Hero({ item }) {
  if (!item) return null;

  const featureId = item?.watchId || item?.id;
  const trailerId = item?.trailerId || null;

  const watchHref = featureId ? `/watch/${encodeURIComponent(featureId)}` : "#";
  const trailerHref = trailerId ? `/watch/${encodeURIComponent(trailerId)}` : null;

  return (
    <section className="relative">
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-black">
        {item?.backdrop ? (
          // eslint-disable-next-line @next/next/no-img-element
        <img
          src={film.thumbnail_url}
          alt={film.title}
          className="w-full h-full object-cover"
        />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 md:px-10">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs uppercase tracking-widest opacity-70">
              {Array.isArray(item?.tags) ? item.tags.join(" • ") : "AIV"}
            </div>

            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              {item?.title ?? "Featured"}
            </h1>

            <div className="text-sm opacity-80">
              {item?.year ?? ""}
              {item?.duration ? ` • ${item.duration}` : ""}
            </div>

            {item?.synopsis ? (
              <p className="text-sm leading-relaxed opacity-80">{item.synopsis}</p>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={watchHref}
                className="inline-flex items-center justify-center rounded bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                prefetch={false}
              >
                ▶ Watch Feature
              </Link>

              {trailerHref ? (
                <Link
                  href={trailerHref}
                  className="inline-flex items-center justify-center rounded border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                  prefetch={false}
                >
                  🎬 Play Trailer
                </Link>
              ) : null}
            </div>

            {trailerHref && item?.trailerTitle ? (
              <div className="text-xs opacity-70">
                Trailer: {item.trailerTitle}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
