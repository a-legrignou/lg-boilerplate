# Conventions du projet

Ce fichier guide les humains et les agents IA qui contribuent au repo. Lis-le avant d'éditer.

## Stack

- **Next.js 16** (App Router, **webpack** dev — pas Turbopack à cause de Payload v3)
- **Payload v3** (CMS headless) — admin sur `/admin`, REST sur `/api/[collection]`
- **Better Auth** — sessions app users (`user`, `session`, `account`, `verification`)
- **Postgres** local en Docker (port `5433`)
- **Tailwind v4** + **shadcn/ui**

## Architecture clé

### Deux systèmes d'auth dans la même DB

- Table `users` (pluriel) → admins/staff Payload
- Table `user` (singulier) → app users (Better Auth)
  Ils n'interfèrent pas. Ne pas confondre.

### Routing i18n

- **FR = locale par défaut, sans préfixe** : `/`, `/about`, `/blog/...`
- **EN = avec préfixe** : `/en`, `/en/about`, `/en/blog/...`
- Détection de la locale dans le layout via `x-pathname` header (set par `src/proxy.ts`)
- Helpers : `src/lib/i18n.ts` (`LOCALES`, `DEFAULT_LOCALE`, `localizedPath`)

### Middleware = `src/proxy.ts` (Next 16+)

**Ne pas renommer en `middleware.ts`**. En Next 16+, le fichier s'appelle `proxy.ts` et exporte `proxy` (pas `middleware`). Voir [src/proxy.ts](src/proxy.ts).

### SEO

- Plugin `@payloadcms/plugin-seo` ajoute un onglet "SEO" sur Pages + Posts (title, description, OG image)
- Helpers : `src/lib/seo.ts` (`buildMetadata` — hreflang, canonical, OG, Twitter)
- Structured data : `src/lib/structured-data.ts` (`organizationSchema`, `websiteSchema`, `articleSchema`, `pageSchema`, `breadcrumbSchema`) — utilisé via `<JsonLd data={...} />`
- OG images dynamiques : `/api/og?title=...` (généré avec `next/og` + brand colors)
- Sitemap multi-locale : `src/app/sitemap.ts` (avec `alternates.languages`)
- RSS : `/rss.xml` et `/en/rss.xml`

### Branding

- Global "Brand" → primaryColor / accentColor / fontPreset / radius
- Injecté en CSS variables dans `<head>` via `src/lib/branding.ts` → `--brand-primary`, `--brand-accent`, `--brand-font`, `--brand-radius`

## Permissions / RBAC

3 rôles fixes sur la collection `Users` (champ `role`) :

| Rôle      | Accès UI                                                                                   | Accès API        | Peut                                                                                |
| --------- | ------------------------------------------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------- |
| `admin`   | Tout                                                                                       | Tout             | Tout, y compris gérer `Users` et `Brand`                                            |
| `editor`  | Pages, Posts, Snippets, Media, Forms, Submissions, Redirects, Header, Footer, SiteSettings | Idem UI          | Lire, créer, modifier le contenu. **Pas** de delete, pas d'accès `Users` ni `Brand` |
| `service` | ❌ Pas de connexion web (hook `beforeLogin` bloque)                                        | Tout via API key | Mêmes permissions qu'`admin` côté API. Pour scripts, imports CSV, sync ERP          |

**Helpers** : `src/lib/access.ts` exporte `isAdmin`, `isAdminOrEditor`, `readPublishedOrStaff`. À utiliser systématiquement dans les `access` des collections et globals — ne JAMAIS hardcoder `({ req }) => req.user?.role === 'admin'` inline.

**Service account** : crée un user avec role=service dans `/admin/collections/users`, copie l'API key qui apparaît automatiquement (Payload `useAPIKey: true`). Auth via header :

```
Authorization: users API-Key <la_clef>
```

**Quand tu ajoutes une nouvelle collection**, n'oublie pas l'`access` :

```ts
access: {
  read: readPublishedOrStaff,         // ou () => true pour public, isAdmin pour privé
  create: isAdminOrEditor,
  update: isAdminOrEditor,
  delete: isAdmin,
}
```

## Workflow modifications

### Ajouter une collection Payload

**Voie rapide (prompt interactif)** :

```bash
make new
# → prompts (nom, slug, group, champs métier)
# → génère src/collections/<Name>.ts
# → patch src/payload.config.ts
# → te rappelle de faire make types + migrate
```

**Voie manuelle** :

1. Créer `src/collections/MaCollection.ts` (modèle : `Posts.ts`, avec hooks `revalidate*`). **Préfère les helpers de [src/lib/fields.ts](src/lib/fields.ts)** (`slugField`, `coverField`, `tagsField`, `authorField`, `seoOverrideFields`, `excerptField`, `publishedAtField`, `customCssField`) au lieu de redéclarer les fields à la main.
2. L'importer dans `src/payload.config.ts` → `collections: [..., MaCollection]`
3. Marquer les champs textuels en `localized: true` si on veut une traduction par locale
4. `make types` (régénère `payload-types.ts`)
5. `pnpm payload migrate:create <nom>` puis `make payload-migrate`

### Ajouter un block (CMS)

1. Créer `src/blocks/MonBlock.ts` (`type: Block`, fields)
2. L'exporter dans `src/blocks/index.ts`
3. L'ajouter dans `Pages.layout.blocks` (et où il est utilisable)
4. Créer le renderer React `src/components/blocks/MonBlock.tsx`
5. L'enregistrer dans `src/components/blocks/RenderBlocks.tsx` (switch case)
6. `make types` + migration

### Ajouter une global Payload

1. `src/globals/MaGlobal.ts` avec hook `afterChange: [revalidateGlobal]` pour invalider les pages
2. L'importer dans `src/payload.config.ts` → `globals: [..., MaGlobal]`
3. `make types` + migration

### Ajouter une variable d'env

1. La déclarer dans `src/lib/env.ts` (Zod schema) — sans ça, l'app refusera de démarrer
2. La documenter dans `.env.example`

### Ajouter un plugin Payload qui fournit du UI

Après l'install : `make payload-importmap` (sinon les composants admin du plugin ne se chargent pas).

### Migrer / sauvegarder de la donnée

Folio expose une **toolkit data** générique (aucune CLI externe nécessaire) :

```bash
# Backup avant migration
make export COLL=posts FILE=backup/posts-fr.json LOCALE=fr WHERE=_status=published

# Restore / import bulk JSON (idempotent si --upsert-by sur un champ unique)
make import COLL=posts FILE=backup/posts-fr.json LOCALE=fr UPSERT=slug

# Dry-run (validation sans écriture)
make import COLL=posts FILE=data/posts.json UPSERT=slug DRY=1
```

Format JSON attendu en import : un tableau `[{...}, ...]` ou un objet `{ docs: [...] }` (le format produit par `make export` est directement re-importable).

Pour une migration depuis un CMS externe (Directus, Strapi, WordPress…) : écrire un script `scripts/etl-<source>.ts` qui produit ce JSON, puis enchaîner `make import`. Voir `scripts/import.ts` pour le contrat exact.

## Points sensibles à connaître

### Migrations Payload — pas d'auto-push

La config a `db: postgresAdapter({ ..., push: false })`. C'est volontaire : l'auto-push interactif (rename column?) bloque le serveur dès qu'un autre système (Better Auth) partage la DB. Toujours passer par des migrations explicites :

```
pnpm payload migrate:create <nom>
make payload-migrate
```

### Revalidation

Les collections `Pages`, `Posts` et tous les globals ont un hook `afterChange` qui appelle `revalidatePath()` (Next on-demand revalidation). Quand tu publies depuis l'admin, le frontend se rafraîchit immédiatement. Voir `src/lib/revalidate.ts`.

### Locale dans les hooks

Le `req.locale` dans un hook Payload est la locale dans laquelle le doc a été modifié. Le hook revalide donc le bon préfixe URL (FR ou `/en`).

### `<html lang>` dynamique

Le layout est partagé entre routes FR et EN. Pour avoir `lang="fr"` ou `lang="en"`, on lit le header `x-pathname` (set par `proxy.ts`) dans `src/app/(frontend)/layout.tsx`.

## Commandes utiles

```bash
make dev               # tout démarrer (Postgres + migrations + Next)
make types             # régénère payload-types.ts + importMap
make payload-migrate   # applique les migrations Payload
make check             # lint + typecheck + tests unit
make test              # tests unit (Vitest)
make test-e2e          # tests E2E (Playwright)
make seed              # pré-remplit la DB avec démo
make clean             # supprime .next (à lancer si /admin écran blanc après migration)
make db-reset          # nuke la DB (avec confirmation)
```

## Versioning du boilerplate / `make update`

Ce repo est forké pour chaque site déployé (site A, site B, etc.). Une fois forké, chaque site diverge. Pour gérer les montées de version sans `git merge upstream` qui explose, on utilise un système de scripts d'upgrade versionnés.

### Concepts

- **`.boilerplate-version`** (à la racine de chaque site) — semver de la version du boilerplate dont ce site dérive (ex: `1.0.0`).
- **`scripts/upgrades/<from>-to-<to>.ts`** — scripts d'upgrade. Chaque fichier exporte un objet `Upgrade` avec `up()`, description, breaking flag, release notes.
- **`make update`** — runner qui lit la version courante, calcule la chaîne d'upgrades à appliquer, demande confirmation, exécute en séquence, met à jour `.boilerplate-version` après chaque succès.

### Sortir une nouvelle version (côté maintainer du boilerplate)

1. Implémente la feature/le changement dans le code source.
2. Copie `scripts/upgrades/_template.ts` en `<from>-to-<to>.ts` (ex: `1.0.0-to-1.1.0.ts`).
3. Dans `up()`, écris le code qui transforme un site en v1.0.0 vers v1.1.0 (codemods, bumps de deps, migrations Payload, etc.).
4. **`up()` doit être idempotent** — un re-run ne doit rien casser (vérifie avant de modifier).
5. Renseigne `description`, `breaking`, `releaseNotes`.
6. Bump `.boilerplate-version` à la nouvelle valeur dans le repo source du boilerplate (pour que cette version soit reflétée si quelqu'un fork à partir de là).

### Mettre à jour un site (côté utilisateur)

1. Récupère les nouveaux scripts d'upgrade (deux options) :

   ```bash
   # Option A — git remote upstream
   git fetch upstream main
   git checkout upstream/main -- scripts/upgrades/

   # Option B — copie manuelle si pas de remote
   # Récupère les fichiers .ts ajoutés depuis ta version
   ```

2. `make update` → liste les upgrades à appliquer, demande confirmation, exécute.
3. Vérifie le diff git, commit.

### Règles

- Préfère **plusieurs petits scripts** (ex: 1.0.0→1.0.1, 1.0.1→1.1.0) plutôt qu'un gros (1.0.0→2.0.0). Plus facile à debug, à rollback, à lire.
- **Ne PAS modifier rétroactivement** un script d'upgrade publié (les sites tiers l'ont déjà appliqué). Si tu as oublié quelque chose, sors un nouvel upgrade qui le corrige.
- **Discipline** : garde chaque site le plus proche possible du boilerplate. Pousse les customisations vers le CMS (Snippets, Brand global) plutôt que le code. Si tu forke un block, donne-lui un nom différent (`HeroCustom` plutôt qu'écraser `Hero`).

## Pièges récurrents

- **500 sur TOUTES les routes /admin** (avec `Cannot read properties of undefined (reading 'call')` dans les chunks `@payloadcms/ui`) : un custom Field component utilise une dépendance qui ne supporte pas le SSR. Cas typique : `react-colorful`, ou toute lib qui touche au DOM au top-level. **Solution** : utiliser des deps server-safe ou des primitives HTML natives (`<input type="color">`, `<details>`, etc). Préférer 0 dépendance.
- **Warning React 19 "Encountered a script tag while rendering React component"** : faux positif pour les `<script type="application/ld+json">` (JSON-LD) et le theme-init script. Ces scripts ne s'exécutent qu'à l'initial HTML render, pas besoin de re-render — le warning est trompeur. **N'apparaît qu'en dev**, pas en prod. À ignorer ; le contenu apparaît bien dans le HTML servi.
- **Écran blanc / 500 sur /admin après une migration** : le cache `.next` a un schéma périmé. → `make clean && make dev`
- **Import map admin pas à jour** après ajout d'un plugin avec UI : → `make types` (qui inclut `payload generate:importmap`)
- **Bloqué sur prompt interactif Drizzle** : tu as oublié `push: false` dans postgresAdapter, ou tu as une collision de noms de table avec Better Auth (`user` vs `users`).

## Ce qu'il NE faut PAS faire

- ❌ Renommer `proxy.ts` en `middleware.ts` (Next 16+ veut `proxy.ts`)
- ❌ Activer `--turbopack` dans `pnpm dev` (incompat avec Payload admin)
- ❌ Mettre `push: true` sur le postgresAdapter (bloque sur prompt interactif vu Better Auth)
- ❌ Modifier `src/payload-types.ts` à la main (régénéré par `make types`)
- ❌ Oublier le hook `afterChange: [revalidateGlobal]` quand on crée un nouveau global (sinon le frontend cache l'ancienne version indéfiniment)
