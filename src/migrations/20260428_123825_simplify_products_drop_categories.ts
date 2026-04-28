import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "_products_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "post_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_audience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_audience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_benefits" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "post_categories_locales" CASCADE;
  DROP TABLE "products_audience" CASCADE;
  DROP TABLE "products_benefits" CASCADE;
  DROP TABLE "_products_v_version_audience" CASCADE;
  DROP TABLE "_products_v_version_benefits" CASCADE;
  ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_category_id_post_categories_id_fk";

  ALTER TABLE "_posts_v" DROP CONSTRAINT IF EXISTS "_posts_v_version_category_id_post_categories_id_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_post_categories_fk";

  DROP INDEX IF EXISTS "posts_category_idx";
  DROP INDEX IF EXISTS "_posts_v_version_version_category_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_post_categories_id_idx";
  ALTER TABLE "products_tags" ADD CONSTRAINT "products_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_tags" ADD CONSTRAINT "_products_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_tags_order_idx" ON "products_tags" USING btree ("_order");
  CREATE INDEX "products_tags_parent_id_idx" ON "products_tags" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_tags_order_idx" ON "_products_v_version_tags" USING btree ("_order");
  CREATE INDEX "_products_v_version_tags_parent_id_idx" ON "_products_v_version_tags" USING btree ("_parent_id");
  ALTER TABLE "posts" DROP COLUMN "category_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_category_id";
  ALTER TABLE "products" DROP COLUMN "category";
  ALTER TABLE "products_locales" DROP COLUMN "why";
  ALTER TABLE "products_locales" DROP COLUMN "how";
  ALTER TABLE "_products_v" DROP COLUMN "version_category";
  ALTER TABLE "_products_v_locales" DROP COLUMN "version_why";
  ALTER TABLE "_products_v_locales" DROP COLUMN "version_how";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "post_categories_id";
  DROP TYPE "public"."enum_products_audience";
  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum__products_v_version_audience";
  DROP TYPE "public"."enum__products_v_version_category";`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_audience" AS ENUM('leaders', 'tech', 'product', 'marketing', 'investors');
  CREATE TYPE "public"."enum_products_category" AS ENUM('none', 'consulting', 'training', 'audit', 'implementation', 'support');
  CREATE TYPE "public"."enum__products_v_version_audience" AS ENUM('leaders', 'tech', 'product', 'marketing', 'investors');
  CREATE TYPE "public"."enum__products_v_version_category" AS ENUM('none', 'consulting', 'training', 'audit', 'implementation', 'support');
  CREATE TABLE "post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer,
  	"noindex" boolean,
  	"canonical" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "post_categories_locales" (
  	"slug" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_audience" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_audience",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "_products_v_version_audience" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__products_v_version_audience",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_products_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "products_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_tags" CASCADE;
  DROP TABLE "_products_v_version_tags" CASCADE;
  ALTER TABLE "posts" ADD COLUMN "category_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "products" ADD COLUMN "category" "enum_products_category";
  ALTER TABLE "products_locales" ADD COLUMN "why" varchar;
  ALTER TABLE "products_locales" ADD COLUMN "how" jsonb;
  ALTER TABLE "_products_v" ADD COLUMN "version_category" "enum__products_v_version_category";
  ALTER TABLE "_products_v_locales" ADD COLUMN "version_why" varchar;
  ALTER TABLE "_products_v_locales" ADD COLUMN "version_how" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_locales" ADD CONSTRAINT "post_categories_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_locales" ADD CONSTRAINT "post_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_audience" ADD CONSTRAINT "products_audience_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_benefits" ADD CONSTRAINT "products_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_audience" ADD CONSTRAINT "_products_v_version_audience_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_benefits" ADD CONSTRAINT "_products_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "post_categories_cover_idx" ON "post_categories" USING btree ("cover_id");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "post_categories_slug_idx" ON "post_categories_locales" USING btree ("slug","_locale");
  CREATE INDEX "post_categories_meta_meta_image_idx" ON "post_categories_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "post_categories_locales_locale_parent_id_unique" ON "post_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_audience_order_idx" ON "products_audience" USING btree ("order");
  CREATE INDEX "products_audience_parent_idx" ON "products_audience" USING btree ("parent_id");
  CREATE INDEX "products_benefits_order_idx" ON "products_benefits" USING btree ("_order");
  CREATE INDEX "products_benefits_parent_id_idx" ON "products_benefits" USING btree ("_parent_id");
  CREATE INDEX "products_benefits_locale_idx" ON "products_benefits" USING btree ("_locale");
  CREATE INDEX "_products_v_version_audience_order_idx" ON "_products_v_version_audience" USING btree ("order");
  CREATE INDEX "_products_v_version_audience_parent_idx" ON "_products_v_version_audience" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_benefits_order_idx" ON "_products_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_products_v_version_benefits_parent_id_idx" ON "_products_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_benefits_locale_idx" ON "_products_v_version_benefits" USING btree ("_locale");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");`);
}
