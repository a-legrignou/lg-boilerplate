import type { Metadata } from "next";
import { getAllPosts, getSiteData } from "@/lib/payload";
import { PostCard } from "@/components/PostCard";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { settings, seo } = await getSiteData("en");
  return buildMetadata({
    doc: {
      title: "Blog",
      meta: { description: settings?.siteDescription || "Latest articles." },
    },
    path: "/en/blog",
    locale: "en",
    settings,
    seo,
  });
}

export default async function BlogIndexEn() {
  const { docs } = await getAllPosts("en");
  return (
    <main className="container mx-auto max-w-5xl px-6 py-16">
      <JsonLd
        data={breadcrumbSchema(
          [
            { label: "Home", path: "/" },
            { label: "Blog", path: "/blog" },
          ],
          "en",
        )}
      />
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      {docs.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No articles yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((post) => (
            <PostCard key={post.id} post={post} locale="en" />
          ))}
        </div>
      )}
    </main>
  );
}
