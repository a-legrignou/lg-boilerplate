import { getCachedPageContent, getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import { generatePageSeo } from "@/lib/seo/seo-utils";
import { generateWebPageJsonLd } from "@/lib/seo/jsonld-utils";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ContactLayout from "@/components/layout/contact";
import TopMenu from "@/components/menus/top-menu";

export const generateMetadata = async ({ params }) => {
  const { locale } = await params;
  const [settings, page] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPageContent("contact"),
  ]);

  if (!page) return {};

  return generatePageSeo({ page, settings, locale });
};

export default async function Page({ params }) {
  const { locale } = await params;

  const [settings, topmenu, page] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getCachedPageContent("contact"),
  ]);

  if (!page) notFound();

  // generateWebPageJsonLd est synchrone — pas d'await
  const webPageJsonLd = generateWebPageJsonLd({
    page,
    settings,
    pathname: `/${locale}/contact`,
  });

  return (
    <main>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />

      <Suspense>
        <ContactLayout section={page.sections?.[0]} />
      </Suspense>

      <Script
        id="contact-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
    </main>
  );
}
