// app/sitemap.js
import { getSiteSettings } from "@/lib/models/settings";
import { getAllPages } from "@/lib/models/content";
import { getBlogContent } from "@/lib/models/blog";
import { getCases } from "@/lib/models/cases";
import { getAllModules } from "@/lib/models/products";

const LOCALES = ["fr", "en"];

export default async function sitemap() {
  const settings = (await getSiteSettings())?.[0];
  const SITE_URL = (settings?.site_url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const [pages, posts, cases, modules] = await Promise.all([
    getAllPages(),
    getBlogContent(),
    getCases(),
    getAllModules(),
  ]);

  // Pages localisées : une entrée par locale (exclure expertises et proposal — redirect vers home)
  const pageUrls = LOCALES.flatMap((locale) =>
    (pages ?? []).filter((page) => page.slug !== "expertises" && page.slug !== "proposal").map((page) => ({
      url: page.slug === "home" ? `${SITE_URL}/${locale}` : `${SITE_URL}/${locale}/${page.slug}`,
      lastModified: page.date_updated || page.date_created,
      changeFrequency: "weekly",
      priority: page.priority || 0.8,
    }))
  );

  // Blog localisé
  const blogUrls = LOCALES.flatMap((locale) =>
    (posts ?? []).map((post) => ({
      url: `${SITE_URL}/${locale}/blog/${post.slug || post.id}`,
      lastModified: post.date_updated || post.date_created || post.date_published,
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  );

  // Références clients (études de cas)
  const caseUrls = LOCALES.flatMap((locale) =>
    (cases ?? []).map((c) => ({
      url: `${SITE_URL}/${locale}/references/${c.slug}`,
      lastModified: c.date_updated || c.date_created,
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  );

  // Pages proposal — une par module (slug Directus)
  const expertiseUrls = LOCALES.flatMap((locale) =>
    (modules ?? []).filter((m) => m.slug).map((m) => ({
      url: `${SITE_URL}/${locale}/proposal/${m.slug}`,
      lastModified: m.date_updated || m.date_created || new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    }))
  );

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/fr`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/en`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...pageUrls,
    ...expertiseUrls,
    ...blogUrls,
    ...caseUrls,
  ];
}
