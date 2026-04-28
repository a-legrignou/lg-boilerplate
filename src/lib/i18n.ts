export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/**
 * Build the public URL for a given path + locale.
 * Default locale (fr) has no prefix; others get `/<locale>`.
 */
export function localizedPath(path: string, locale: Locale): string {
  const cleaned = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return cleaned === "/" ? "/" : cleaned;
  return cleaned === "/" ? `/${locale}` : `/${locale}${cleaned}`;
}
