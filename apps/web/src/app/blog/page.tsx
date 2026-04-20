import Link from 'next/link';
import { getBlogArticles } from '@lib/blog';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function BlogPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_BLOG !== 'true') {
    notFound();
  }

  const articles = await getBlogArticles().catch(() => []);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.4em] text-sky-400">Blog</p>
        <h1 className="text-4xl font-semibold text-white">Articles récents</h1>
        <p className="max-w-3xl text-slate-300">
          Tous les articles publiés, indexés pour le SEO et exposés avec un RSS
          dédié.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-sky-400/30"
          >
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>
                {new Date(article.published_at ?? '').toLocaleDateString()}
              </span>
              <span>•</span>
              <span>{article.reading_time ?? '—'} min</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              {article.title}
            </h2>
            <p className="mt-4 text-slate-300">
              {article.excerpt ?? 'Pas de description fournie.'}
            </p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <Link
                href={`/blog/${article.slug}`}
                className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Lire l’article
              </Link>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {article.author?.first_name ?? 'Auteur inconnu'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
