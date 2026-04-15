/**
 * jsonld-utils.js
 * ===============
 * Générateurs de blocs JSON-LD (Schema.org) pour le SEO structuré.
 *
 * Usage : importer la fonction souhaitée dans un page.js serveur,
 * puis l'injecter via <Script type="application/ld+json"> dans le JSX.
 *
 * Toutes les fonctions sont synchrones et pures (pas d'effet de bord).
 */

// ─── Helpers internes ──────────────────────────────────────────────────────────

/** Base URL des assets Directus (sans slash final). */
const assetBase = () =>
  (process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "").replace(/\/$/, "");

/** Base URL du site (sans slash final), avec cascade de fallbacks. */
const siteOrigin = (settings) =>
  (settings?.site_url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

// ─── Organisation ──────────────────────────────────────────────────────────────

/**
 * Génère le bloc Organization (racine du site, injecté dans layout.js).
 * Inclut logo, coordonnées, réseaux sociaux et adresse postale si disponible.
 */
export function generateOrganizationJsonLd(settings) {
  if (!settings) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company_name || settings.site_name || "",
    legalName: settings.legal_name || undefined,
    url: settings.site_url || undefined,
    logo: {
      "@type": "ImageObject",
      url: settings.logo ? `${assetBase()}/${settings.logo}` : undefined,
      width: 250,
      height: 60,
    },
    sameAs: [
      settings.linkedin_url,
      settings.twitter_handle
        ? `https://twitter.com/${settings.twitter_handle.replace("@", "")}`
        : null,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      contactType: "customer support",
      availableLanguage: ["French"],
      areaServed: "FR",
    },
    ...(settings.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: settings.city,
        postalCode: settings.postal_code,
        addressCountry: "FR",
      },
    }),
  };
}

// ─── WebPage ───────────────────────────────────────────────────────────────────

/**
 * Génère le bloc WebPage pour les pages statiques ou de listing.
 * À utiliser avec generatePageSeo pour un SEO cohérent.
 *
 * @param {object} page      - Objet page Directus (title, seo_description, image, slug…)
 * @param {object} settings  - SiteSettings Directus
 * @param {string} pathname  - Chemin de la page, ex. "/fr/expertises"
 */
export function generateWebPageJsonLd({ page, settings, pathname = "/" }) {
  const origin = siteOrigin(settings);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page?.title || settings?.site_name,
    description: page?.seo_description || settings?.default_seo_description,
    url: `${origin}${pathname}`,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "WebSite",
      name: settings?.site_name,
      url: origin,
    },
    ...(page?.image && {
      image: {
        "@type": "ImageObject",
        url: `${assetBase()}/${page.image?.id ?? page.image}`,
        width: 1200,
        height: 630,
      },
    }),
    ...(page?.published_at && { datePublished: page.published_at }),
    ...(page?.updated_at && { dateModified: page.updated_at }),
  };
}

// ─── Article (blog) ────────────────────────────────────────────────────────────

/**
 * Génère le bloc BlogPosting pour un article de blog.
 * Utilise seo_image > image comme source d'illustration (aligné sur generatePostSeo).
 * Conforme aux recommandations Google pour le contenu payant (hasPart/isAccessibleForFree
 * doit être ajouté par l'appelant si l'article est tier-gatted).
 *
 * @param {object} post      - Objet article Directus
 * @param {object} settings  - SiteSettings Directus
 * @param {string} locale    - Locale active (ex. "fr"), utilisée pour le canonical @id
 */
export function generatePostJsonLd(post, settings, locale = "fr") {
  const origin = siteOrigin(settings);
  const ASSETS = (process.env.NEXT_PUBLIC_DIRECTUS_ASSETS || "").replace(/\/$/, "");

  // Priorité : seo_image > image (cohérent avec generatePostSeo dans seo-utils.js)
  const imageId = post.seo_image?.id ?? post.image?.id ?? post.image ?? null;
  const imageUrl = imageId
    ? `${ASSETS}/${imageId}?format=jpg&width=1200&height=630&fit=cover`
    : `${origin}/og-default.jpg`;

  const postSlug = post.slug || post.id;
  const authorName = post.author
    ? `${post.author.first_name ?? ""} ${post.author.last_name ?? ""}`.trim()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    ...(authorName && {
      author: {
        "@type": "Person",
        name: authorName,
        ...(post.author?.url && { url: post.author.url }),
      },
    }),
    publisher: {
      "@type": "Organization",
      name: settings?.site_name || "",
      logo: {
        "@type": "ImageObject",
        url: settings?.logo ? `${assetBase()}/${settings.logo}` : undefined,
      },
    },
    datePublished: post.published_at || post.date_created,
    dateModified: post.updated_at || post.date_updated,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${origin}/${locale}/blog/${postSlug}`,
    },
  };
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────────

/**
 * Génère le fil d'Ariane BreadcrumbList.
 * Utilisé sur toutes les pages de détail (article, référence, expertise).
 *
 * @param {Array<{ name: string, path: string }>} items  - Étapes du fil d'Ariane
 * @param {object} settings                              - SiteSettings Directus
 */
export function generateBreadcrumbJsonLd(items, settings) {
  const origin = siteOrigin(settings);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

/**
 * Génère le bloc FAQPage pour les pages contenant des questions/réponses.
 * Utilisé sur la page d'accueil.
 *
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export function generateFAQJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── LocalBusiness ─────────────────────────────────────────────────────────────

/**
 * Génère le bloc LocalBusiness si une adresse physique est définie dans Directus.
 * Non utilisé par défaut — à injecter dans layout.js si pertinent.
 *
 * @param {object} settings - SiteSettings Directus
 */
export function generateLocalBusinessJsonLd(settings) {
  if (!settings?.address) return null;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.company_name || settings.site_name || "",
    image: settings.logo ? `${assetBase()}/${settings.logo}` : undefined,
    "@id": settings.site_url,
    url: settings.site_url,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city,
      postalCode: settings.postal_code,
      addressCountry: "FR",
    },
    ...(settings.opening_hours && {
      openingHoursSpecification: settings.opening_hours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      })),
    }),
  };
}

// ─── Service (Proposal) ────────────────────────────────────────────────────────

const PERSONA_AUDIENCE = {
  leaders:       "Dirigeants d'entreprise",
  dirigeants:    "Dirigeants d'entreprise",
  investisseurs: "Investisseurs et fonds d'investissement",
  investors:     "Investisseurs et fonds d'investissement",
};

const AXE_SERVICE_TYPE = {
  growth:     "Conseil en développement stratégique",
  resilience: "Conseil en sécurité économique",
};

/**
 * Génère le bloc Service enrichi pour les pages /proposal/[slug].
 * Inclut offers, areaServed structuré, audience et hasOfferCatalog.
 *
 * @param {{ module: object, settings: object, locale: string, slug: string }} params
 */
export function generateServiceJsonLd({ module, settings, locale, slug }) {
  const origin   = siteOrigin(settings);
  const provider = {
    "@type": "Organization",
    name: settings?.company_name || settings?.site_name || "",
    url:  origin,
  };

  const personaRaw = Array.isArray(module.persona)
    ? module.persona
    : (module.persona?.split(",") ?? []);
  const audiences = [...new Set(personaRaw.map((p) => PERSONA_AUDIENCE[p.trim()]).filter(Boolean))];

  const benefits = Array.isArray(module.benefits) ? module.benefits.filter(Boolean) : [];

  return {
    "@context": "https://schema.org",
    "@type":    "Service",
    "@id":      `${origin}/${locale}/proposal/${slug}`,
    name:        module.title,
    description: module.description ?? module.why ?? undefined,
    serviceType: AXE_SERVICE_TYPE[module.axe] ?? "Conseil en stratégie",
    url:         `${origin}/${locale}/proposal/${slug}`,

    provider,

    areaServed: [
      { "@type": "Country",   name: "France", sameAs: "https://www.wikidata.org/wiki/Q142" },
      { "@type": "Continent", name: "Europe", sameAs: "https://www.wikidata.org/wiki/Q46"  },
    ],

    ...(audiences.length > 0 && {
      audience: audiences.map((a) => ({
        "@type":      "BusinessAudience",
        audienceType: a,
      })),
    }),

    offers: {
      "@type":       "Offer",
      name:          module.title,
      description:   module.budget ?? "Accompagnement sur mesure — tarif communiqué sur devis",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type":       "UnitPriceSpecification",
        description:   module.budget ?? "Sur devis",
        priceCurrency: "EUR",
      },
      seller: provider,
    },

    ...(benefits.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name:    "Bénéfices de la prestation",
        itemListElement: benefits.map((b, i) => ({
          "@type":    "ListItem",
          position:   i + 1,
          item: {
            "@type": "Offer",
            name:    b,
            itemOffered: { "@type": "Service", name: b },
          },
        })),
      },
    }),
  };
}
