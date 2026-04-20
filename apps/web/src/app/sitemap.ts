import type { MetadataRoute } from 'next';
import { env } from '@lib/env';
import { moduleFlags } from '@lib/modules';

/**
 * Root sitemap — lists the homepage and delegates to module-level sitemaps.
 * Each enabled module exposes its own sitemap at /<module>/sitemap.
 * Google supports sitemap index via the `sitemap` type in Next.js 16.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  if (moduleFlags.blog) {
    entries.push({
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  if (moduleFlags.products) {
    entries.push({
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  if (moduleFlags.corePages) {
    entries.push({
      url: `${siteUrl}/core-pages`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return entries;
}
