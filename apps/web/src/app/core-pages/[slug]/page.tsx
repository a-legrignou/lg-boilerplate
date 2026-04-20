import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCorePageBySlug, getCorePageSlugs } from '@lib/core-pages';
import { getMetadata } from '@lib/seo';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getCorePageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const page = await getCorePageBySlug(params.slug);
  if (!page) {
    return {
      title: 'Page introuvable',
    };
  }

  return getMetadata({
    title: page.seo_title ?? page.title,
    description: page.seo_description ?? 'Page éditée depuis Directus.',
    image: page.og_image?.url,
  });
}

export default async function CorePageDetail({ params }: Props) {
  if (process.env.NEXT_PUBLIC_ENABLE_CORE_PAGES !== 'true') {
    notFound();
  }

  const page = await getCorePageBySlug(params.slug);
  if (!page) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.seo_title ?? page.title,
    description: page.seo_description ?? '',
    url: `${siteUrl}/core-pages/${page.slug}`,
    dateModified: page.updated_at ?? page.publish_date,
    ...(page.og_image?.url && { image: page.og_image.url }),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.title,
          item: `${siteUrl}/core-pages/${page.slug}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="space-y-8">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-sky-400">
            Core page
          </p>
          <h1 className="text-4xl font-semibold text-white">{page.title}</h1>
          <p className="max-w-3xl text-slate-300">
            {page.seo_description ?? 'Aucune description fournie.'}
          </p>
        </header>

        {page.og_image?.url ? (
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={page.og_image.url}
              alt={page.og_image.title ?? page.title}
              width={1200}
              height={630}
              className="w-full object-cover"
            />
          </div>
        ) : null}

        <section className="space-y-6 text-slate-200">
          {Array.isArray(page.content) && page.content.length > 0 ? (
            page.content.map((block) => (
              <div
                key={block.id}
                className="rounded-3xl border border-white/10 bg-slate-900/80 p-6"
              >
                <h2 className="text-xl font-semibold text-white">
                  {block.block_type}
                </h2>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm text-slate-300">
                  {JSON.stringify(block.content, null, 2)}
                </pre>
              </div>
            ))
          ) : (
            <p className="text-slate-300">
              Aucun contenu structuré défini pour cette page.
            </p>
          )}
        </section>

        <footer className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-400">
          Mis à jour le {page.updated_at ?? page.publish_date ?? 'inconnu'}
        </footer>
      </article>
    </>
  );
}
