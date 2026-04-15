import { getCachedCases, getCachedPageContent, getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import { generatePageSeo } from "@/lib/seo/seo-utils";
import { generateBreadcrumbJsonLd, generateWebPageJsonLd } from "@/lib/seo/jsonld-utils";
import { assetUrl } from "@/lib/utils/assets";
import GridReferences from "@/components/sections/grid-references";
import TopMenu from "@/components/menus/top-menu";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";
import HeaderLayout from "@/components/layout/header";
import Script from "next/script";
import Breadcrumb from "@/components/widgets/breadcrumb";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const [settings, page] = await Promise.all([getCachedSiteSettings(), getCachedPageContent("references")]);
  return generatePageSeo({ page: { ...page, slug: "references" }, settings, locale });
}

export default async function CasesPage({ params }) {
  const { locale } = await params;
  const [settings, topmenu, cases, page] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getCachedCases(),
    getCachedPageContent("references"),
  ]);

  if (!cases) notFound();

  const heroImage = page?.image ? assetUrl(page.image) : null;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      { name: "Accueil", path: `/${locale}` },
      { name: "Références", path: `/${locale}/references` },
    ],
    settings,
  );

  const webPageJsonLd = generateWebPageJsonLd({
    page,
    settings,
    pathname: `/${locale}/references`,
  });

  return (
    <main>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />

      <HeaderLayout title={page?.title ?? "Études de cas"} subtitle={page?.subtitle} image={heroImage} home={false} />

      <Breadcrumb
        className="max-w-6xl"
        items={[
          { name: "Accueil",    path: `/${locale}` },
          { name: "Références" },
        ]}
      />

      {cases.length === 0 ? (
        <p className="text-t2 text-center py-12">Aucune étude de cas disponible pour le moment.</p>
      ) : (
        <GridReferences cases={cases} />
      )}

      <Footer locale={locale} />

      <Script
        id="references-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="references-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
    </main>
  );
}
