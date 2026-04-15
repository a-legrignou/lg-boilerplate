/**
 * seo-utils.js
 * ============
 * Générateurs de métadonnées Next.js (retournés par generateMetadata dans chaque page).
 * Chaque fonction retourne un objet compatible avec l'API Metadata de Next.js 13+.
 *
 * Fonctions disponibles :
 *   generateGlobalSeo(settings)                          → layout racine
 *   generatePageSeo({ page, settings, locale })          → pages statiques / listings
 *   generatePostSeo({ post, settings, locale })          → articles de blog
 *   generateCaseStudySeo({ study, settings, locale })    → études de cas / références
 *   generateModuleSeo({ module, settings, locale })      → expertises / offres
 */

// ─── Locales supportées ────────────────────────────────────────────────────────

const LOCALES   = ["fr", "en"];
const LOCALE_MAP = { fr: "fr_FR", en: "en_GB" };

// ─── Fallbacks SEO par page ────────────────────────────────────────────────────
// Appliqués quand Directus ne fournit pas seo_title / seo_description sur la page.

const PAGE_SEO_DEFAULTS = {
  home: {
    title: "Conseil stratégique pour dirigeants & investisseurs",
    description:
      "Les marchés institutionnels ne s'improvisent pas. Nous accompagnons les dirigeants qui s'y développent et les investisseurs qui y qualifient leurs cibles.",
  },
  defense: {
    title: "Développement sur les marchés de la défense",
    description:
      "Cycles DGA, voies agiles AID et MCO, développement à l'export : un accompagnement calibré sur les codes d'un marché que nous connaissons de l'intérieur.",
  },
  security: {
    title: "Développement sur les marchés de la sécurité",
    description:
      "Régalien, polices municipales, sécurité privée (CNAPS) : cartographiez le continuum sécuritaire et développez votre présence avec les bons interlocuteurs.",
  },
  "critical-industries": {
    title: "Industries critiques — Maturité & développement",
    description:
      "NIS2, LPM, souveraineté technologique : accompagnement des opérateurs d'infrastructures critiques sur leur maturité et des fournisseurs sur leur développement.",
  },
  "regulated-professions": {
    title: "Professions réglementées — Stratégie & gouvernance",
    description:
      "Conformité ordinale, gouvernance, gestion des risques et développement stratégique : un conseil adapté aux contraintes déontologiques des professions réglementées.",
  },
  blog: {
    title: "Analyses & intelligence stratégique",
    description:
      "Publications et analyses sur la stratégie, le développement institutionnel et la sécurité économique. Points de vue d'experts pour dirigeants et investisseurs.",
  },
  expertises: {
    title: "Nos expertises",
    description:
      "Développement commercial, sécurité économique, gouvernance : découvrez l'ensemble de nos offres pour dirigeants et investisseurs opérant dans des marchés institutionnels.",
  },
  references: {
    title: "Références clients & études de cas",
    description:
      "Découvrez comment nous accompagnons dirigeants et investisseurs sur des marchés institutionnels, réglementés et sensibles.",
  },
};

const SITE_DEFAULT_DESCRIPTION =
  "Cabinet de conseil en stratégie, développement et sécurité économique — pour les dirigeants et les investisseurs qui opèrent dans des marchés qui ne s'improvisent pas.";

// ─── Helpers internes ──────────────────────────────────────────────────────────

/** URL d'origine du site, sans slash final. */
const siteOrigin = (settings) =>
  (settings?.site_url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Base URL des assets Directus, sans slash final. */
const assetsBase = () =>
  (process.env.NEXT_PUBLIC_DIRECTUS_ASSETS || "").replace(/\/$/, "");

/**
 * Construit l'URL d'une image OG depuis un objet asset Directus ou un ID brut.
 * Applique les paramètres de redimensionnement pour Directus Transforms.
 */
const ogImageUrl = (imageRef, origin) => {
  if (!imageRef) return `${origin}/og-default.jpg`;
  const id = imageRef?.id ?? imageRef;
  return `${assetsBase()}/${id}?format=jpg&width=1200&height=630&fit=cover`;
};

/**
 * Construit le bloc hreflang pour une URL de base donnée.
 * x-default pointe toujours vers /fr (langue principale).
 */
const buildHreflang = (origin, path) => {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${origin}/${l}${path}`]));
  languages["x-default"] = `${origin}/fr${path}`;
  return languages;
};

/**
 * Bloc robots commun pour les pages publiques (indexation contrôlée par noindex).
 */
const robotsMeta = (noindex) => ({
  index: !noindex,
  follow: !noindex,
  nocache: !!noindex,
  googleBot: { index: !noindex, follow: !noindex },
});

// ─── Global (layout racine) ────────────────────────────────────────────────────

/**
 * Métadonnées globales injectées dans le layout racine (src/app/layout.js).
 * Définit le titre de base, la description, les robots, et l'OG par défaut.
 */
export function generateGlobalSeo(settings) {
  const origin = siteOrigin(settings);
  const siteName = settings?.site_name || "";
  const defaultImageUrl = settings?.default_og_image?.id
    ? `${assetsBase()}/${settings.default_og_image.id}`
    : `${origin}/og-default.jpg`;

  return {
    metadataBase: new URL(origin),
    title: siteName,
    description: settings?.default_seo_description || SITE_DEFAULT_DESCRIPTION,
    // Vérification Google Search Console (token stocké dans Directus site_settings)
    verification: {
      google: settings?.google_site_verification || undefined,
    },
    // Indexation désactivée hors production pour éviter les crawls sur dev/staging
    robots: {
      index: process.env.NEXT_PUBLIC_APP_ENV === "production" ? (settings?.robots_index ?? true) : false,
      follow: process.env.NEXT_PUBLIC_APP_ENV === "production" ? (settings?.robots_follow ?? true) : false,
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName,
      url: origin,
      images: [{ url: defaultImageUrl, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      site: settings?.twitter_handle || "",
      creator: settings?.twitter_handle || "",
      images: [{ url: defaultImageUrl, alt: siteName }],
    },
  };
}

// ─── Pages statiques et listings ──────────────────────────────────────────────

/**
 * Métadonnées pour les pages CMS (home, blog, expertises, références…).
 * Priorité : champs Directus > PAGE_SEO_DEFAULTS > settings globaux.
 *
 * @param {object} page      - Objet page Directus (slug, title, seo_title, seo_description, image…)
 * @param {object} settings  - SiteSettings Directus
 * @param {string} locale    - Locale active, ex. "fr"
 */
export function generatePageSeo({ page, settings, locale = "fr" }) {
  if (!page || !settings) return {};

  const origin   = siteOrigin(settings);
  const siteName = settings.site_name || "";

  const defaults    = PAGE_SEO_DEFAULTS[page.slug] ?? {};
  const rawTitle    = page.seo_title || defaults.title || page.title || settings.default_seo_title || siteName;
  const title       = rawTitle === siteName ? siteName : `${rawTitle} | ${siteName}`;
  const description = page.seo_description || defaults.description || settings.default_seo_description || SITE_DEFAULT_DESCRIPTION;

  const imageUrl  = ogImageUrl(page.seo_image || page.image || settings.default_og_image, origin);
  const slug      = !page.slug || page.slug === "home" ? "" : `/${page.slug}`;
  const canonical = `${origin}/${locale}${slug}`;
  const languages = buildHreflang(origin, slug);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "website",
      locale: LOCALE_MAP[locale] ?? "fr_FR",
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_MAP[l]),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(page.published_at && { publishedTime: page.published_at }),
      ...(page.updated_at   && { modifiedTime: page.updated_at }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
    robots: robotsMeta(page.noindex),
  };
}

// ─── Articles de blog ──────────────────────────────────────────────────────────

/**
 * Métadonnées pour un article de blog.
 * Conforme au SEO paywall Google : les métadonnées sont toujours générées,
 * même si le corps de l'article est verrouillé (tier community/premium).
 *
 * @param {object} post      - Objet article Directus
 * @param {object} settings  - SiteSettings Directus
 * @param {string} locale    - Locale active
 */
export function generatePostSeo({ post, settings, locale = "fr" }) {
  if (!post || !settings) return {};

  const origin   = siteOrigin(settings);
  const siteName = settings.site_name || "";

  const rawTitle    = post.seo_title || post.title || siteName;
  const title       = rawTitle === siteName ? siteName : `${rawTitle} | ${siteName}`;
  const description = post.seo_description || post.excerpt || settings.default_seo_description || "";

  const imageUrl  = ogImageUrl(post.seo_image || post.image || settings.default_og_image, origin);
  const postSlug  = post.slug || post.id;
  const canonical = `${origin}/${locale}/blog/${postSlug}`;
  const languages = buildHreflang(origin, `/blog/${postSlug}`);

  const authorName = post.author
    ? `${post.author.first_name ?? ""} ${post.author.last_name ?? ""}`.trim()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "article",
      locale: LOCALE_MAP[locale] ?? "fr_FR",
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_MAP[l]),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(post.date_created          && { publishedTime: post.date_created }),
      ...(post.date_updated          && { modifiedTime: post.date_updated }),
      ...(authorName                 && { authors: [authorName] }),
      ...(post.category?.title       && { section: post.category.title }),
      ...(post.tags?.length          && { tags: post.tags.map((t) => t.title || t) }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
    robots: robotsMeta(post.noindex),
  };
}

// ─── Études de cas (références) ────────────────────────────────────────────────

/**
 * Métadonnées pour une page de détail d'étude de cas.
 * Inclut canonical localisé, hreflang, OG image depuis Directus, et Twitter card.
 *
 * @param {object} study     - Objet case_study Directus (slug, title, description, image…)
 * @param {object} settings  - SiteSettings Directus
 * @param {string} locale    - Locale active
 */
export function generateCaseStudySeo({ study, settings, locale = "fr" }) {
  if (!study || !settings) return {};

  const origin   = siteOrigin(settings);
  const siteName = settings.site_name || "";

  const title       = `${study.title} | ${siteName}`;
  const description = study.description || settings.default_seo_description || "";

  const imageUrl  = ogImageUrl(study.seo_image || study.image || settings.default_og_image, origin);
  const canonical = `${origin}/${locale}/references/${study.slug}`;
  const languages = buildHreflang(origin, `/references/${study.slug}`);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "website",
      locale: LOCALE_MAP[locale] ?? "fr_FR",
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_MAP[l]),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
  };
}

// ─── Expertises / modules ──────────────────────────────────────────────────────

/**
 * Métadonnées pour une page de détail d'expertise (offre / service).
 * Utilise description > why comme fallback pour la meta description.
 *
 * @param {object} module    - Objet product Directus (slug, title, description, why, image…)
 * @param {object} settings  - SiteSettings Directus
 * @param {string} locale    - Locale active
 */
export function generateModuleSeo({ module, settings, locale = "fr" }) {
  if (!module || !settings) return {};

  const origin   = siteOrigin(settings);
  const siteName = settings.site_name || "";

  const title       = `${module.title} | ${siteName}`;
  const description = module.description || module.why || settings.default_seo_description || "";

  const imageUrl  = ogImageUrl(module.seo_image || module.image || settings.default_og_image, origin);
  const canonical = `${origin}/${locale}/proposal/${module.slug}`;
  const languages = buildHreflang(origin, `/proposal/${module.slug}`);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "website",
      locale: LOCALE_MAP[locale] ?? "fr_FR",
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_MAP[l]),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
  };
}
