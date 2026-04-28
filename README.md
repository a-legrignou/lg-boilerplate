# Folio

Boilerplate **Next.js 16 + Payload v3 + Better Auth + Postgres**, orienté **contenu** et **SEO**, **bilingue FR/EN** par défaut.

Pour démarrer un site B2B, un site marketing, ou une app à dominante contenu — sans réécrire pour la 12e fois le CMS, l'auth, l'i18n, les blocks, le sitemap et les redirects.

## Stack

| Couche               | Choix                                                                                |
| -------------------- | ------------------------------------------------------------------------------------ |
| **Framework**        | Next.js 16 (App Router, **webpack** dev — pas Turbopack à cause de Payload v3)       |
| **CMS**              | Payload v3 (code-first, MIT) — admin sur `/admin`, REST sur `/api/[collection]`      |
| **Auth (admin)**     | Payload `Users` (admin / editor / service via API key)                               |
| **Auth (app users)** | Better Auth (sessions, magic link, OAuth GitHub + Google)                            |
| **DB**               | Postgres 16 (Docker en local, port 5433)                                             |
| **UI**               | Tailwind v4 + shadcn/ui + dark mode                                                  |
| **i18n**             | FR par défaut sans préfixe (`/about`), EN avec préfixe (`/en/about`) — natif Payload |
| **Editor**           | Lexical (Payload v3) avec validation hiérarchie h1/h2/h3                             |
| **Emails**           | React Email + Resend (fallback console en dev)                                       |
| **Paywall**          | Stripe (subscriptions + webhook + customer portal)                                   |
| **AI**               | Traduction FR↔EN multi-provider (Anthropic + OpenAI)                                 |
| **Tests**            | Vitest (22 unit) + Playwright (9 E2E)                                                |
| **TypeScript**       | End-to-end, types Payload auto-générés                                               |

## Démarrage

### Premier setup d'un nouveau site

```bash
make init
```

Prompts interactifs : nom du site, email + mot de passe admin, scénario visuel. Crée le premier admin Payload, applique le preset Brand, écrit Settings.siteName.

### Daily dev

```bash
make dev
```

Postgres + migrations + Next.js sur http://localhost:3000.

## Ce qu'il y a dans la boîte

### 7 collections de contenu

| Collection    | Rôle                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------- |
| `Pages`       | Pages CMS avec layout en blocks (FR + EN, drafts, autosave)                              |
| `Posts`       | Articles de blog (tags, auteur, related posts, JSON-LD Article)                          |
| `Snippets`    | Blocks réutilisables (édite une fois, propage partout)                                   |
| `CaseStudies` | Études de cas — 4 sections imposées (contexte → challenge → approche → résultats) + KPIs |
| `Products`    | Produits / offres / services (1 onglet, métadonnées sidebar, taxonomie via tags)         |
| `Team`        | Membres publics de l'équipe (bio courte / longue, socials, types)                        |
| `Media`       | Uploads avec resize Sharp                                                                |

Plus `Users` (admins/staff) et les plugins `Forms` / `Form-submissions` / `Redirects`.

### 5 globals

| Global                     | Contenu                                                                                                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identité de marque**     | Palette light + dark complète (10 couleurs + foreground), 7 scénarios pré-faits (Modern, Editorial, Bold, Minimal, Warm, Premium, Tech), typo Google Fonts, logo light + dark, dark mode auto, **CSS personnalisé** |
| **Paramètres**             | Nom du site, description courte, contact, mentions légales                                                                                                                                                          |
| **Référencement (SEO)**    | Métadonnées par défaut, OG, social handles, JSON-LD Organization, vérifications (Google/Bing/Yandex/Pinterest), robots extra, sitemap exclude, analytics (Plausible/GTM/GA4)                                        |
| **En-tête / Pied de page** | Nav, CTA, colonnes de liens, copyright                                                                                                                                                                              |

### 13 blocks Page/Snippet

Hero (centered/split), Features (grid/list/cards), CTA (centered/banner/card), RichText, Group (1-4 colonnes), LogoCloud, Pricing, Testimonials, FAQ, Stats, SnippetReference, FormReference, Newsletter.

Chaque block a un onglet **Apparence** (background / padding / max-width / divider) et **Visibilité** (mobile / locale / dates).

### Features admin

- **Onboarding wizard** au 1er run (preset Brand + identité du site)
- **Templates de pages** (4 layouts pré-composés : Landing SaaS, About, Pricing, Article)
- **Block presets** (11 blocs préfaits, insérables sur une page existante)
- **Live Edit Overlay** : éditer / déplacer / supprimer les blocks directement sur le site en draft mode (Firefox-safe, pas d'iframe)
- **Traduction IA FR↔EN** silencieuse si pas de clé, sinon Anthropic ou OpenAI
- **BeforeDashboard** avec cards colorisées (pages récentes / articles / soumissions / santé du contenu SEO)

### SEO

- `buildMetadata` : hreflang, canonical, OG fallback dynamique, Twitter cards
- 8 schémas JSON-LD : Organization, WebSite, Article, WebPage, Person, BreadcrumbList, FAQPage, Product, HowTo
- Sitemap multi-locale avec `alternates.languages`
- RSS `/rss.xml` et `/en/rss.xml`
- robots.txt avec règles extra depuis le global SEO
- `/api/og?title=…` : OG images dynamiques avec couleurs de marque

### Toolkit data

```bash
make new                              # scaffold interactif d'une collection (RBAC + slug + SEO + tabs)
make export COLL=posts FILE=out.json  # bulk export (filtres : LOCALE, WHERE, LIMIT)
make import COLL=posts FILE=in.json   # bulk import idempotent (UPSERT par slug)
```

Le format produit par `make export` est directement re-importable. Pour un ETL depuis un CMS externe (Directus, Strapi, WordPress), écris un script qui produit ce JSON.

### Field toolkit

`src/lib/fields.ts` expose des helpers réutilisables : `slugField()` (auto-dérivé du titre), `seoOverrideFields()` (noindex + canonical), `tagsField()`, `authorField()`, `coverField()`, `excerptField()`, `publishedAtField()`, `customCssField()`.

## URLs

| Route                                     | Description                                  |
| ----------------------------------------- | -------------------------------------------- |
| `/`                                       | Landing                                      |
| `/blog`, `/blog/[slug]`                   | Index + détail des articles                  |
| `/auteur/[slug]`                          | Page auteur (Person JSON-LD)                 |
| `/[...slug]`                              | Pages CMS (FR sans préfixe, `/en/*` pour EN) |
| `/sign-in`, `/sign-up`                    | Auth (email/password + magic link + OAuth)   |
| `/dashboard`                              | Page protégée                                |
| `/pricing`                                | Plans + Stripe checkout                      |
| `/admin`                                  | Admin Payload                                |
| `/api/[collection]`                       | REST Payload (auto)                          |
| `/api/og?title=…`                         | OG image dynamique                           |
| `/api/translate`                          | AI translate (auth requise)                  |
| `/api/preview`                            | Active draft mode (auth requise)             |
| `/api/auth/*`                             | Better Auth handlers                         |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml` | SEO                                          |

## Commandes

| Commande                      | Description                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| `make init`                   | Bootstrap interactif d'un nouveau site (admin + preset + siteName) |
| `make dev`                    | Postgres + migrations + Next dev                                   |
| `make types`                  | Régénère `payload-types.ts` + importMap admin                      |
| `make payload-migrate`        | Applique les migrations Payload                                    |
| `make seed`                   | Pré-remplit la DB avec démo (idempotent)                           |
| `make new`                    | Scaffold interactif d'une nouvelle collection                      |
| `make import` / `make export` | Bulk JSON in/out                                                   |
| `make check`                  | lint + typecheck + tests unit                                      |
| `make test` / `make test-e2e` | Vitest / Playwright                                                |
| `make clean`                  | Supprime `.next` (à lancer si admin écran blanc après schéma)      |
| `make update`                 | Applique les upgrades du boilerplate (versioning)                  |
| `make db-reset`               | ⚠ Nuke la DB (avec confirmation)                                   |

## Structure

```
src/
├── app/
│   ├── (frontend)/         # Site public (FR + EN)
│   ├── (payload)/          # Admin + REST + GraphQL
│   └── api/                # Routes API custom (translate, og, preview, vitals…)
├── collections/            # Pages, Posts, Snippets, CaseStudies, Products, Team, Media, Users
├── globals/                # Brand, Settings, Seo, Header, Footer
├── blocks/                 # 13 blocks (schemas Payload)
├── components/blocks/      # Renderers React des blocks
├── admin/                  # Composants admin custom (BeforeDashboard, OnboardingWizard, etc.)
├── lib/
│   ├── access.ts           # RBAC helpers (isAdmin, isAdminOrEditor, readPublishedOrStaff)
│   ├── fields.ts           # Field toolkit (slugField, seoOverrideFields, etc.)
│   ├── seo.ts              # buildMetadata
│   ├── structured-data.ts  # 8 helpers JSON-LD
│   ├── branding.ts         # Brand → CSS vars (10 couleurs + dark)
│   ├── translate.ts        # AI translate multi-provider
│   ├── auth.ts             # Better Auth config
│   └── …
├── migrations/             # Migrations Payload (versionnées)
└── payload.config.ts
```

## RBAC — 3 rôles fixes

| Rôle      | UI admin                | API              | Détail                                                               |
| --------- | ----------------------- | ---------------- | -------------------------------------------------------------------- |
| `admin`   | Tout                    | Tout             | Tout, y compris Users + Brand                                        |
| `editor`  | Contenu                 | Contenu          | CRU sur Pages/Posts/etc., **pas** de delete, pas d'accès Users/Brand |
| `service` | ❌ Pas de connexion web | Tout via API key | Pour scripts, imports, sync ERP. API key auto-générée par Payload.   |

Helpers : `src/lib/access.ts` exporte `isAdmin`, `isAdminOrEditor`, `readPublishedOrStaff`. **Toujours les utiliser**, jamais inliner `req.user?.role === 'admin'`.

## Cohabitation Payload / Better Auth

Deux systèmes d'auth distincts dans **la même DB Postgres** :

| Système         | Table                                                    | Pour qui                       |
| --------------- | -------------------------------------------------------- | ------------------------------ |
| **Payload**     | `users` (pluriel)                                        | Admin / staff (toi, équipe)    |
| **Better Auth** | `user` (singulier), `session`, `account`, `verification` | App users (clients du produit) |

Les deux tables n'interfèrent pas.

## Activer la traduction IA

Au moins une des deux clés suffit. Si les deux sont définies, Anthropic gagne (override via `TRANSLATE_PROVIDER=openai`).

```bash
ANTHROPIC_API_KEY=sk-ant-…
# ou
OPENAI_API_KEY=sk-proj-…
OPENAI_TRANSLATE_MODEL=gpt-4o-mini   # optionnel
```

Sans clé, le bouton FR↔EN ne s'affiche pas dans l'admin (pas de message d'erreur, pas de friction).

## Activer Resend (prod)

Sans clé, les emails sont loggués au terminal — parfait pour dev. Pour la prod :

```bash
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=hello@tondomaine.com
```

(Et active la vérif email obligatoire dans `src/lib/auth.ts` si tu veux : `requireEmailVerification: true`.)

## Activer Stripe

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

La commande affiche le `whsec_xxx` à mettre dans `.env.local` :

```bash
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_PREMIUM=price_xxx
```

Pour ajouter un plan, édite `src/lib/stripe.ts` → ajout d'une entrée dans `PLANS`.

## Versioning du boilerplate

Chaque site forké dérive de `.boilerplate-version` (semver). Les upgrades sont des scripts versionnés dans `scripts/upgrades/<from>-to-<to>.ts`.

```bash
make update    # liste les upgrades à appliquer, demande confirmation, exécute
```

Permet de faire évoluer Folio sans `git merge upstream` qui explose. Voir [CLAUDE.md](CLAUDE.md#versioning-du-boilerplate--make-update) pour le workflow maintainer.

## Documentation interne

- [CLAUDE.md](CLAUDE.md) — conventions du projet (à lire avant de contribuer)
- [AGENTS.md](AGENTS.md) — guide pour les agents IA qui éditent le repo
- `/features`, `/design`, `/security` — pages de documentation rendues par le site lui-même
