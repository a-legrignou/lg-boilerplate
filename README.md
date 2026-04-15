# Coreo Group — Frontend

Site web de Coreo Group. Next.js 16 + Directus CMS.

## Stack

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styles | Tailwind CSS 4.1 |
| UI | shadcn/ui + Radix UI |
| CMS | Directus (headless) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| i18n | Routing `[locale]` (fr / en) |

## Prérequis

- Node.js ≥ 20
- Accès à l'instance Directus

## Installation

```bash
npm install
cp .env.local.example .env.local   # puis remplir les variables
npm run dev
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_ENV` | `development` ou `production` |
| `NEXT_PUBLIC_DIRECTUS_URL` | URL de l'instance Directus |
| `NEXT_PUBLIC_DIRECTUS_ASSETS` | URL des assets Directus |
| `DIRECTUS_URL` | URL serveur Directus (peut être identique à PUBLIC) |
| `DIRECTUS_API_KEY` | Clé API admin (server-side uniquement) |
| `DIRECTUS_STATIC_TOKEN` | Token du compte de service (généré par `scripts/directus-setup.js`) |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Locale par défaut (`fr`) |
| `NEXT_PUBLIC_SUPPORTED_LOCALES` | Locales supportées (`fr,en`) |

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Démarrer en production
npm run lint     # Linting ESLint
```

## Structure

```
src/
├── app/
│   ├── [locale]/          # Pages localisées (home, blog, contact, proposal)
│   ├── maintenance/       # Page de maintenance
│   └── api/               # Routes API (contact, blog, csrf)
├── components/
│   ├── ui/                # Composants shadcn/ui
│   ├── layout/            # Sections de page (header, footer, blog, team…)
│   ├── cards/             # Cartes (blog, équipe, cas clients…)
│   ├── forms/             # Formulaires (contact, newsletter, devis)
│   ├── widgets/           # Composants réutilisables
│   └── menus/             # Navigation
├── lib/
│   ├── models/            # Accès données Directus
│   ├── hooks/             # Hooks React
│   ├── seo/               # Utilitaires SEO & JSON-LD
│   └── controllers/       # Logique métier (forms, posts)
└── styles/                # Fonts
```

## Sections et environnements

Les sections Directus utilisent le champ `status` pour contrôler leur visibilité :

| Valeur `status` | Comportement |
|-----------------|--------------|
| `prod` | Visible en développement et en production |
| `dev` | Visible uniquement en développement |
| `draft` | Jamais visible |

## Authentification

L'auth utilise les endpoints natifs **Directus 11** — pas de NextAuth.

Tokens stockés en cookies `httpOnly` (`ds_access` + `ds_refresh`).

### Setup initial (à exécuter une fois)

```bash
DIRECTUS_URL=https://admin.coreo-group.fr \
DIRECTUS_ADMIN_TOKEN=votre_token_admin \
node scripts/directus-setup.js
```

Crée les rôles (Service Account / Community / Premium), les champs `tier` et `slug` sur `posts`, et génère le `DIRECTUS_STATIC_TOKEN`.

### Tiers de contenu (champ `tier` sur `posts`)

| Valeur | Accès |
|--------|-------|
| `null` | Public — visible sans connexion |
| `"community"` | Requiert une connexion |
| `"premium"` | Requiert le rôle Premium |

## Page de maintenance

Configurée depuis la collection `maintenance` dans Directus.

Champs : `status`, `title`, `message`, `return_date`, `image`, `contact_email`.

Quand `status` est actif → la page `/maintenance` s'affiche. Sinon → redirection vers `/`.
