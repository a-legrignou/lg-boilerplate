import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogArticleBySlug, getBlogArticleSlugs } from '@lib/blog';
import { getMetadata } from '@lib/seo';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getBlogArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const article = await getBlogArticleBySlug(params.slug);
  if (!article) {
    return { title: 'Article introuvable' };
  }

  return getMetadata({
    title: article.seo_title ?? article.title,
    description:
      article.seo_description ??
      article.excerpt ??
      'Article de blog publié via Directus.',
    image: article.cover_image?.url,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  if (process.env.NEXT_PUBLIC_ENABLE_BLOG !== 'true') {
    notFound();
  }

  const article = await getBlogArticleBySlug(params.slug);
  if (!article) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seo_description ?? article.excerpt,
    image: article.cover_image?.url ? [article.cover_image.url] : undefined,
    author: article.author
      ? {
          '@type': 'Person',
          name: `${article.author.first_name} ${article.author.last_name}`,
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/author/${article.author.slug}`,
        }
      : undefined,
    datePublished: article.published_at,
    dateModified: article.published_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`,
    },
    keywords: article.tags?.join(', '),
  };

  return (
    <article className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="text-sm uppercase tracking-[0.4em] text-slate-400 hover:text-white"
      >
        ← Retour au blog
      </Link>

      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.4em] text-sky-400">
          Article de blog
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-white">
          {article.title}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-slate-400">
          <span>
            {new Date(article.published_at ?? '').toLocaleDateString()}
          </span>
          <span>•</span>
          <span>{article.reading_time ?? '—'} min de lecture</span>
          {article.author ? (
            <span>
              • {article.author.first_name} {article.author.last_name}
            </span>
          ) : null}
        </div>
        <p className="max-w-3xl text-slate-300">{article.excerpt}</p>
      </header>

      {article.cover_image?.url ? (
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <Image
            src={article.cover_image.url}
            alt={article.cover_image.title ?? article.title}
            width={1200}
            height={630}
            className="w-full object-cover"
          />
        </div>
      ) : null}

      <section className="space-y-8 text-slate-200">
        <pre className="whitespace-pre-wrap rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-200">
          {JSON.stringify(
            article.content ?? { message: 'Contenu non structuré' },
            null,
            2
          )}
        </pre>
      </section>

      <footer className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-400">
        Tags : {(article.tags ?? []).join(', ') || 'Aucun tag'}
      </footer>
    </article>
  );
}
