# Web App

Application Next.js 16+ du boilerplate.

## Scripts

- `pnpm dev` : démarrage local
- `pnpm build` : build production
- `pnpm lint` : ESLint
- `pnpm typecheck` : TypeScript strict
- `pnpm test` : tests unitaires
- `pnpm test:e2e` : tests Playwright

## Structure

- `src/app` : routes App Router
- `src/app/api` : endpoints `health` et `revalidate`
- `src/app/globals.css` : styles Tailwind v4
- `packages/lib` : utils Directus et SEO
- `packages/ui` : composants partagés
