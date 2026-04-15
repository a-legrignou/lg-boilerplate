import Script from "next/script";
import { after } from "next/server";
import { headers } from "next/headers";
import { getCachedPageContent, getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import { assetUrl } from "@/lib/utils/assets";
import { getPostContent, getRelatedPosts } from "@/lib/models/blog";
import { getSession, getUserTier, canAccessPost } from "@/lib/utils/auth";
import HeaderLayout from "@/components/layout/header";
import PostLayout from "@/components/layout/post";
import { generatePostSeo } from "@/lib/seo/seo-utils";
import { generatePostJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld-utils";
import Breadcrumb from "@/components/widgets/breadcrumb";
import { notFound } from "next/navigation";
import { trackPostView } from "@/lib/controllers/posts";
import Footer from "@/components/layout/footer";
import TopMenu from "@/components/menus/top-menu";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const [settings, post] = await Promise.all([getCachedSiteSettings(), getPostContent(id)]);

  if (!post) return {};

  // Les métadonnées sont toujours générées quelle que soit le tier —
  // Google doit pouvoir indexer titre, description et OG image même sur les articles payants.
  return generatePostSeo({ post, settings, locale });
}

export default async function Page({ params }) {
  const { locale, id: slug } = await params;

  // headers() must be called outside after() — Next.js restriction
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? headersList.get("x-real-ip") ?? "unknown";
  const userAgent = headersList.get("user-agent") ?? "";
  const referrer = headersList.get("referer") ?? "";

  const [page, post, settings, topmenu, user] = await Promise.all([
    getCachedPageContent("post"),
    getPostContent(slug),
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getSession(), // null if unauthenticated
  ]);

  if (!post || !page) notFound();

  // post.id = UUID réel — slug seul échouerait sur updateItem en production
  after(() => trackPostView(post.id, { ip, userAgent, referrer }));

  const userTier = getUserTier(user);
  const locked = !canAccessPost(userTier, post.tier);

  // Requête ciblée — évite de charger tous les articles (N+1)
  const relatedPosts = await getRelatedPosts(post.id, post.category?.id);

  // JSON-LD — always present for SEO.
  // For paywalled content, declare isAccessibleForFree per Google's guidelines:
  // https://developers.google.com/search/docs/crawling-indexing/structured-data/paywalled-content
  const baseJsonLd = generatePostJsonLd(post, settings, locale);
  const postJsonLd = post.tier
    ? {
        ...baseJsonLd,
        isAccessibleForFree: "False",
        hasPart: {
          "@type": "WebPageElement",
          isAccessibleForFree: "False",
          cssSelector: ".post-gated-content",
        },
      }
    : baseJsonLd;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      { name: "Accueil", path: `/${locale}` },
      { name: "Analyses", path: `/${locale}/blog` },
      { name: post.title, path: `/${locale}/blog/${post.slug || post.id}` },
    ],
    settings,
  );

  const heroImage = assetUrl(post.image);

  return (
    <>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />

      <main>
        <HeaderLayout title={post.title} subtitle={post.subtitle} image={heroImage} home={false} />
        <Breadcrumb
          items={[
            { name: "Accueil", path: `/${locale}` },
            { name: "Analyses", path: `/${locale}/blog` },
            { name: post.title },
          ]}
        />
        <PostLayout post={post} relatedPosts={relatedPosts} locked={locked} locale={locale} />
        <Footer locale={locale} />

        {postJsonLd && (
          <Script
            id="post-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
          />
        )}
        <Script
          id="post-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </main>
    </>
  );
}
