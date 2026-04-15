import { getCachedPageContent, getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import { getBlogPaginated } from "@/lib/models/blog";
import { assetUrl } from "@/lib/utils/assets";
import GridBlog from "@/components/sections/grid-blog";
import { generatePageSeo } from "@/lib/seo/seo-utils";
import { generateWebPageJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld-utils";
import Breadcrumb from "@/components/widgets/breadcrumb";
import { getSession, getUserTier } from "@/lib/utils/auth";
import Script from "next/script";
import { notFound } from "next/navigation";
import HeaderLayout from "@/components/layout/header";
import TopMenu from "@/components/menus/top-menu";
import Footer from "@/components/layout/footer";

export const generateMetadata = async ({ params }) => {
  const { locale } = await params;
  const [settings, page] = await Promise.all([
    getCachedSiteSettings(),
    getCachedPageContent("blog"),
  ]);
  if (!page) return {};
  return generatePageSeo({ page, settings, locale });
};

export default async function Page({ params, searchParams }) {
  const { locale } = await params;
  const { page: pageParam, tier: tierParam } = await searchParams;

  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));
  const currentTier = tierParam ?? "all";

  const [settings, topmenu, page, { posts, totalPages }, user] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getCachedPageContent("blog"),
    getBlogPaginated({ page: currentPage, tier: currentTier }),
    getSession(),
  ]);

  if (!page) notFound();

  const userTier   = getUserTier(user);
  const heroImage  = assetUrl(page.image);

  const webPageJsonLd    = generateWebPageJsonLd({ page, settings, pathname: `/${locale}/blog` });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      { name: "Accueil",  path: `/${locale}` },
      { name: "Analyses", path: `/${locale}/blog` },
    ],
    settings,
  );

  return (
    <main>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />

      <HeaderLayout title={page.title} subtitle={page.subtitle} image={heroImage} home={false} />

      <Breadcrumb
        className="max-w-6xl"
        items={[
          { name: "Accueil",  path: `/${locale}` },
          { name: "Analyses" },
        ]}
      />

      <GridBlog
        posts={posts}
        userTier={userTier}
        currentPage={currentPage}
        totalPages={totalPages}
        currentTier={currentTier}
      />

      <Footer locale={locale} />

      <Script
        id="blog-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <Script
        id="blog-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
