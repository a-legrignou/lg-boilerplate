import { DarkModeProvider } from "@/lib/hooks/dark-mode";
import { CookieConsentProvider } from "@/lib/hooks/cookie-consent";
import { garamond } from "@/styles/fonts";
import "@/styles/global.css";
import "leaflet/dist/leaflet.css";
import Script from "next/script";
import { getCachedSiteSettings } from "@/lib/models";
import { Toaster } from "react-hot-toast";
import { generateGlobalSeo } from "@/lib/seo/seo-utils";
import { generateOrganizationJsonLd } from "@/lib/seo/jsonld-utils";
import GoogleAnalytics from "@/components/widgets/google-analytics";
import CookieBanner from "@/components/widgets/cookie-banner";
import ScrollToTop from "@/components/widgets/scroll-to-top";

/* ✅ VIEWPORT — OBLIGATOIRE POUR MOBILE */
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const generateMetadata = async () => {
  const settings = await getCachedSiteSettings();
  return generateGlobalSeo(settings);
};

export default async function RootLayout({ children }) {
  // ✅ fetch à l'intérieur de la fonction
  const settings = await getCachedSiteSettings();
  const orgJsonLd = generateOrganizationJsonLd(settings);
  const GA_ID = settings?.google_analytics_id || null;

  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className={`${garamond.className} bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        {/* JSON-LD */}
        {orgJsonLd && (
          <Script
            id="organization-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
          />
        )}

        {/* Lien d'évitement — permet aux utilisateurs clavier de sauter la navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:bg-navy focus:text-white focus:text-sm focus:font-medium focus:outline-none">
          Aller au contenu principal
        </a>

        <CookieConsentProvider>
          <DarkModeProvider>
            <GoogleAnalytics gaId={GA_ID} />
            <div id="main-content" tabIndex={-1} className="flex flex-col flex-1 outline-none">
              {children}
            </div>
            <CookieBanner />
            <ScrollToTop />
            <Toaster position="top-right" reverseOrder={false} />
          </DarkModeProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
