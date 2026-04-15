# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [Unreleased]

### Ajouté
- **Authentification Directus 11 native** — cookies `httpOnly` (`ds_access` + `ds_refresh`)
  - Routes API : `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/me`
  - `src/lib/utils/auth.js` : `getSession`, `getUserTier`, `canAccessPost`
  - `src/middleware.ts` : refresh silencieux + protection `/account`
- **Page `/[locale]/login`** — mire de connexion (React Hook Form + Zod)
- **Page `/[locale]/account`** — espace membre (profil, tier, déconnexion)
- **Système de tiers de contenu** pour les articles blog
  - Champ `tier` sur `posts` : `null` (public) / `"community"` / `"premium"`
  - Champ `slug` sur `posts` pour des URLs SEO-friendly
  - Badge `TierBadge` — Community (sage + Users) / Premium (gold + Crown)
- **Paywall sur les articles premium/community**
  - Excerpt + premier bloc visibles par tous (SEO préservé)
  - Contenu complet masqué si l'utilisateur n'a pas le bon tier
  - JSON-LD `isAccessibleForFree: "False"` + `hasPart` selon recommandations Google
- **Filtres de tier sur la page blog** — onglets Tous / Community / Premium (côté client)
- **Export PDF des articles blog** (`/api/blog/[id]/pdf`)
  - Composant `BlogDocument` (même charte que les études de cas)
  - Vérification du tier en auth avant génération pour les articles premium
- **Script Directus setup** (`scripts/directus-setup.js`)
  - Crée les rôles Service Account, Community, Premium
  - Génère un token statique pour le compte de service
  - Ajoute les champs `tier` et `slug` sur la collection `posts`
  - Configure les permissions par rôle
- Page `/maintenance` dynamique connectée à la collection Directus `maintenance`
  - Champs : `title`, `message`, `return_date`, `image`, `contact_email`
  - Image de fond via Directus Assets
  - Compteur de retour avec `suppressHydrationWarning`
  - Redirection vers `/` si maintenance inactive
- Variable `NEXT_PUBLIC_APP_ENV` pour discriminer dev et production
- Fichier `.env.production` avec `NEXT_PUBLIC_APP_ENV=production`
- Filtre des sections par environnement via le champ `status` Directus
  - `prod` → visible en dev et en prod
  - `dev` → dev uniquement
  - `draft` → jamais visible

### Corrigé
- Erreur d'hydratation React sur `LanguageSwitcher` (IDs Radix UI aléatoires) — rendu différé côté client avec `mounted` state
- Erreur d'hydratation sur le compteur de maintenance — `suppressHydrationWarning` sur les chiffres

---

## [0.1.0] — 2026-03-03

### Ajouté
- Initialisation du projet depuis `create-next-app`
- Intégration Directus CMS (`@directus/sdk`)
- Routing i18n `[locale]` (fr / en)
- Pages : home, blog, contact, proposal, pages dynamiques (`[...slug]`)
- Composants UI shadcn/ui + Radix UI
- Formulaires React Hook Form + Zod
- SEO : métadonnées, JSON-LD, sitemap, robots.txt
- Navigation multilingue avec `LanguageSwitcher`
- Mode sombre (hook `dark-mode`)
- Protection CSRF sur les routes API
