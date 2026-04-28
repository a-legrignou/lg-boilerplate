import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_seo_organization_contact_type" AS ENUM('customer support', 'sales', 'press', 'recruitment');
  CREATE TYPE "public"."enum_brand_preset" AS ENUM('custom', 'modern', 'editorial', 'bold', 'minimal', 'warm');
  CREATE TYPE "public"."enum_brand_font_heading" AS ENUM('Inter', 'Manrope', 'Geist', 'DM Sans', 'Plus Jakarta Sans', 'Outfit', 'Space Grotesk', 'Lora', 'Playfair Display', 'Merriweather', 'Cormorant Garamond', 'system');
  CREATE TYPE "public"."enum_brand_font_body" AS ENUM('Inter', 'Manrope', 'Geist', 'DM Sans', 'Plus Jakarta Sans', 'Outfit', 'Space Grotesk', 'Lora', 'Source Serif Pro', 'system');
  CREATE TYPE "public"."enum_brand_font_mono" AS ENUM('JetBrains Mono', 'Geist Mono', 'IBM Plex Mono', 'Fira Code', 'system');
  ALTER TYPE "public"."enum_brand_radius" ADD VALUE 'xl';
  ALTER TYPE "public"."enum_brand_radius" ADD VALUE 'full';
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"legal_entity_name" varchar,
  	"legal_registration_number" varchar,
  	"legal_vat_number" varchar,
  	"legal_capital" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_locales" (
  	"site_name" varchar NOT NULL,
  	"site_description" varchar,
  	"site_tagline" varchar,
  	"contact_address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "seo_sitemap_exclude" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pattern" varchar NOT NULL
  );
  
  CREATE TABLE "seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_og_image_id" integer,
  	"favicon_id" integer,
  	"social_twitter" varchar,
  	"social_github" varchar,
  	"social_linkedin" varchar,
  	"social_instagram" varchar,
  	"social_facebook" varchar,
  	"social_youtube" varchar,
  	"social_mastodon" varchar,
  	"organization_legal_name" varchar,
  	"organization_founding_date" timestamp(3) with time zone,
  	"organization_contact_email" varchar,
  	"organization_contact_phone" varchar,
  	"organization_contact_type" "enum_seo_organization_contact_type" DEFAULT 'customer support',
  	"verifications_google" varchar,
  	"verifications_bing" varchar,
  	"verifications_yandex" varchar,
  	"verifications_pinterest" varchar,
  	"robots_extra" varchar,
  	"analytics_plausible_domain" varchar,
  	"analytics_plausible_script" varchar,
  	"analytics_gtm_id" varchar,
  	"analytics_ga4_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_locales" (
  	"title_template" varchar DEFAULT '%s — %siteName%',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  ALTER TABLE "brand" ADD COLUMN "preset" "enum_brand_preset" DEFAULT 'modern';
  ALTER TABLE "brand" ADD COLUMN "primary" varchar DEFAULT '#6366f1';
  ALTER TABLE "brand" ADD COLUMN "accent" varchar DEFAULT '#22d3ee';
  ALTER TABLE "brand" ADD COLUMN "secondary" varchar DEFAULT '#a855f7';
  ALTER TABLE "brand" ADD COLUMN "neutral" varchar DEFAULT '#64748b';
  ALTER TABLE "brand" ADD COLUMN "background" varchar DEFAULT '#ffffff';
  ALTER TABLE "brand" ADD COLUMN "foreground" varchar DEFAULT '#0f172a';
  ALTER TABLE "brand" ADD COLUMN "success" varchar DEFAULT '#10b981';
  ALTER TABLE "brand" ADD COLUMN "warning" varchar DEFAULT '#f59e0b';
  ALTER TABLE "brand" ADD COLUMN "danger" varchar DEFAULT '#ef4444';
  ALTER TABLE "brand" ADD COLUMN "dark_mode_background" varchar DEFAULT '#0a0a0a';
  ALTER TABLE "brand" ADD COLUMN "dark_mode_foreground" varchar DEFAULT '#fafafa';
  ALTER TABLE "brand" ADD COLUMN "font_heading" "enum_brand_font_heading" DEFAULT 'Inter';
  ALTER TABLE "brand" ADD COLUMN "font_body" "enum_brand_font_body" DEFAULT 'Inter';
  ALTER TABLE "brand" ADD COLUMN "font_mono" "enum_brand_font_mono" DEFAULT 'JetBrains Mono';
  ALTER TABLE "brand" ADD COLUMN "logo_light_id" integer;
  ALTER TABLE "brand" ADD COLUMN "logo_dark_id" integer;
  ALTER TABLE "brand" ADD COLUMN "logo_text" varchar;
  ALTER TABLE "settings_locales" ADD CONSTRAINT "settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_sitemap_exclude" ADD CONSTRAINT "seo_sitemap_exclude_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo" ADD CONSTRAINT "seo_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_locales" ADD CONSTRAINT "seo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "settings_locales_locale_parent_id_unique" ON "settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "seo_sitemap_exclude_order_idx" ON "seo_sitemap_exclude" USING btree ("_order");
  CREATE INDEX "seo_sitemap_exclude_parent_id_idx" ON "seo_sitemap_exclude" USING btree ("_parent_id");
  CREATE INDEX "seo_default_og_image_idx" ON "seo" USING btree ("default_og_image_id");
  CREATE INDEX "seo_favicon_idx" ON "seo" USING btree ("favicon_id");
  CREATE UNIQUE INDEX "seo_locales_locale_parent_id_unique" ON "seo_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "brand" ADD CONSTRAINT "brand_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brand" ADD CONSTRAINT "brand_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "brand_logo_light_idx" ON "brand" USING btree ("logo_light_id");
  CREATE INDEX "brand_logo_dark_idx" ON "brand" USING btree ("logo_dark_id");
  ALTER TABLE "brand" DROP COLUMN "primary_color";
  ALTER TABLE "brand" DROP COLUMN "accent_color";
  ALTER TABLE "brand" DROP COLUMN "font_preset";
  DROP TYPE "public"."enum_brand_font_preset";`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_brand_font_preset" AS ENUM('sans', 'serif', 'mono');
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"default_og_image_id" integer,
  	"social_twitter" varchar,
  	"social_github" varchar,
  	"social_linkedin" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_name" varchar NOT NULL,
  	"site_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seo_sitemap_exclude" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seo" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "seo_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "settings_locales" CASCADE;
  DROP TABLE "seo_sitemap_exclude" CASCADE;
  DROP TABLE "seo" CASCADE;
  DROP TABLE "seo_locales" CASCADE;
  ALTER TABLE "brand" DROP CONSTRAINT "brand_logo_light_id_media_id_fk";
  
  ALTER TABLE "brand" DROP CONSTRAINT "brand_logo_dark_id_media_id_fk";
  
  ALTER TABLE "brand" ALTER COLUMN "radius" SET DATA TYPE text;
  ALTER TABLE "brand" ALTER COLUMN "radius" SET DEFAULT 'md'::text;
  DROP TYPE "public"."enum_brand_radius";
  CREATE TYPE "public"."enum_brand_radius" AS ENUM('none', 'sm', 'md', 'lg');
  ALTER TABLE "brand" ALTER COLUMN "radius" SET DEFAULT 'md'::"public"."enum_brand_radius";
  ALTER TABLE "brand" ALTER COLUMN "radius" SET DATA TYPE "public"."enum_brand_radius" USING "radius"::"public"."enum_brand_radius";
  DROP INDEX "brand_logo_light_idx";
  DROP INDEX "brand_logo_dark_idx";
  ALTER TABLE "brand" ADD COLUMN "primary_color" varchar DEFAULT '#6366f1';
  ALTER TABLE "brand" ADD COLUMN "accent_color" varchar DEFAULT '#22d3ee';
  ALTER TABLE "brand" ADD COLUMN "font_preset" "enum_brand_font_preset" DEFAULT 'sans';
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "brand" DROP COLUMN "preset";
  ALTER TABLE "brand" DROP COLUMN "primary";
  ALTER TABLE "brand" DROP COLUMN "accent";
  ALTER TABLE "brand" DROP COLUMN "secondary";
  ALTER TABLE "brand" DROP COLUMN "neutral";
  ALTER TABLE "brand" DROP COLUMN "background";
  ALTER TABLE "brand" DROP COLUMN "foreground";
  ALTER TABLE "brand" DROP COLUMN "success";
  ALTER TABLE "brand" DROP COLUMN "warning";
  ALTER TABLE "brand" DROP COLUMN "danger";
  ALTER TABLE "brand" DROP COLUMN "dark_mode_background";
  ALTER TABLE "brand" DROP COLUMN "dark_mode_foreground";
  ALTER TABLE "brand" DROP COLUMN "font_heading";
  ALTER TABLE "brand" DROP COLUMN "font_body";
  ALTER TABLE "brand" DROP COLUMN "font_mono";
  ALTER TABLE "brand" DROP COLUMN "logo_light_id";
  ALTER TABLE "brand" DROP COLUMN "logo_dark_id";
  ALTER TABLE "brand" DROP COLUMN "logo_text";
  DROP TYPE "public"."enum_seo_organization_contact_type";
  DROP TYPE "public"."enum_brand_preset";
  DROP TYPE "public"."enum_brand_font_heading";
  DROP TYPE "public"."enum_brand_font_body";
  DROP TYPE "public"."enum_brand_font_mono";`);
}
