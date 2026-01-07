import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Row from "./components/Row";

async function getCatalogResponse() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    const res = await fetch(`${base}/api/catalog`, { cache: "no-store" });

    if (!res.ok) {
      console.error("Failed to load /api/catalog:", res.status, res.statusText);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Catalog fetch error:", err);
    return null;
  }
}

export default async function Home() {
  const data = await getCatalogResponse();

  // Your API returns: { catalog: { hero, rows }, count, prefix }
  // This unwraps it safely:
  const catalog = data?.catalog ?? null;

  return (
    <main className="min-h-screen bg-black text-white">
      <Nav />
      <Hero item={catalog?.hero} />

      <section className="px-4 pb-16 md:px-10">
        <div className="-mt-12 space-y-10 md:-mt-20">
          {(catalog?.rows ?? []).map((row, idx) => (
            <Row
              key={row?.title ?? row?.id ?? idx}
              title={row?.title ?? "Row"}
              items={row?.items}
            />
          ))}
        </div>

        {!catalog && (
          <div className="mt-6 text-sm opacity-70">
            Catalog not loaded yet.
          </div>
        )}
      </section>
    </main>
  );
}
