-- Module core-pages: tables et index Directus utiles
-- Si vous souhaitez versionner des migrations SQL, ajoutez ici les DDL complémentaires.

-- Exemple : index pour recherche de slugs
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages (slug);
