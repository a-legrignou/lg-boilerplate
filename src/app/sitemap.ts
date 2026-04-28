import type { MetadataRoute } from "next";
import { payload } from "@/lib/payload";
import {
  LOCALES,
  DEFAULT_LOCALE,
  localizedPath,
  type Locale,
} from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type SlugDoc = {
  slug?: string | null;
  updatedAt?: string | null;
  noindex?: boolean | null;
};

async function fetchPerLocale(
  collection: "pages" | "posts",
): Promise<Record<Locale, SlugDoc[]>> {
  const client = await payload();
  const out = {} as Record<Locale, SlugDoc[]>;
  for (const locale of LOCALES) {
    const result = await client.find({
      collection,
      where: {
        and: [
          { _status: { equals: "published" } },
          {
            or: [
              { noindex: { not_equals: true } },
              { noindex: { exists: false } },
            ],
          },
        ],
      },
      locale,
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true, noindex: true },
    });
    out[locale] = result.docs as SlugDoc[];
  }
  return out;
}

function pathFor(collection: "pages" | "posts", slug: string): string {
  if (collection === "pages") return slug === "home" ? "/" : `/${slug}`;
  return `/blog/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts] = await Promise.all([
    fetchPerLocale("pages"),
    fetchPerLocale("posts"),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const collection of ["pages", "posts"] as const) {
    const byLocale = collection === "pages" ? pages : posts;
    const seen = new Map<
      string,
      { lastModified: Date; alternates: Record<string, string> }
    >();

    for (const locale of LOCALES) {
      for (const doc of byLocale[locale]) {
        if (!doc.slug) continue;
        const neutralPath = pathFor(collection, doc.slug);
        const fallbackKey =
          locale === DEFAULT_LOCALE ? neutralPath : `${locale}:${neutralPath}`;
        const existing = seen.get(fallbackKey) ?? {
          lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
          alternates: {} as Record<string, string>,
        };
        existing.alternates[locale] =
          `${SITE_URL}${localizedPath(neutralPath, locale)}`;
        if (doc.updatedAt) {
          const d = new Date(doc.updatedAt);
          if (d > existing.lastModified) existing.lastModified = d;
        }
        seen.set(fallbackKey, existing);
      }
    }

    for (const [key, value] of seen) {
      const isDefaultKey = !key.includes(":");
      const url = isDefaultKey
        ? (value.alternates[DEFAULT_LOCALE] ??
          value.alternates[LOCALES.find((l) => value.alternates[l])!])
        : value.alternates[key.split(":")[0] as Locale];
      entries.push({
        url,
        lastModified: value.lastModified,
        alternates: { languages: value.alternates },
      });
    }
  }

  return entries;
}
