"use client";

export function searchCatalog(catalog, query) {
  if (!query) return [];

  const q = query.toLowerCase();

  const results = [];

  if (catalog?.hero) {
    if (matches(catalog.hero, q)) {
      results.push(catalog.hero);
    }
  }

  for (const row of catalog?.rows || []) {
    for (const item of row.items || []) {
      if (matches(item, q)) {
        results.push(item);
      }
    }
  }

  return results;
}

function matches(item, q) {
  return (
    item.title?.toLowerCase().includes(q) ||
    item.synopsis?.toLowerCase().includes(q) ||
    item.tags?.some((t) => t.toLowerCase().includes(q))
  );
}
