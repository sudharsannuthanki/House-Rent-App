// Saved/Favorite properties - stored per-browser in localStorage.
// No backend model needed: this is a lightweight "bookmark" feature,
// not user account data, so it works even for logged-out visitors.

const STORAGE_KEY = "houserent-favorites";

function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  // Lets any mounted component (e.g. the navbar count) react to the change.
  window.dispatchEvent(new Event("favorites-changed"));
}

export function getFavoriteIds() {
  return readIds();
}

export function isFavorite(propertyId) {
  return readIds().includes(propertyId);
}

export function toggleFavorite(propertyId) {
  const ids = readIds();
  const next = ids.includes(propertyId)
    ? ids.filter((id) => id !== propertyId)
    : [...ids, propertyId];
  writeIds(next);
  return next.includes(propertyId);
}
