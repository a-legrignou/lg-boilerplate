import Link from 'next/link';
import { getCorePages } from '@lib/core-pages';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function CorePagesIndex() {
  if (process.env.NEXT_PUBLIC_ENABLE_CORE_PAGES !== 'true') {
    notFound();
  }

  const pages = await getCorePages();
  if (!pages.length) {
    return (
      <div className="space-y-4 text-slate-200">
        <h1 className="text-3xl font-semibold text-white">Pages CMS</h1>
        <p>Aucune page publiée n’a été trouvée.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.4em] text-sky-400">
          Core pages
        </p>
        <h1 className="text-4xl font-semibold text-white">
          Pages éditables depuis Directus
        </h1>
        <p className="max-w-2xl text-slate-300">
          Accédez aux pages CMS en direct depuis l’interface. Chaque page génère
          une métadonnée SEO et un chemin canonique.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {pages.map((page) => (
          <article
            key={page.id}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-sky-400/30"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-sky-300">
              Page
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {page.title}
            </h2>
            <p className="mt-4 text-slate-300">
              {page.seo_description ?? 'Aucune description SEO disponible.'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={`/core-pages/${page.slug}`}
                className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Voir la page
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
