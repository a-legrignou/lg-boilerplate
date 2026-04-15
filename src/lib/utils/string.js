/**
 * string.js
 * =========
 * Utilitaires de manipulation de chaînes de caractères.
 */

/**
 * Transforme un texte en slug URL-safe.
 * Ex : "Titre de l'Article" → "titre-de-larticle"
 *
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * Tronque un texte à une longueur maximale en ajoutant "…" si nécessaire.
 *
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export function truncate(text, max = 160) {
  if (!text || text.length <= max) return text ?? "";
  return text.slice(0, max).trimEnd() + "…";
}
