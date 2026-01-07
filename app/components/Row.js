import Link from "next/link";

export default function Row({ title, items }) {
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {safeItems.map((item, idx) => {
          const id = item?.watchId || item?.id || String(idx);
          const href = `/watch/${encodeURIComponent(id)}`;

          return (
            <Link
              key={id}
              href={href}
              className="group w-40 flex-shrink-0"
              prefetch={false}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded bg-neutral-900">
                {item?.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.poster}
                    alt={item?.title ?? "Poster"}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs opacity-70">
                    No poster
                  </div>
                )}
              </div>

              <div className="mt-2 text-sm">
                <div className="truncate">{item?.title ?? "Untitled"}</div>
                <div className="text-xs opacity-70">
                  {item?.year ?? ""}
                  {item?.duration ? ` • ${item.duration}` : ""}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
