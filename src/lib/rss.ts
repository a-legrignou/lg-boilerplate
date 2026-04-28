import "server-only";
import { getAllPosts, getSettings } from "./payload";
import { localizedPath, type Locale } from "./i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function buildRss(locale: Locale): Promise<string> {
  const [{ docs }, settings] = await Promise.all([
    getAllPosts(locale, 50),
    getSettings(locale).catch(() => null),
  ]);
  const siteName = settings?.siteName || "Folio";
  const siteDescription = settings?.siteDescription || "";
  const feedUrl = `${SITE_URL}${localizedPath("/rss.xml", locale)}`;
  const home = `${SITE_URL}${localizedPath("/", locale)}`;

  const items = docs
    .map((post) => {
      const url = `${SITE_URL}${localizedPath(`/blog/${post.slug}`, locale)}`;
      const pubDate = new Date(post.createdAt).toUTCString();
      const description = post.excerpt || post.meta?.description || "";
      return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description ? `<description>${escape(description)}</description>` : ""}
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteName)}</title>
    <link>${home}</link>
    <description>${escape(siteDescription)}</description>
    <language>${locale === "fr" ? "fr-FR" : "en-US"}</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;
}
