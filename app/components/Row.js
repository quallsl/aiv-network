import Link from "next/link";

export default function Row({ title, items = [] }) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold tracking-wide">{title}</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${encodeURIComponent(item.publicId || item.id)}`}
            className="w-[160px] shrink-0 md:w-[200px]"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 hover:ring-white/30">
              {item.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.poster}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/60">
                  No poster
                </div>
              )}
            </div>

            <div className="mt-2 text-sm">{item.title}</div>
            <div className="text-xs text-white/60">
              {item.year ? item.year : ""}{item.year && item.duration ? " • " : ""}{item.duration}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
