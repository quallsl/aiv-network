"use client";

import { useEffect, useState } from "react";
import { catalog as fallbackCatalog } from "../../lib/mockCatalog";

export function useCatalog() {
  const [catalog, setCatalog] = useState(fallbackCatalog);
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setStatus({ loading: true, error: "" });
        const res = await fetch("/api/catalog", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load catalog");
        if (alive && data?.catalog) setCatalog(data.catalog);
        if (alive) setStatus({ loading: false, error: "" });
      } catch (e) {
        if (alive) setStatus({ loading: false, error: e?.message || "Error" });
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  return { catalog, ...status };
}
