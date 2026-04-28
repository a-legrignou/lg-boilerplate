import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";

import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { brandToCss, brandFontImportUrl } from "@/lib/branding";
import { getSiteData, getSettings } from "@/lib/payload";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import {
  AnalyticsScripts,
  ConsentBanner,
} from "@/components/analytics/Consent";
import { WebVitals } from "@/components/analytics/WebVitals";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function localeFromPathname(pathname: string | null): Locale {
  if (!pathname) return DEFAULT_LOCALE;
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings(DEFAULT_LOCALE).catch(() => null);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings?.siteName || "Folio",
      template: `%s — ${settings?.siteName || "Folio"}`,
    },
    description: settings?.siteDescription || "",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname");
  const locale = localeFromPathname(pathname);

  const { brand, seo } = await getSiteData(locale);

  const css = brand ? brandToCss(brand) : "";
  const fontImportUrl = brand ? brandFontImportUrl(brand) : null;
  const plausibleDomain =
    seo?.analytics?.plausibleDomain || process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleScript =
    seo?.analytics?.plausibleScript || process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {fontImportUrl ? <link rel="stylesheet" href={fontImportUrl} /> : null}
        {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
        {seo?.social?.twitter ? (
          <meta
            name="twitter:site"
            content={`@${seo.social.twitter.replace(/^@/, "")}`}
          />
        ) : null}
      </head>
      <body style={{ fontFamily: "var(--brand-font, inherit)" }}>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
        <ConsentBanner />
        <AnalyticsScripts
          plausibleDomain={plausibleDomain}
          plausibleScript={plausibleScript}
        />
        <WebVitals />
      </body>
    </html>
  );
}
