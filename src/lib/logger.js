/**
 * logger.js
 * =========
 * Utilitaire de logging centralisé.
 *
 * Avantages par rapport à console.error() dispersés :
 *  - Format uniforme `[context] message`
 *  - Un seul endroit à modifier pour brancher Sentry, Datadog, etc.
 *  - Silencieux en test (NODE_ENV === "test")
 */

const isSilent = process.env.NODE_ENV === "test";

/**
 * Log une erreur avec contexte.
 *
 * @param {string} context    - Nom du module/modèle, ex. "Directus:blog"
 * @param {unknown} error     - L'erreur capturée
 * @param {string} [detail]   - Information complémentaire optionnelle
 */
export function logError(context, error, detail) {
  if (isSilent) return;
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null
        ? JSON.stringify(error)
        : String(error);
  console.error(`[${context}]`, msg, detail ?? "");
}

/**
 * Log un avertissement non bloquant.
 *
 * @param {string} context
 * @param {string} message
 */
export function logWarn(context, message) {
  if (isSilent) return;
  console.warn(`[${context}]`, message);
}
