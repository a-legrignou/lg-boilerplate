import { NextResponse } from 'next/server';
import { getBlogArticles } from '@lib/blog';
import { siteConfig } from '@lib/config';

export async function GET() {
  const articles = await getBlogArticles();
  const items = articles
    .map((article) => {
      const url = `${siteConfig.url}/blog/${article.slug}`;
      return `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${new Date(article.published_at ?? '').toUTCString()}</pubDate>
          <description><![CDATA[${article.excerpt ?? ''}]]></description>
        </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${siteConfig.name} RSS</title>
      <link>${siteConfig.url}/blog</link>
      <description>${siteConfig.description}</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
