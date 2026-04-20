# Checklist SEO par type de page

---

## Règles globales (toutes pages)

- [ ] `generateMetadata()` retourne `title`, `description`, `canonical`
- [ ] `<html lang="fr">` (ou code langue correct) défini dans `layout.tsx`
- [ ] `robots.txt` servi par `/app/robots.ts` (bloque les routes admin/auth en prod)
- [ ] Images via `next/image` avec `alt` renseigné
- [ ] Fonts via `next/font` (auto-hébergées, no FOUT, `display: swap`)
- [ ] Aucune fuite de clés dans le HTML côté client

---

## Pages statiques / core-pages

```tsx
// apps/web/src/app/core-pages/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  return {
    title: page.seo_title ?? page.title,
    description: page.seo_description,
    alternates: { canonical: `${env.NEXT_PUBLIC_SITE_URL}/${page.slug}` },
    openGraph: {
      title: page.seo_title ?? page.title,
      description: page.seo_description ?? '',
      url: `${env.NEXT_PUBLIC_SITE_URL}/${page.slug}`,
      images: page.og_image ? [{ url: directusImageUrl(page.og_image) }] : [],
    },
  };
}
```

- [ ] `title` / `description` / `canonical`
- [ ] Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)
- [ ] JSON-LD `WebPage` ou `BreadcrumbList`
- [ ] Dans le sitemap (`/sitemap.xml`)

---

## Articles de blog

```tsx
// JSON-LD Article
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "datePublished": article.published_at,
  "author": { "@type": "Person", "name": article.author.first_name },
  "image": directusImageUrl(article.cover_image),
  "url": `${siteUrl}/blog/${article.slug}`
}
```

- [ ] `title` = titre article (≤ 60 chars)
- [ ] `description` = excerpt (≤ 155 chars)
- [ ] `canonical` vers l'URL canonique
- [ ] Open Graph `article:published_time`, `article:author`
- [ ] JSON-LD `Article`
- [ ] `twitter:card = summary_large_image`
- [ ] Dans `/blog/sitemap` (sitemap dédié inclus dans sitemap index)
- [ ] RSS feed (`/blog/rss`)
- [ ] `reading_time` affiché dans la page
- [ ] Balises `h1-h6` sémantiques dans le contenu
- [ ] Images avec `alt`

---

## Fiches produit

```tsx
// JSON-LD Product
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": directusImageUrl(product.cover_image),
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
```

- [ ] `title` = nom produit
- [ ] `description` = description courte (≤ 155 chars)
- [ ] `canonical`
- [ ] Open Graph avec image produit
- [ ] JSON-LD `Product` avec `Offer`
- [ ] Dans `/products/sitemap`
- [ ] `lastmod` dans le sitemap = `updated_at` Directus

---

## Pages d'authentification (`/auth`, `/account`)

- [ ] `<meta name="robots" content="noindex, nofollow">` — ne pas indexer
- [ ] Pas dans les sitemaps

```tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

---

## Pages admin (`/admin/*`)

- [ ] Exclues via `robots.txt` : `Disallow: /admin`
- [ ] `noindex, nofollow` dans les metadata
- [ ] Protégées par middleware (non accessibles sans authentification)

---

## Sitemap index

Le sitemap racine `/sitemap.xml` agrège les sitemaps modules :

```
/sitemap.xml          → index (liste les sitemaps modules)
/core-pages/sitemap   → pages CMS
/blog/sitemap         → articles
/products/sitemap     → produits
```

Implémentation dans `apps/web/src/app/sitemap.ts` :

```tsx
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/core-pages/sitemap` },
    { url: `${siteUrl}/blog/sitemap` },
    { url: `${siteUrl}/products/sitemap` },
  ];
}
```

---

## `robots.txt` dynamique

```tsx
// apps/web/src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    rules: isProduction
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/auth', '/api/'] }]
      : [{ userAgent: '*', disallow: '/' }], // Bloque tout en staging
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

---

## OG Images dynamiques

Chaque module peut générer une OG image depuis `opengraph-image.tsx` :

```tsx
// apps/web/src/app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export default async function Image({ params }) {
  const article = await getBlogArticleBySlug(params.slug);
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        background: '#0f172a',
        width: '100%',
        height: '100%',
      }}
    >
      <h1 style={{ color: 'white', fontSize: 48 }}>{article.title}</h1>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

---

## Core Web Vitals — bonnes pratiques

| Métrique | Cible   | Action                                         |
| -------- | ------- | ---------------------------------------------- |
| LCP      | < 2.5s  | `priority` sur l'image hero, preload fonts     |
| CLS      | < 0.1   | Dimensions explicites sur `next/image`         |
| INP      | < 200ms | Éviter les lourds bundles client, préférer RSC |
| TTFB     | < 800ms | ISR/SSG, cache Directus, CDN assets            |

- Activer `output: 'standalone'` dans `next.config.mjs` pour les images Docker
- Utiliser `sizes` sur `next/image` pour les images responsive
- Fonts : `display: 'swap'` dans `next/font`
- Pas de `useEffect` pour du contenu visible above-the-fold
