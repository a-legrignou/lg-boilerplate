import * as migration_20260426_090854_initial from "./20260426_090854_initial";
import * as migration_20260426_091844_brand from "./20260426_091844_brand";
import * as migration_20260426_092936_redirects from "./20260426_092936_redirects";
import * as migration_20260426_100154_blocks_appearance from "./20260426_100154_blocks_appearance";
import * as migration_20260426_101837_blocks_extras from "./20260426_101837_blocks_extras";
import * as migration_20260426_133404_newsletter from "./20260426_133404_newsletter";
import * as migration_20260426_140527_admin_polish from "./20260426_140527_admin_polish";
import * as migration_20260426_141236_rbac_roles from "./20260426_141236_rbac_roles";
import * as migration_20260427_090535_rbac_seo_tags_authors from "./20260427_090535_rbac_seo_tags_authors";
import * as migration_20260427_142717_split_settings_and_seo_and_enrich_brand from "./20260427_142717_split_settings_and_seo_and_enrich_brand";
import * as migration_20260427_150012_custom_css_and_variants from "./20260427_150012_custom_css_and_variants";
import * as migration_20260427_172135_brand_v3_full_palette from "./20260427_172135_brand_v3_full_palette";
import * as migration_20260428_110401_coreo_collections from "./20260428_110401_coreo_collections";
import * as migration_20260428_123825_simplify_products_drop_categories from "./20260428_123825_simplify_products_drop_categories";

export const migrations = [
  {
    up: migration_20260426_090854_initial.up,
    down: migration_20260426_090854_initial.down,
    name: "20260426_090854_initial",
  },
  {
    up: migration_20260426_091844_brand.up,
    down: migration_20260426_091844_brand.down,
    name: "20260426_091844_brand",
  },
  {
    up: migration_20260426_092936_redirects.up,
    down: migration_20260426_092936_redirects.down,
    name: "20260426_092936_redirects",
  },
  {
    up: migration_20260426_100154_blocks_appearance.up,
    down: migration_20260426_100154_blocks_appearance.down,
    name: "20260426_100154_blocks_appearance",
  },
  {
    up: migration_20260426_101837_blocks_extras.up,
    down: migration_20260426_101837_blocks_extras.down,
    name: "20260426_101837_blocks_extras",
  },
  {
    up: migration_20260426_133404_newsletter.up,
    down: migration_20260426_133404_newsletter.down,
    name: "20260426_133404_newsletter",
  },
  {
    up: migration_20260426_140527_admin_polish.up,
    down: migration_20260426_140527_admin_polish.down,
    name: "20260426_140527_admin_polish",
  },
  {
    up: migration_20260426_141236_rbac_roles.up,
    down: migration_20260426_141236_rbac_roles.down,
    name: "20260426_141236_rbac_roles",
  },
  {
    up: migration_20260427_090535_rbac_seo_tags_authors.up,
    down: migration_20260427_090535_rbac_seo_tags_authors.down,
    name: "20260427_090535_rbac_seo_tags_authors",
  },
  {
    up: migration_20260427_142717_split_settings_and_seo_and_enrich_brand.up,
    down: migration_20260427_142717_split_settings_and_seo_and_enrich_brand.down,
    name: "20260427_142717_split_settings_and_seo_and_enrich_brand",
  },
  {
    up: migration_20260427_150012_custom_css_and_variants.up,
    down: migration_20260427_150012_custom_css_and_variants.down,
    name: "20260427_150012_custom_css_and_variants",
  },
  {
    up: migration_20260427_172135_brand_v3_full_palette.up,
    down: migration_20260427_172135_brand_v3_full_palette.down,
    name: "20260427_172135_brand_v3_full_palette",
  },
  {
    up: migration_20260428_110401_coreo_collections.up,
    down: migration_20260428_110401_coreo_collections.down,
    name: "20260428_110401_coreo_collections",
  },
  {
    up: migration_20260428_123825_simplify_products_drop_categories.up,
    down: migration_20260428_123825_simplify_products_drop_categories.down,
    name: "20260428_123825_simplify_products_drop_categories",
  },
];
