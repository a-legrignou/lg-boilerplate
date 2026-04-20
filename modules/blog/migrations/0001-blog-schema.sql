-- Module blog : index, contraintes et améliorations SQL

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at);
