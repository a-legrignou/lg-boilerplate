import { getCachedPageContent, getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import { assetUrl } from "@/lib/utils/assets";
import SectionRenderer from "@/lib/controllers/renderer";
import { generatePageSeo } from "@/lib/seo/seo-utils";
import { generateWebPageJsonLd, generateOrganizationJsonLd } from "@/lib/seo/jsonld-utils";
import Script from "next/script";
import { notFound } from "next/navigation";
import HeaderLayout from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TopMenu from "@/components/menus/top-menu";


export const generateMetadata = async ({ params }) => {
  const { locale } = await params;
  const [settings, page] = await Promise.all([getCachedSiteSettings(), getCachedPageContent("home")]);

  if (!page) return {};

  return generatePageSeo({ page, settings, locale });
};

export default async function Page({ params }) {
  const { locale } = await params;
  const [settings, topmenu, page] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getCachedPageContent("home"),
  ]);

  if (!page) notFound();

  const jsonLd = generateWebPageJsonLd({ page, settings, pathname: `/${locale}` });
  const orgJsonLd = generateOrganizationJsonLd(settings);

  const lightImageUrl = assetUrl(page.image);

  return (
    <main>
      <TopMenu items={topmenu} logo={settings.logo} name={settings.site_name} linkedinUrl={settings.linkedin_url} />

      <HeaderLayout
        title={page.title}
        subtitle={page.description}
        image={lightImageUrl}
        actions={(page.cta ?? [])
          .map((a, i) => ({
            label:   a?.label ?? a?.text ?? a?.title ?? "",
            href:    a?.path  ?? a?.href ?? a?.url   ?? a?.link ?? "",
            variant: i === 0 ? "outline" : "filled",
          }))
          .filter((a) => a.href)}
        home={true}
      />
      {page.sections
        ?.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        .map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}

      <Footer />

      {jsonLd && (
        <Script id="homepage-webpage" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {orgJsonLd && (
        <Script id="homepage-org" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      )}
    </main>
  );
}
