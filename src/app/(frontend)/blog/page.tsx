import type { Metadata } from "next";
import { getAllPosts, getSiteData } from "@/lib/payload";
import { PostCard } from "@/components/PostCard";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { settings, seo } = await getSiteData("fr");
  return buildMetadata({
    doc: {
      title: "Blog",
      meta: { description: settings?.siteDescription || "Latest articles." },
    },
    path: "/blog",
    locale: "fr",
    settings,
    seo,
  });
}

export default async function BlogIndex() {
  const { docs } = await getAllPosts("fr");
  return (
    <main className="container mx-auto max-w-5xl px-6 py-16">
      <JsonLd
        data={breadcrumbSchema(
          [
            { label: "Home", path: "/" },
            { label: "Blog", path: "/blog" },
          ],
          "fr",
        )}
      />
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      {docs.length === 0 ? (
        <p className="mt-8 text-muted-foreground">
          Aucun article pour le moment.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((post) => (
            <PostCard key={post.id} post={post} locale="fr" />
          ))}
        </div>
      )}
    </main>
  );
}
