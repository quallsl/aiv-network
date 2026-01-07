"use client";

const MY_LIST_KEY = "aiv_my_list_v1";
const PROGRESS_KEY = "aiv_progress_v1";

export function readMyList() {
  try {
    const raw = localStorage.getItem(MY_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeMyList(items) {
  localStorage.setItem(MY_LIST_KEY, JSON.stringify(items));
}

export function toggleMyList(item) {
  const list = readMyList();
  const exists = list.some((x) => x.watchId === item.watchId);
  const next = exists ? list.filter((x) => x.watchId !== item.watchId) : [item, ...list];
  writeMyList(next);
  return { next, exists: !exists };
}

export function isInMyList(watchId) {
  const list = readMyList();
  return list.some((x) => x.watchId === watchId);
}

export function readProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writeProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function setProgress(watchId, data) {
  const all = readProgress();
  all[watchId] = { ...(all[watchId] || {}), ...data, updatedAt: Date.now() };
  writeProgress(all);
  return all;
}

export function removeProgress(watchId) {
  const all = readProgress();
  delete all[watchId];
  writeProgress(all);
  return all;
}
