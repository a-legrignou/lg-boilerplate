import { getCachedPageContent, getCachedSiteSettings, getCachedTopMenu, getCachedAllModules } from "@/lib/models";
import { assetUrl } from "@/lib/utils/assets";
import { generatePageSeo } from "@/lib/seo/seo-utils";
import { generateWebPageJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld-utils";
import Breadcrumb from "@/components/widgets/breadcrumb";
import Script from "next/script";
import { notFound } from "next/navigation";
import HeaderLayout from "@/components/layout/header";
import TopMenu from "@/components/menus/top-menu";
import Footer from "@/components/layout/footer";
import ModuleCard from "@/components/cards/product-card";
import SectionRenderer from "@/lib/controllers/renderer";

export const generateMetadata = async ({ params }) => {
  const { locale } = await params;
  const [settings, page] = await Promise.all([getCachedSiteSettings(), getCachedPageContent("proposal")]);
  if (!page) return {};
  return generatePageSeo({ page, settings, locale });
};

export default async function ProposalPage({ params }) {
  const { locale } = await params;

  const [settings, topmenu, page, modules] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getCachedPageContent("proposal"),
    getCachedAllModules(),
  ]);

  if (!page) notFound();

  const heroImage = assetUrl(page.image);

  const webPageJsonLd = generateWebPageJsonLd({ page, settings, pathname: `/${locale}/proposal` });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      { name: "Accueil", path: `/${locale}` },
      { name: "Nos offres", path: `/${locale}/proposal` },
    ],
    settings,
  );

  return (
    <main>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />

      <HeaderLayout title={page.title} subtitle={page.subtitle} image={heroImage} home={false} />

      <Breadcrumb items={[{ name: "Accueil", path: `/${locale}` }, { name: "Nos offres" }]} />

      {page.sections
        ?.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        .map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}

      <Footer locale={locale} />

      <Script
        id="proposal-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <Script
        id="proposal-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
