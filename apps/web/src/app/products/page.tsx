import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProducts, getCategories } from '@lib/products';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our product catalog',
};

export const revalidate = 60;

export default async function ProductsPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_PRODUCTS !== 'true') {
    notFound();
  }

  const [products, categories] = await Promise.all([
    getProducts(20).catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.4em] text-sky-400">
          Catalogue
        </p>
        <h1 className="text-4xl font-semibold text-white">Nos produits</h1>
        <p className="max-w-3xl text-slate-300">
          Explorez notre gamme de produits.
        </p>
      </header>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-full border border-slate-700 px-4 py-1.5 text-sm text-slate-300 transition hover:border-sky-400/50 hover:text-white"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group rounded-3xl border border-white/10 bg-slate-900/80 p-5 transition hover:border-sky-400/30"
          >
            {product.cover_image && (
              <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={`${process.env.DIRECTUS_PUBLIC_URL}/assets/${product.cover_image}`}
                  alt={product.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
            )}
            <h2 className="text-base font-semibold text-white">
              {product.name}
            </h2>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                {product.description}
              </p>
            )}
            <p className="mt-3 text-lg font-bold text-sky-400">
              €{product.price.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-12 text-center text-slate-500">
          Aucun produit disponible.
        </p>
      )}
    </div>
  );
}
