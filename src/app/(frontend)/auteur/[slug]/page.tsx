import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getPostsByAuthor, getSiteData } from "@/lib/payload";
import { JsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, personSchema } from "@/lib/structured-data";
import { localizedPath } from "@/lib/i18n";
import type { Media } from "@/payload-types";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [author, { settings, seo }] = await Promise.all([
    getAuthorBySlug(slug),
    getSiteData("fr"),
  ]);
  if (!author) return {};
  return buildMetadata({
    doc: {
      title: author.name || author.email,
      meta: { description: author.bio || "" },
    },
    path: `/auteur/${slug}`,
    locale: "fr",
    settings,
    seo,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();
  const { docs: posts } = await getPostsByAuthor(author.id, "fr", 50);
  const avatar = (author.avatar as Media | undefined)?.url;

  return (
    <main className="container mx-auto max-w-4xl px-6 py-16">
      <JsonLd
        data={[
          personSchema(author, "fr"),
          breadcrumbSchema(
            [
              { label: "Accueil", path: "/" },
              { label: "Auteurs", path: "/blog" },
              { label: author.name || author.email, path: `/auteur/${slug}` },
            ],
            "fr",
          ),
        ]}
      />

      <header className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:gap-6 md:text-left">
        {avatar ? (
          <Image
            src={avatar}
            alt={author.name || author.email}
            width={96}
            height={96}
            className="size-24 rounded-full object-cover"
          />
        ) : (
          <div className="size-24 rounded-full bg-muted" />
        )}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {author.name || author.email}
          </h1>
          {author.bio ? (
            <p className="mt-3 max-w-xl text-muted-foreground">{author.bio}</p>
          ) : null}
          {(author.socials?.website ||
            author.socials?.twitter ||
            author.socials?.linkedin ||
            author.socials?.github) && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {author.socials?.website ? (
                <Link
                  href={author.socials.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Site
                </Link>
              ) : null}
              {author.socials?.twitter ? (
                <Link
                  href={`https://twitter.com/${author.socials.twitter.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </Link>
              ) : null}
              {author.socials?.linkedin ? (
                <Link
                  href={`https://www.linkedin.com/in/${author.socials.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  LinkedIn
                </Link>
              ) : null}
              {author.socials?.github ? (
                <Link
                  href={`https://github.com/${author.socials.github.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Articles</h2>
        {posts.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Aucun article publié pour le moment.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} locale="fr" />
            ))}
          </div>
        )}
      </section>

      <div className="mt-12 text-sm">
        <Link
          href={localizedPath("/blog", "fr")}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Retour au blog
        </Link>
      </div>
    </main>
  );
}
