import type { MetadataRoute } from 'next';
import { env } from '@lib/env';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    rules: isProduction
      ? [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api/', '/account'],
          },
        ]
      : [
          // Block all crawlers in non-production environments
          { userAgent: '*', disallow: '/' },
        ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
