import { NextResponse } from 'next/server';
import { getCorePageSlugs } from '@lib/core-pages';
import { env } from '@lib/env';

export async function GET() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const slugs = await getCorePageSlugs().catch(() => []);

  const urls = slugs
    .map(
      (slug) =>
        `<url><loc>${siteUrl}/core-pages/${slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/core-pages</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
