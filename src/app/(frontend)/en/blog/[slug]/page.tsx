import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllPosts,
  getPost,
  getRelatedPosts,
  getSiteData,
} from "@/lib/payload";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { AuthorByline } from "@/components/AuthorByline";
import { RelatedPosts } from "@/components/RelatedPosts";
import { postStats } from "@/lib/post-stats";
import type { User } from "@/payload-types";

type Params = { slug: string };

export async function generateStaticParams() {
  const { docs } = await getAllPosts("en", 200);
  return docs.filter((d) => d.slug).map((d) => ({ slug: d.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, { settings, seo }] = await Promise.all([
    getPost(slug, "en"),
    getSiteData("en"),
  ]);
  if (!post) return {};
  return buildMetadata({
    doc: post,
    path: `/en/blog/${slug}`,
    locale: "en",
    settings,
    seo,
  });
}

export default async function BlogPostEn({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug, "en");
  if (!post) notFound();

  const related = await getRelatedPosts(post, "en", 3);
  const author =
    typeof post.author === "object" && post.author
      ? (post.author as User)
      : null;
  const stats = postStats(post.content, [post.title, post.excerpt ?? ""]);

  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <JsonLd
        data={[
          articleSchema(post, "en"),
          breadcrumbSchema(
            [
              { label: "Home", path: "/" },
              { label: "Blog", path: "/blog" },
              { label: post.title, path: `/blog/${slug}` },
            ],
            "en",
          ),
        ]}
      />

      <article>
        <header>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {author ? (
              <AuthorByline author={author} locale="en" date={post.createdAt} />
            ) : (
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            <span>·</span>
            <span>{stats.readingTimeMin} min read</span>
            {post.tags && post.tags.length ? (
              <>
                <span>·</span>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border bg-card px-2 py-0.5 text-xs"
                    >
                      #{t.tag}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </header>

        {post.content ? (
          <div className="prose prose-neutral mt-12 max-w-none dark:prose-invert">
            <RichTextRenderer data={post.content} />
          </div>
        ) : null}
      </article>

      <RelatedPosts posts={related} locale="en" />
    </main>
  );
}
