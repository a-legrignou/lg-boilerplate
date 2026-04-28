import type { Metadata } from "next";
import type { Media, Seo, Setting } from "@/payload-types";
import { DEFAULT_LOCALE, LOCALES, localizedPath, type Locale } from "./i18n";

type SeoMeta = {
  title?: string | null;
  description?: string | null;
  image?: (number | Media | null) | undefined;
};

type DocWithMeta = {
  title?: string | null;
  meta?: SeoMeta | null;
  noindex?: boolean | null;
  canonical?: string | null;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const mediaToOg = (m: number | Media | null | undefined) => {
  if (!m || typeof m !== "object" || !m.url) return null;
  return {
    url: m.url,
    width: m.width ?? undefined,
    height: m.height ?? undefined,
    alt: m.alt ?? "",
  };
};

const applyTitleTemplate = (
  template: string | null | undefined,
  title: string,
  siteName: string,
): string => {
  if (!template) return title;
  return template.replace(/%s/g, title).replace(/%siteName%/g, siteName);
};

/**
 * Build Next.js Metadata from a Payload doc + path + locale.
 * Path should be the canonical path *for that locale* (e.g. "/about" or "/en/about").
 */
export function buildMetadata({
  doc,
  path,
  locale,
  settings,
  seo,
}: {
  doc: DocWithMeta;
  path: string;
  locale: Locale;
  settings?: Setting | null;
  seo?: Seo | null;
}): Metadata {
  const meta = doc.meta ?? {};
  const rawTitle = meta.title || doc.title || "";
  const description = meta.description || settings?.siteDescription || "";
  const siteName = settings?.siteName || "";
  const title =
    rawTitle && seo?.titleTemplate
      ? applyTitleTemplate(seo.titleTemplate, rawTitle, siteName)
      : rawTitle;

  const docOg = mediaToOg(meta.image);
  const fallbackOg = mediaToOg(seo?.defaultOgImage);
  const dynamicOg = rawTitle
    ? {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent(rawTitle)}`,
        width: 1200,
        height: 630,
        alt: rawTitle,
      }
    : null;
  const ogImage = docOg ?? fallbackOg ?? dynamicOg;

  const neutral =
    locale === DEFAULT_LOCALE
      ? path
      : path.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  const computedCanonical = `${SITE_URL}${localizedPath(neutral, locale)}`;
  const canonical = doc.canonical || computedCanonical;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}${localizedPath(neutral, l)}`;
  }
  languages["x-default"] =
    `${SITE_URL}${localizedPath(neutral, DEFAULT_LOCALE)}`;

  const twitterHandle = seo?.social?.twitter?.replace(/^@/, "");

  const v = seo?.verifications;
  const verificationOther: Record<string, string> = {};
  if (v?.bing) verificationOther["msvalidate.01"] = v.bing;
  if (v?.pinterest) verificationOther["p:domain_verify"] = v.pinterest;
  const verification =
    v && (v.google || v.yandex || Object.keys(verificationOther).length)
      ? {
          ...(v.google ? { google: v.google } : {}),
          ...(v.yandex ? { yandex: v.yandex } : {}),
          ...(Object.keys(verificationOther).length
            ? { other: verificationOther }
            : {}),
        }
      : null;

  return {
    title,
    description,
    ...(doc.noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical, languages },
    openGraph: {
      title: rawTitle,
      description,
      url: canonical,
      siteName: siteName || undefined,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: rawTitle,
      description,
      images: ogImage ? [ogImage.url] : undefined,
      ...(twitterHandle
        ? { site: `@${twitterHandle}`, creator: `@${twitterHandle}` }
        : {}),
    },
    ...(verification ? { verification } : {}),
  };
}
