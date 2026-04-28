# lg-boilerplate

Boilerplate Next.js 16 + Payload v3 + Better Auth + Stripe + Resend + Postgres pour produits perso pro.

Stack :

- **Next.js 16** (App Router, Turbopack)
- **Payload v3** (CMS code-first, MIT)
- **Better Auth** (auth open source MIT — sessions, email/password, email verif)
- **Stripe** (subscription + webhook + customer portal)
- **Resend** (emails transactionnels — fallback console en dev)
- **Postgres** (via Docker en local)
- **Tailwind v4** + **shadcn/ui** + dark mode
- **TypeScript** end-to-end

## Démarrage

```bash
make dev
```

C'est tout. La commande :

1. Crée `.env.local` (avec `PAYLOAD_SECRET` et `BETTER_AUTH_SECRET` générés)
2. `pnpm install` si nécessaire
3. Lance Postgres en Docker (port **5433** pour cohabiter avec d'autres projets)
4. Applique le schéma Better Auth (idempotent)
5. Lance Next.js sur http://localhost:3000

## URLs

| Route                   | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `/`                     | Landing                                                  |
| `/sign-up` / `/sign-in` | Auth (Better Auth)                                       |
| `/dashboard`            | Page protégée (redirect vers `/sign-in` sans session)    |
| `/pricing`              | Plans + Stripe checkout                                  |
| `/admin`                | Admin Payload (créer ton premier admin au premier accès) |
| `/api/auth/*`           | Endpoints Better Auth                                    |
| `/api/stripe/webhook`   | Webhook Stripe (renvoie 503 si Stripe pas configuré)     |
| `/api/[collection]`     | REST API Payload                                         |

## Commandes

| Commande                                      | Description                                            |
| --------------------------------------------- | ------------------------------------------------------ |
| `make dev`                                    | Lancer le projet                                       |
| `make db-up` / `make db-down`                 | Démarrer/stopper Postgres                              |
| `make migrate`                                | Appliquer le schéma Better Auth (auto-lancé par `dev`) |
| `make db-reset`                               | Effacer la base (avec confirmation)                    |
| `make build` / `make lint` / `make typecheck` | Qualité                                                |

## Structure

```
src/
├── app/
│   ├── (frontend)/        # Next.js public — pages app
│   │   ├── page.tsx       # Landing
│   │   ├── sign-in/, sign-up/
│   │   └── dashboard/     # Page server protégée
│   ├── (payload)/         # Routes Payload (admin + REST + GraphQL)
│   └── api/auth/[...all]/ # Better Auth handler
├── collections/           # Collections Payload (Users, Posts, Media)
├── components/            # UI (shadcn + custom)
├── lib/
│   ├── auth.ts            # Config server Better Auth
│   ├── auth-client.ts     # Hooks client (signIn, signUp, useSession)
│   └── utils.ts           # cn() Tailwind helper
└── payload.config.ts      # Config Payload
```

## Cohabitation Payload / Better Auth

Deux systèmes auth distincts dans la **même DB Postgres** :

| Système         | Table                                                    | Pour qui                       |
| --------------- | -------------------------------------------------------- | ------------------------------ |
| **Payload**     | `users` (pluriel)                                        | Admin / staff (toi, équipe)    |
| **Better Auth** | `user` (singulier), `session`, `account`, `verification` | App users (clients du produit) |

Les deux tables n'interfèrent pas. Tu peux étendre Better Auth avec des champs custom via `additionalFields` dans `src/lib/auth.ts`.

## Comment ajouter une collection Payload

1. Crée `src/collections/MaCollection.ts` (modèle : `Posts.ts`)
2. Importe-la dans `src/payload.config.ts` → `collections: [...]`
3. `make dev` → la table est créée auto, l'admin la voit
4. Les types TypeScript sont régénérés à chaque save de Payload (`src/payload-types.ts`)

## Comment protéger une route

Server component :

```tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return <div>Bonjour {session.user.name}</div>;
}
```

Client component :

```tsx
"use client";
import { useSession } from "@/lib/auth-client";

const { data: session, isPending } = useSession();
```

## Activer Resend (prod)

Sans clé API, les emails sont **loggués au terminal** (incluant les liens de vérif/reset). Parfait pour dev local.

Pour la prod :

1. Crée un compte sur https://resend.com (free tier généreux)
2. Vérifie ton domaine (DNS records)
3. Ajoute à `.env.local` (ou GitHub Secrets) :
   ```
   RESEND_API_KEY=re_xxxxx
   EMAIL_FROM=hello@tondomaine.com
   ```
4. (Optionnel) Active la vérif email obligatoire dans `src/lib/auth.ts` :
   ```ts
   emailAndPassword: { requireEmailVerification: true, ... }
   ```

## Activer Stripe (prod + dev local)

### Setup Stripe Dashboard

1. Crée un compte Stripe → mode Test
2. Crée un produit (ex: "Premium Monthly") avec un prix récurrent (ex: 9 €/mois)
3. Note le `price_xxx`
4. Récupère ta clé secrète Test (`sk_test_xxx`)

### Dev local (avec Stripe CLI)

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

La commande affiche un `whsec_xxx` à mettre dans `.env.local`.

Ajoute à `.env.local` :

```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_PREMIUM=price_xxx
```

Test du flow complet :

- Sign-up → /pricing → Souscrire → CB de test (`4242 4242 4242 4242`)
- Tu devrais voir le webhook arriver dans le terminal de `stripe listen`
- Le dashboard affiche "Statut : active"

### Ajouter un nouveau plan

Édite `src/lib/stripe.ts`, ajoute une entrée dans `PLANS` avec son `STRIPE_PRICE_ID_*`.
