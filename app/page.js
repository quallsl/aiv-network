export const dynamic = "force-dynamic";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Row from "./components/Row";

async function getCatalogResponse() {
  try {
    // Relative URL avoids localhost issues in build/production
    const res = await fetch("/api/catalog", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Catalog fetch error:", err);
    return null;
  }
}

export default async function Home() {
  const data = await getCatalogResponse();
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
