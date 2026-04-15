import { getCachedPageContent, getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import { assetUrl } from "@/lib/utils/assets";
import SectionRenderer from "@/lib/controllers/renderer";
import { generatePageSeo } from "@/lib/seo/seo-utils";
import { generateWebPageJsonLd } from "@/lib/seo/jsonld-utils";
import Script from "next/script";
import { notFound } from "next/navigation";
import HeaderLayout from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TopMenu from "@/components/menus/top-menu";

export const generateMetadata = async ({ params }) => {
  const { locale, slug } = await params;
  const [settings, page] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPageContent(slug[0].toString()),
  ]);

  if (!page) return {};

  return generatePageSeo({ page, settings, locale });
};

export default async function Page({ params }) {
  const { slug } = await params;
  const [settings, topmenu, page] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getCachedPageContent(slug[0].toString()),
  ]);

  if (!page) notFound();

  const jsonLd = await generateWebPageJsonLd({
    page,
    settings,
    pathname: `/${slug}`,
  });

  const heroImage = assetUrl(page.image);

  return (
    <main>
      <TopMenu items={topmenu} logo={settings.logo} name={settings.site_name} linkedinUrl={settings.linkedin_url} />

      <HeaderLayout title={page.title} subtitle={page.subtitle} image={heroImage} home={false} />
      {/* HERO */}

      {/* SECTIONS */}
      {page.sections
        ?.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        .map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      <Footer />

      {/* JSON-LD */}
      {jsonLd && (
        <Script
          id="page-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </main>
  );
}
