/**
 * robots.js
 * =========
 * Génère le fichier robots.txt dynamiquement.
 * L'URL de base est lue depuis les variables d'environnement pour supporter
 * dev, staging et production sans modification de code.
 *
 * Règles :
 *   - /api/       → non indexé (routes API Next.js)
 *   - /admin/     → non indexé (interface Directus si proxifiée)
 *   - /_next/     → non indexé (assets internes Next.js)
 *   - /maintenance → non indexé (page de maintenance)
 */
export default function robots() {
  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_DIRECTUS_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/api/", "/admin/", "/_next/", "/maintenance"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
