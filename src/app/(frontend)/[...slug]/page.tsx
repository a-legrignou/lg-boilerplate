import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { getPage, getAllPageSlugs, getSiteData } from "@/lib/payload";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { JsonLd } from "@/components/JsonLd";
import { LiveEditBanner } from "@/components/LiveEditOverlay";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchema } from "@/lib/structured-data";

type Params = { slug: string[] };

export async function generateStaticParams() {
  const docs = await getAllPageSlugs("fr");
  return docs
    .filter((d) => d.slug && d.slug !== "home")
    .map((d) => ({ slug: d.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [page, { settings, seo }] = await Promise.all([
    getPage(slug.join("/"), "fr"),
    getSiteData("fr"),
  ]);
  if (!page) return {};
  return buildMetadata({
    doc: page,
    path: `/${slug.join("/")}`,
    locale: "fr",
    settings,
    seo,
  });
}

export default async function CmsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { isEnabled: draft } = await draftMode();
  const page = await getPage(slug.join("/"), "fr", { draft });
  if (!page) notFound();

  const segments = slug;
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    ...segments.map((seg, i) => ({
      label: seg.replace(/-/g, " "),
      path: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={[pageSchema(page, "fr"), breadcrumbSchema(breadcrumbItems, "fr")]}
      />
      {page.customCss ? (
        <style dangerouslySetInnerHTML={{ __html: page.customCss }} />
      ) : null}
      <RenderBlocks
        blocks={page.layout}
        locale="fr"
        pageId={page.id}
        editable={draft}
      />
      {draft ? <LiveEditBanner pageId={page.id} /> : null}
    </main>
  );
}
