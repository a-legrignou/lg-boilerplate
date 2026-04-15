const BASE = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS?.replace(/\/$/, "") ?? "";

/**
 * Retourne l'URL complète d'un asset Directus.
 * @param {string|null|undefined} id  - ID ou chemin de l'asset
 * @param {string} fallback           - Image locale si l'asset est absent
 */
export function assetUrl(id, fallback = "/placeholder.jpg") {
  return id ? `${BASE}/${id}` : fallback;
}
