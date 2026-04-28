import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_features_variant" AS ENUM('grid', 'grid-4', 'list', 'cards');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('centered', 'banner', 'card');
  CREATE TYPE "public"."enum_pages_blocks_features_2_variant" AS ENUM('grid', 'grid-4', 'list', 'cards');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_variant" AS ENUM('centered', 'banner', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_features_variant" AS ENUM('grid', 'grid-4', 'list', 'cards');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('centered', 'banner', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_features_2_variant" AS ENUM('grid', 'grid-4', 'list', 'cards');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_variant" AS ENUM('centered', 'banner', 'card');
  CREATE TYPE "public"."enum_snippets_blocks_features_variant" AS ENUM('grid', 'grid-4', 'list', 'cards');
  CREATE TYPE "public"."enum_snippets_blocks_cta_variant" AS ENUM('centered', 'banner', 'card');
  CREATE TYPE "public"."enum_snippets_blocks_features_2_variant" AS ENUM('grid', 'grid-4', 'list', 'cards');
  CREATE TYPE "public"."enum_snippets_blocks_cta_2_variant" AS ENUM('centered', 'banner', 'card');
  ALTER TABLE "pages_blocks_features" ADD COLUMN "variant" "enum_pages_blocks_features_variant" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "variant" "enum_pages_blocks_cta_variant" DEFAULT 'centered';
  ALTER TABLE "pages_blocks_features_2" ADD COLUMN "variant" "enum_pages_blocks_features_2_variant" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_cta_2" ADD COLUMN "variant" "enum_pages_blocks_cta_2_variant" DEFAULT 'centered';
  ALTER TABLE "pages" ADD COLUMN "custom_css" varchar;
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "variant" "enum__pages_v_blocks_features_variant" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'centered';
  ALTER TABLE "_pages_v_blocks_features_2" ADD COLUMN "variant" "enum__pages_v_blocks_features_2_variant" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_cta_2" ADD COLUMN "variant" "enum__pages_v_blocks_cta_2_variant" DEFAULT 'centered';
  ALTER TABLE "_pages_v" ADD COLUMN "version_custom_css" varchar;
  ALTER TABLE "snippets_blocks_features" ADD COLUMN "variant" "enum_snippets_blocks_features_variant" DEFAULT 'grid';
  ALTER TABLE "snippets_blocks_cta" ADD COLUMN "variant" "enum_snippets_blocks_cta_variant" DEFAULT 'centered';
  ALTER TABLE "snippets_blocks_features_2" ADD COLUMN "variant" "enum_snippets_blocks_features_2_variant" DEFAULT 'grid';
  ALTER TABLE "snippets_blocks_cta_2" ADD COLUMN "variant" "enum_snippets_blocks_cta_2_variant" DEFAULT 'centered';
  ALTER TABLE "brand" ADD COLUMN "custom_css" varchar;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_features" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_features_2" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_cta_2" DROP COLUMN "variant";
  ALTER TABLE "pages" DROP COLUMN "custom_css";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_features_2" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_cta_2" DROP COLUMN "variant";
  ALTER TABLE "_pages_v" DROP COLUMN "version_custom_css";
  ALTER TABLE "snippets_blocks_features" DROP COLUMN "variant";
  ALTER TABLE "snippets_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "snippets_blocks_features_2" DROP COLUMN "variant";
  ALTER TABLE "snippets_blocks_cta_2" DROP COLUMN "variant";
  ALTER TABLE "brand" DROP COLUMN "custom_css";
  DROP TYPE "public"."enum_pages_blocks_features_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_features_2_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_2_variant";
  DROP TYPE "public"."enum__pages_v_blocks_features_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_features_2_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_variant";
  DROP TYPE "public"."enum_snippets_blocks_features_variant";
  DROP TYPE "public"."enum_snippets_blocks_cta_variant";
  DROP TYPE "public"."enum_snippets_blocks_features_2_variant";
  DROP TYPE "public"."enum_snippets_blocks_cta_2_variant";`);
}
