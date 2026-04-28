# Notes for AI agents

Same conventions as humans → see [CLAUDE.md](./CLAUDE.md). This file lists agent-specific reminders.

## Before any change

1. Read `CLAUDE.md` once per session.
2. Pour comprendre une page : commencer par `src/app/(frontend)/` (routing) puis `src/lib/` (data + helpers) puis `src/components/`.
3. Pour comprendre un champ admin : commencer par `src/payload.config.ts` puis `src/collections/` ou `src/globals/`.

## Quand tu modifies le schéma Payload

Toujours dans cet ordre :

1. Édite `src/collections/*.ts`, `src/globals/*.ts` ou `src/blocks/*.ts`
2. `make types` (régénère `payload-types.ts` — utilisé partout via `@/payload-types`)
3. `pnpm payload migrate:create <nom_descriptif>`
4. `make payload-migrate`
5. `pnpm typecheck`

Skipper l'étape 2 = les types frontend sont périmés et le typecheck va passer mais l'admin va casser silencieusement.

## Quand tu ajoutes un champ texte affiché publiquement

Mets-le `localized: true` par défaut, sauf raison explicite (slugs internes, IDs externes…). Le coût est nul, le retour en arrière est cher.

## Pièges déjà rencontrés (ne pas répéter)

- **Turbopack + Payload v3 admin** = compilation infinie. Le script `dev` est `next dev --webpack` exprès.
- **`push: true` sur postgresAdapter** + Better Auth tables existantes = prompt interactif Drizzle qui bloque le serveur sans output. Toujours `push: false`.
- **`middleware.ts`** n'existe plus en Next 16+. Le fichier est `src/proxy.ts` et exporte `proxy(req)` — pas `middleware(req)`.
- **`revalidateTag`** en Next 16 demande 2 args (`tag, profile`). Si pas besoin de profil, préférer `revalidatePath` qui prend juste un chemin.

## Avant de finir une tâche

- `make check` doit passer (lint + typecheck)
- Si t'as modifié quelque chose qui touche au SEO (metadata, sitemap, JSON-LD), curl-tester la page et inspecter le HTML — le typecheck ne valide pas la sortie SEO

## Quand tu crées un fichier

- Locale par défaut FR pour les chaînes UI
- Pas de commentaires inutiles dans le code (la consigne globale est "no comments unless the why is non-obvious")
- Pas de README ou doc créés sans demande explicite (CLAUDE.md/AGENTS.md sont les seules exceptions)
