import type { Media, Page, Post, Setting, Seo, User } from "@/payload-types";
import { LOCALES, localizedPath, type Locale } from "./i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const mediaUrl = (m: number | Media | null | undefined): string | undefined => {
  if (!m || typeof m !== "object") return undefined;
  return m.url ? new URL(m.url, SITE_URL).toString() : undefined;
};

export type JsonLd = Record<string, unknown>;

export function organizationSchema(
  settings: Setting | null,
  seo: Seo | null,
): JsonLd {
  const name = seo?.organization?.legalName || settings?.siteName || "Folio";
  const social = seo?.social;
  const sameAs = [
    social?.twitter
      ? `https://twitter.com/${social.twitter.replace(/^@/, "")}`
      : null,
    social?.github
      ? `https://github.com/${social.github.replace(/^@/, "")}`
      : null,
    social?.linkedin
      ? social.linkedin.startsWith("company/")
        ? `https://www.linkedin.com/${social.linkedin}`
        : `https://www.linkedin.com/in/${social.linkedin}`
      : null,
    social?.instagram
      ? `https://www.instagram.com/${social.instagram.replace(/^@/, "")}`
      : null,
    social?.facebook ? `https://www.facebook.com/${social.facebook}` : null,
    social?.youtube
      ? social.youtube.startsWith("channel/")
        ? `https://www.youtube.com/${social.youtube}`
        : `https://www.youtube.com/@${social.youtube.replace(/^@/, "")}`
      : null,
    social?.mastodon ? social.mastodon : null,
  ].filter((v): v is string => Boolean(v));

  const org = seo?.organization;
  const contactPoint =
    org?.contactEmail || org?.contactPhone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: org.contactType || "customer support",
            ...(org.contactEmail ? { email: org.contactEmail } : {}),
            ...(org.contactPhone ? { telephone: org.contactPhone } : {}),
          },
        }
      : {};

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: SITE_URL,
    ...(org?.foundingDate ? { foundingDate: org.foundingDate } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...contactPoint,
  };
}

export function websiteSchema(settings: Setting | null): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.siteName || "Folio",
    url: SITE_URL,
    ...(settings?.siteDescription
      ? { description: settings.siteDescription }
      : {}),
    inLanguage: LOCALES.map((l) => (l === "fr" ? "fr-FR" : "en-US")),
  };
}

export function breadcrumbSchema(
  items: { label: string; path: string }[],
  locale: Locale,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${localizedPath(item.path, locale)}`,
    })),
  };
}

export function personSchema(user: User, locale: Locale): JsonLd {
  const url = user.slug
    ? `${SITE_URL}${localizedPath(`/auteur/${user.slug}`, locale)}`
    : undefined;
  const sameAs = [
    user.socials?.twitter
      ? `https://twitter.com/${user.socials.twitter.replace(/^@/, "")}`
      : null,
    user.socials?.linkedin
      ? `https://www.linkedin.com/in/${user.socials.linkedin}`
      : null,
    user.socials?.github
      ? `https://github.com/${user.socials.github.replace(/^@/, "")}`
      : null,
    user.socials?.website || null,
  ].filter((v): v is string => Boolean(v));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name || user.email,
    ...(user.bio ? { description: user.bio } : {}),
    ...(url ? { url } : {}),
    ...(mediaUrl(user.avatar) ? { image: mediaUrl(user.avatar) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function articleSchema(post: Post, locale: Locale): JsonLd {
  const image = mediaUrl(post.cover) ?? mediaUrl(post.meta?.image);
  const url = `${SITE_URL}${localizedPath(`/blog/${post.slug}`, locale)}`;
  const author =
    post.author && typeof post.author === "object"
      ? {
          "@type": "Person",
          name: post.author.name || post.author.email,
          ...(post.author.slug
            ? {
                url: `${SITE_URL}${localizedPath(`/auteur/${post.author.slug}`, locale)}`,
              }
            : {}),
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta?.title || post.title,
    ...(post.meta?.description || post.excerpt
      ? { description: post.meta?.description || post.excerpt }
      : {}),
    ...(image ? { image: [image] } : {}),
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    ...(author ? { author } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
  };
}

export function pageSchema(page: Page, locale: Locale): JsonLd {
  const url =
    page.slug === "home"
      ? `${SITE_URL}${localizedPath("/", locale)}`
      : `${SITE_URL}${localizedPath(`/${page.slug}`, locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.meta?.title || page.title,
    ...(page.meta?.description ? { description: page.meta.description } : {}),
    url,
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
  };
}

type ProductInput = {
  name: string;
  description?: string;
  image?: string | string[];
  brand?: string;
  sku?: string;
  url?: string;
  price: number | string;
  priceCurrency: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  rating?: { value: number; count: number };
};

export function productSchema(p: ProductInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    ...(p.image ? { image: p.image } : {}),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.sku ? { sku: p.sku } : {}),
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.priceCurrency,
      availability: `https://schema.org/${p.availability ?? "InStock"}`,
      ...(p.url ? { url: p.url } : {}),
    },
    ...(p.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.rating.value,
            reviewCount: p.rating.count,
          },
        }
      : {}),
  };
}

export function faqSchema(
  items: { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function howToSchema({
  name,
  description,
  totalTime,
  steps,
}: {
  name: string;
  description?: string;
  totalTime?: string;
  steps: { name: string; text: string; url?: string; image?: string }[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    ...(description ? { description } : {}),
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
      ...(s.image ? { image: s.image } : {}),
    })),
  };
}
