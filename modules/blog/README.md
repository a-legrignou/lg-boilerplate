# Module blog

Le blog est construit pour proposer des articles SEO-friendly et des contenus riches.

## Collections Directus

- `authors`
- `categories`
- `tags`
- `articles`

## Routes applicatives

- `/blog` : liste des articles publiés
- `/blog/[slug]` : page de détail de l’article
- `/blog/rss` : flux RSS
- `/blog/sitemap` : sitemap dédié au module blog

## Points clés

- `slug` unique pour chaque article
- contenu riche via `json` ou `markdown`
- relation `many-to-many` entre articles, catégories et tags
- SEO Article via metadata API et JSON-LD
- RSS + sitemap dédiés
