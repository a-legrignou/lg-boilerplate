import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlug } from '@lib/products';

import { generateProductJsonLd } from './json-ld';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) return { title: 'Produit introuvable' };

  const imageUrl = product.cover_image
    ? `${process.env.DIRECTUS_PUBLIC_URL}/assets/${product.cover_image}`
    : undefined;

  return {
    title: product.name,
    description: product.description ?? `Découvrez ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description ?? '',
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) notFound();

  const jsonLd = generateProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl space-y-10">
        <Link
          href="/products"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Retour au catalogue
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {product.cover_image && (
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={`${process.env.DIRECTUS_PUBLIC_URL}/assets/${product.cover_image}`}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                {product.name}
              </h1>
              {product.categories && product.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="text-sm text-slate-400 hover:text-white"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <p className="text-3xl font-bold text-sky-400">
              €{product.price.toFixed(2)}
            </p>

            {product.description && (
              <p className="leading-relaxed text-slate-300">
                {product.description}
              </p>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Variantes</h2>
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {variant.sku}
                      </p>
                      {variant.options && (
                        <p className="text-xs text-slate-400">
                          {Object.entries(
                            variant.options as Record<string, string>
                          )
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        €{variant.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Stock : {variant.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
