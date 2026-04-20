import { NextResponse } from 'next/server';
import { getBlogArticleSlugs } from '@lib/blog';
import { siteConfig } from '@lib/config';

export async function GET() {
  const slugs = await getBlogArticleSlugs();
  const urls = slugs
    .map((slug) => {
      return `<url><loc>${siteConfig.url}/blog/${slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${siteConfig.url}/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
    ${urls}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
