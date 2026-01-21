export const dynamic = "force-dynamic";

type Film = {
  id: string;
  title: string;
  description?: string;
  posterPublicId?: string;
};

type Row = {
  id: string;
  title: string;
  items: Film[];
};

async function getData() {
  const res = await fetch("http://localhost:3000/api/films", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch /api/films");
  }

  return res.json();
}

function posterUrl(cloudName: string, publicId?: string) {
  if (!cloudName || !publicId) return "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${publicId}.jpg`;
}

export default async function Home() {
  const data = await getData();
  const rows: Row[] = data.rows ?? [];
  const cloudName: string = data.cloudinaryCloudName ?? "";

  return (
    <main style={{ padding: 24 }}>
      {/* EXISTING HERO / FEATURED CONTENT STAYS ABOVE */}

      <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 32 }}>
        Catalog
      </h2>

      {rows.map((row) => (
        <section key={row.id} style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            {row.title}
          </h3>

          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
            }}
          >
            {row.items.map((film) => {
              const img = posterUrl(cloudName, film.posterPublicId);

              return (
                <div key={film.id} style={{ width: 180, flex: "0 0 auto" }}>
                  <div
                    style={{
                      width: 180,
                      height: 270,
                      borderRadius: 14,
                      background: "#111",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={film.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          padding: 12,
                          color: "rgba(255,255,255,0.6)",
                          fontSize: 12,
                        }}
                      >
                        Missing poster
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    {film.title}
                  </div>

                  {film.description && (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        lineHeight: 1.3,
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {film.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
