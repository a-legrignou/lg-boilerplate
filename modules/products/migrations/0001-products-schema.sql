-- Module products : index et contraintes SQL

CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants (sku);
