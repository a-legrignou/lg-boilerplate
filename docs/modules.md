# Modules métier

Chaque module est indépendant, activable/désactivable via variables d'environnement, avec ses propres collections Directus, routes Next.js et schémas de migration.

---

## Structure d'un module

```
modules/<nom>/
├── README.md              # Documentation du module
├── schema/
│   └── collections/       # Définitions YAML des collections Directus
├── migrations/
│   └── 0001-init.sql      # SQL d'initialisation (PostgreSQL)
```

Les routes Next.js du module vivent dans `apps/web/src/app/<nom>/`.
La logique de data fetching vit dans `packages/lib/src/<nom>.ts`.

---

## Activer un module

### 1. Variables d'environnement

Dans `.env` (ou les env vars Dokploy) :

```env
NEXT_PUBLIC_ENABLE_<NOM>=true
```

| Module     | Variable                        |
| ---------- | ------------------------------- |
| core-pages | `NEXT_PUBLIC_ENABLE_CORE_PAGES` |
| blog       | `NEXT_PUBLIC_ENABLE_BLOG`       |
| products   | `NEXT_PUBLIC_ENABLE_PRODUCTS`   |
| auth       | `NEXT_PUBLIC_ENABLE_AUTH`       |
| admin      | `NEXT_PUBLIC_ENABLE_ADMIN`      |

### 2. Appliquer le schéma Directus

```bash
# Applique l'intégralité du snapshot (toutes collections)
npx directus schema apply apps/directus/snapshots/initial-schema.yml --yes

# Ou en dev local via Docker Compose
docker compose exec directus npx directus schema apply /directus/extensions/snapshots/initial-schema.yml --yes
```

### 3. Redémarrer le serveur Next.js

Les flags `NEXT_PUBLIC_*` sont lus au build. En dev, `pnpm dev` suffit.

---

## Désactiver un module

Passe la variable à `false` et redémarre. Les routes du module retournent `notFound()` automatiquement (le flag est vérifié dans chaque `page.tsx`).

Le schéma Directus et les données ne sont **pas supprimés** — le module est juste invisible côté front.

---

## Modules disponibles

### `core-pages`

Pages CMS éditables depuis Directus. Supporte un page builder simple (blocs Hero, Text, Feature Grid).

- Route : `/[slug]` (pages dynamiques)
- Collections : `pages`, `page_blocks`
- SEO : metadata dynamique, sitemap, OG image

### `blog`

Articles, auteurs, catégories, tags avec SEO complet.

- Routes : `/blog`, `/blog/[slug]`, `/blog/rss`, `/blog/sitemap`
- Collections : `articles`, `authors`, `categories`, `tags`
- SEO : JSON-LD Article, OG image, sitemap dédié, RSS

### `products`

Catalogue produit avec variantes (sans paiement — structure prête pour Stripe).

- Routes : `/products`, `/products/[slug]`, `/products/sitemap`
- Collections : `products`, `product_variants`, `product_images`, `product_categories`
- SEO : JSON-LD Product, schema.org, sitemap

### `auth`

Authentification complète déléguée à Directus.

- Routes : `/auth` (login), `/account` (espace personnel)
- API : `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/refresh`
- Collection : `user_preferences`
- Cookies : `ds_access` (httpOnly), `ds_refresh` (httpOnly), `ds_role`

### `admin`

Dashboard d'administration accessible aux utilisateurs avec le rôle `admin`.

- Routes : `/admin/*`
- API : `/api/health`
- Collection : `monitoring_events`
- Protection : middleware Next.js vérifie `ds_role=admin`

---

## Créer un nouveau module

1. **Crée le dossier** `modules/<mon-module>/`
2. **Ajoute** `README.md`, `schema/collections/*.yml`, `migrations/0001-init.sql`
3. **Ajoute** la variable dans `packages/lib/src/modules.ts` et `packages/lib/src/env.ts`
4. **Crée** les routes dans `apps/web/src/app/<mon-module>/`
5. **Crée** le data fetcher dans `packages/lib/src/<mon-module>.ts`
6. **Mets à jour** `apps/directus/snapshots/initial-schema.yml` avec les nouvelles collections
7. **Documente** dans ce fichier

---

## Invalidation de cache (ISR)

Chaque module peut déclencher une revalidation du cache Next.js depuis Directus via un flow :

```
Directus Flow → POST /api/revalidate
  Body: { "secret": "<NEXT_REVALIDATE_TOKEN>", "tags": ["blog", "blog-slug-xxx"] }
```

Les tags de revalidation sont définis dans chaque `fetch()` avec `next: { tags: ['...'] }`.
