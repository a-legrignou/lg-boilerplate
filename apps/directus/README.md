# Directus App

Cette application contient la configuration Directus et les extensions spécifiques au projet.

## Usage

- `pnpm --filter @coreo/directus bootstrap` : initialise Directus (roles, tables, etc.)
- `pnpm --filter @coreo/directus start` : démarre le serveur Directus local
- `pnpm --filter @coreo/directus schema:apply` : applique les schémas Directus déclarés

## Organisation

- `directus.config.js` : configuration Directus et extension hooks
- `extensions/hooks` : hooks métier, par exemple revalidation Next
- `snapshots/initial-schema.yml` : snapshot d’import pour démarrer l’instance
