import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_case_studies_client_size" AS ENUM('startup', 'sme', 'eti', 'enterprise', 'public');
  CREATE TYPE "public"."enum_case_studies_client_sector" AS ENUM('industry', 'services', 'tech', 'finance', 'health', 'public', 'defense', 'other');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_client_size" AS ENUM('startup', 'sme', 'eti', 'enterprise', 'public');
  CREATE TYPE "public"."enum__case_studies_v_version_client_sector" AS ENUM('industry', 'services', 'tech', 'finance', 'health', 'public', 'defense', 'other');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_products_audience" AS ENUM('leaders', 'tech', 'product', 'marketing', 'investors');
  CREATE TYPE "public"."enum_products_category" AS ENUM('none', 'consulting', 'training', 'audit', 'implementation', 'support');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_audience" AS ENUM('leaders', 'tech', 'product', 'marketing', 'investors');
  CREATE TYPE "public"."enum__products_v_version_category" AS ENUM('none', 'consulting', 'training', 'audit', 'implementation', 'support');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_team_member_type" AS ENUM('associate', 'employee', 'advisor', 'expert');
  CREATE TYPE "public"."enum_team_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_v_version_member_type" AS ENUM('associate', 'employee', 'advisor', 'expert');
  CREATE TYPE "public"."enum__team_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_v_published_locale" AS ENUM('fr', 'en');
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
  
  CREATE TABLE "case_studies_kpis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "case_studies_context_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "case_studies_challenge_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "case_studies_approach_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "case_studies_results_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"cover_id" integer,
  	"noindex" boolean,
  	"canonical" varchar,
  	"client_size" "enum_case_studies_client_size",
  	"client_sector" "enum_case_studies_client_sector",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_locales" (
  	"slug" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"excerpt" varchar,
  	"context_heading" varchar,
  	"context_description" varchar,
  	"challenge_heading" varchar,
  	"challenge_description" varchar,
  	"approach_heading" varchar,
  	"approach_description" varchar,
  	"results_heading" varchar,
  	"results_description" varchar,
  	"conclusion" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_case_studies_v_version_kpis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_context_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_challenge_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_approach_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_results_takeaways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_cover_id" integer,
  	"version_noindex" boolean,
  	"version_canonical" varchar,
  	"version_client_size" "enum__case_studies_v_version_client_size",
  	"version_client_sector" "enum__case_studies_v_version_client_sector",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__case_studies_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_case_studies_v_locales" (
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_excerpt" varchar,
  	"version_context_heading" varchar,
  	"version_context_description" varchar,
  	"version_challenge_heading" varchar,
  	"version_challenge_description" varchar,
  	"version_approach_heading" varchar,
  	"version_approach_description" varchar,
  	"version_results_heading" varchar,
  	"version_results_description" varchar,
  	"version_conclusion" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
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
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer,
  	"noindex" boolean,
  	"canonical" varchar,
  	"category" "enum_products_category",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"slug" varchar,
  	"title" varchar,
  	"excerpt" varchar,
  	"description" jsonb,
  	"duration" varchar,
  	"pricing" varchar,
  	"why" varchar,
  	"how" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_id" integer,
  	"version_noindex" boolean,
  	"version_canonical" varchar,
  	"version_category" "enum__products_v_version_category",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_description" jsonb,
  	"version_duration" varchar,
  	"version_pricing" varchar,
  	"version_why" varchar,
  	"version_how" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"noindex" boolean,
  	"canonical" varchar,
  	"name" varchar,
  	"member_type" "enum_team_member_type" DEFAULT 'employee',
  	"email" varchar,
  	"socials_linkedin" varchar,
  	"socials_twitter" varchar,
  	"socials_github" varchar,
  	"socials_website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "team_locales" (
  	"slug" varchar,
  	"role" varchar,
  	"short_bio" varchar,
  	"bio" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_team_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_avatar_id" integer,
  	"version_noindex" boolean,
  	"version_canonical" varchar,
  	"version_name" varchar,
  	"version_member_type" "enum__team_v_version_member_type" DEFAULT 'employee',
  	"version_email" varchar,
  	"version_socials_linkedin" varchar,
  	"version_socials_twitter" varchar,
  	"version_socials_github" varchar,
  	"version_socials_website" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__team_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_team_v_locales" (
  	"version_slug" varchar,
  	"version_role" varchar,
  	"version_short_bio" varchar,
  	"version_bio" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "posts" ADD COLUMN "category_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "redirects_rels" ADD COLUMN "team_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_id" integer;
  ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_locales" ADD CONSTRAINT "post_categories_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_locales" ADD CONSTRAINT "post_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_kpis" ADD CONSTRAINT "case_studies_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_context_takeaways" ADD CONSTRAINT "case_studies_context_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_challenge_takeaways" ADD CONSTRAINT "case_studies_challenge_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_approach_takeaways" ADD CONSTRAINT "case_studies_approach_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_results_takeaways" ADD CONSTRAINT "case_studies_results_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_kpis" ADD CONSTRAINT "_case_studies_v_version_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_context_takeaways" ADD CONSTRAINT "_case_studies_v_version_context_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_challenge_takeaways" ADD CONSTRAINT "_case_studies_v_version_challenge_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_approach_takeaways" ADD CONSTRAINT "_case_studies_v_version_approach_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_results_takeaways" ADD CONSTRAINT "_case_studies_v_version_results_takeaways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_locales" ADD CONSTRAINT "_case_studies_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_locales" ADD CONSTRAINT "_case_studies_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_audience" ADD CONSTRAINT "products_audience_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_benefits" ADD CONSTRAINT "products_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_audience" ADD CONSTRAINT "_products_v_version_audience_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_benefits" ADD CONSTRAINT "_products_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_locales" ADD CONSTRAINT "team_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_locales" ADD CONSTRAINT "team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_v" ADD CONSTRAINT "_team_v_parent_id_team_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v" ADD CONSTRAINT "_team_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v_locales" ADD CONSTRAINT "_team_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v_locales" ADD CONSTRAINT "_team_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "post_categories_cover_idx" ON "post_categories" USING btree ("cover_id");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "post_categories_slug_idx" ON "post_categories_locales" USING btree ("slug","_locale");
  CREATE INDEX "post_categories_meta_meta_image_idx" ON "post_categories_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "post_categories_locales_locale_parent_id_unique" ON "post_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "case_studies_kpis_order_idx" ON "case_studies_kpis" USING btree ("_order");
  CREATE INDEX "case_studies_kpis_parent_id_idx" ON "case_studies_kpis" USING btree ("_parent_id");
  CREATE INDEX "case_studies_kpis_locale_idx" ON "case_studies_kpis" USING btree ("_locale");
  CREATE INDEX "case_studies_context_takeaways_order_idx" ON "case_studies_context_takeaways" USING btree ("_order");
  CREATE INDEX "case_studies_context_takeaways_parent_id_idx" ON "case_studies_context_takeaways" USING btree ("_parent_id");
  CREATE INDEX "case_studies_context_takeaways_locale_idx" ON "case_studies_context_takeaways" USING btree ("_locale");
  CREATE INDEX "case_studies_challenge_takeaways_order_idx" ON "case_studies_challenge_takeaways" USING btree ("_order");
  CREATE INDEX "case_studies_challenge_takeaways_parent_id_idx" ON "case_studies_challenge_takeaways" USING btree ("_parent_id");
  CREATE INDEX "case_studies_challenge_takeaways_locale_idx" ON "case_studies_challenge_takeaways" USING btree ("_locale");
  CREATE INDEX "case_studies_approach_takeaways_order_idx" ON "case_studies_approach_takeaways" USING btree ("_order");
  CREATE INDEX "case_studies_approach_takeaways_parent_id_idx" ON "case_studies_approach_takeaways" USING btree ("_parent_id");
  CREATE INDEX "case_studies_approach_takeaways_locale_idx" ON "case_studies_approach_takeaways" USING btree ("_locale");
  CREATE INDEX "case_studies_results_takeaways_order_idx" ON "case_studies_results_takeaways" USING btree ("_order");
  CREATE INDEX "case_studies_results_takeaways_parent_id_idx" ON "case_studies_results_takeaways" USING btree ("_parent_id");
  CREATE INDEX "case_studies_results_takeaways_locale_idx" ON "case_studies_results_takeaways" USING btree ("_locale");
  CREATE INDEX "case_studies_cover_idx" ON "case_studies" USING btree ("cover_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies_locales" USING btree ("slug","_locale");
  CREATE INDEX "case_studies_meta_meta_image_idx" ON "case_studies_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "case_studies_locales_locale_parent_id_unique" ON "case_studies_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_case_studies_v_version_kpis_order_idx" ON "_case_studies_v_version_kpis" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_kpis_parent_id_idx" ON "_case_studies_v_version_kpis" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_kpis_locale_idx" ON "_case_studies_v_version_kpis" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_version_context_takeaways_order_idx" ON "_case_studies_v_version_context_takeaways" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_context_takeaways_parent_id_idx" ON "_case_studies_v_version_context_takeaways" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_context_takeaways_locale_idx" ON "_case_studies_v_version_context_takeaways" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_version_challenge_takeaways_order_idx" ON "_case_studies_v_version_challenge_takeaways" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_challenge_takeaways_parent_id_idx" ON "_case_studies_v_version_challenge_takeaways" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_challenge_takeaways_locale_idx" ON "_case_studies_v_version_challenge_takeaways" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_version_approach_takeaways_order_idx" ON "_case_studies_v_version_approach_takeaways" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_approach_takeaways_parent_id_idx" ON "_case_studies_v_version_approach_takeaways" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_approach_takeaways_locale_idx" ON "_case_studies_v_version_approach_takeaways" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_version_results_takeaways_order_idx" ON "_case_studies_v_version_results_takeaways" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_results_takeaways_parent_id_idx" ON "_case_studies_v_version_results_takeaways" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_results_takeaways_locale_idx" ON "_case_studies_v_version_results_takeaways" USING btree ("_locale");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_cover_idx" ON "_case_studies_v" USING btree ("version_cover_id");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_snapshot_idx" ON "_case_studies_v" USING btree ("snapshot");
  CREATE INDEX "_case_studies_v_published_locale_idx" ON "_case_studies_v" USING btree ("published_locale");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_autosave_idx" ON "_case_studies_v" USING btree ("autosave");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_case_studies_v_version_meta_version_meta_image_idx" ON "_case_studies_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_case_studies_v_locales_locale_parent_id_unique" ON "_case_studies_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_audience_order_idx" ON "products_audience" USING btree ("order");
  CREATE INDEX "products_audience_parent_idx" ON "products_audience" USING btree ("parent_id");
  CREATE INDEX "products_benefits_order_idx" ON "products_benefits" USING btree ("_order");
  CREATE INDEX "products_benefits_parent_id_idx" ON "products_benefits" USING btree ("_parent_id");
  CREATE INDEX "products_benefits_locale_idx" ON "products_benefits" USING btree ("_locale");
  CREATE INDEX "products_cover_idx" ON "products" USING btree ("cover_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_audience_order_idx" ON "_products_v_version_audience" USING btree ("order");
  CREATE INDEX "_products_v_version_audience_parent_idx" ON "_products_v_version_audience" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_benefits_order_idx" ON "_products_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_products_v_version_benefits_parent_id_idx" ON "_products_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_benefits_locale_idx" ON "_products_v_version_benefits" USING btree ("_locale");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_cover_idx" ON "_products_v" USING btree ("version_cover_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_avatar_idx" ON "team" USING btree ("avatar_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE INDEX "team__status_idx" ON "team" USING btree ("_status");
  CREATE UNIQUE INDEX "team_slug_idx" ON "team_locales" USING btree ("slug","_locale");
  CREATE INDEX "team_meta_meta_image_idx" ON "team_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "team_locales_locale_parent_id_unique" ON "team_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_team_v_parent_idx" ON "_team_v" USING btree ("parent_id");
  CREATE INDEX "_team_v_version_version_avatar_idx" ON "_team_v" USING btree ("version_avatar_id");
  CREATE INDEX "_team_v_version_version_updated_at_idx" ON "_team_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_v_version_version_created_at_idx" ON "_team_v" USING btree ("version_created_at");
  CREATE INDEX "_team_v_version_version__status_idx" ON "_team_v" USING btree ("version__status");
  CREATE INDEX "_team_v_created_at_idx" ON "_team_v" USING btree ("created_at");
  CREATE INDEX "_team_v_updated_at_idx" ON "_team_v" USING btree ("updated_at");
  CREATE INDEX "_team_v_snapshot_idx" ON "_team_v" USING btree ("snapshot");
  CREATE INDEX "_team_v_published_locale_idx" ON "_team_v" USING btree ("published_locale");
  CREATE INDEX "_team_v_latest_idx" ON "_team_v" USING btree ("latest");
  CREATE INDEX "_team_v_autosave_idx" ON "_team_v" USING btree ("autosave");
  CREATE INDEX "_team_v_version_version_slug_idx" ON "_team_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_team_v_version_meta_version_meta_image_idx" ON "_team_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_team_v_locales_locale_parent_id_unique" ON "_team_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "redirects_rels_case_studies_id_idx" ON "redirects_rels" USING btree ("case_studies_id");
  CREATE INDEX "redirects_rels_products_id_idx" ON "redirects_rels" USING btree ("products_id");
  CREATE INDEX "redirects_rels_team_id_idx" ON "redirects_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_kpis" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_context_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_challenge_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_approach_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_results_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_kpis" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_context_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_challenge_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_approach_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_results_takeaways" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_audience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_audience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_team_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "post_categories_locales" CASCADE;
  DROP TABLE "case_studies_kpis" CASCADE;
  DROP TABLE "case_studies_context_takeaways" CASCADE;
  DROP TABLE "case_studies_challenge_takeaways" CASCADE;
  DROP TABLE "case_studies_approach_takeaways" CASCADE;
  DROP TABLE "case_studies_results_takeaways" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_locales" CASCADE;
  DROP TABLE "_case_studies_v_version_kpis" CASCADE;
  DROP TABLE "_case_studies_v_version_context_takeaways" CASCADE;
  DROP TABLE "_case_studies_v_version_challenge_takeaways" CASCADE;
  DROP TABLE "_case_studies_v_version_approach_takeaways" CASCADE;
  DROP TABLE "_case_studies_v_version_results_takeaways" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_locales" CASCADE;
  DROP TABLE "products_audience" CASCADE;
  DROP TABLE "products_benefits" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "_products_v_version_audience" CASCADE;
  DROP TABLE "_products_v_version_benefits" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "team_locales" CASCADE;
  DROP TABLE "_team_v" CASCADE;
  DROP TABLE "_team_v_locales" CASCADE;
  ALTER TABLE "posts" DROP CONSTRAINT "posts_category_id_post_categories_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_case_studies_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_products_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_team_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_post_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_studies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_fk";
  
  DROP INDEX "posts_category_idx";
  DROP INDEX "_posts_v_version_version_category_idx";
  DROP INDEX "redirects_rels_case_studies_id_idx";
  DROP INDEX "redirects_rels_products_id_idx";
  DROP INDEX "redirects_rels_team_id_idx";
  DROP INDEX "payload_locked_documents_rels_post_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_case_studies_id_idx";
  DROP INDEX "payload_locked_documents_rels_products_id_idx";
  DROP INDEX "payload_locked_documents_rels_team_id_idx";
  ALTER TABLE "posts" DROP COLUMN "category_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_category_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "products_id";
  ALTER TABLE "redirects_rels" DROP COLUMN "team_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "products_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_id";
  DROP TYPE "public"."enum_case_studies_client_size";
  DROP TYPE "public"."enum_case_studies_client_sector";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_client_size";
  DROP TYPE "public"."enum__case_studies_v_version_client_sector";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum__case_studies_v_published_locale";
  DROP TYPE "public"."enum_products_audience";
  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_audience";
  DROP TYPE "public"."enum__products_v_version_category";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_team_member_type";
  DROP TYPE "public"."enum_team_status";
  DROP TYPE "public"."enum__team_v_version_member_type";
  DROP TYPE "public"."enum__team_v_version_status";
  DROP TYPE "public"."enum__team_v_published_locale";`);
}
