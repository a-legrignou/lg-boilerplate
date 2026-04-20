# Module core-pages

Ce module gère les pages statiques et dynamiques éditables depuis Directus.

## Contenu

- `schema/` : collections Directus pour pages et blocs de contenu
- `migrations/` : scripts de migration SQL ou annotations supplémentaires

## Activation

L’activation se fera côté application Next en lisant la variable d’environnement `NEXT_PUBLIC_ENABLE_CORE_PAGES`.

## Routes

- `/core-pages` : liste des pages éditables
- `/core-pages/[slug]` : rendu de chaque page CMS
