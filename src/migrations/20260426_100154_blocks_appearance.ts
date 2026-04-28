import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('centered', 'split');
  CREATE TYPE "public"."enum_pages_blocks_hero_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_hero_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_hero_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_hero_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_features_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_features_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_features_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_features_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_cta_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_cta_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_cta_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_cta_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_hero_2_variant" AS ENUM('centered', 'split');
  CREATE TYPE "public"."enum_pages_blocks_hero_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_hero_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_hero_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_hero_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_features_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_features_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_features_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_features_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_buttons_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_group_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_group_gap" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_group_align" AS ENUM('start', 'center', 'stretch');
  CREATE TYPE "public"."enum_pages_blocks_group_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_group_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_group_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_group_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('centered', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_features_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_features_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_features_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_features_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_2_variant" AS ENUM('centered', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_features_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_features_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_features_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_features_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_buttons_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_group_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_group_gap" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_group_align" AS ENUM('start', 'center', 'stretch');
  CREATE TYPE "public"."enum__pages_v_blocks_group_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_group_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_group_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_group_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TABLE "pages_blocks_hero_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_2_variant" DEFAULT 'centered',
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"image_id" integer,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"appearance_background" "enum_pages_blocks_hero_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_hero_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_hero_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_hero_2_appearance_divider" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_2_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum_pages_blocks_features_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_features_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_features_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_features_2_appearance_divider" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_2_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum_pages_blocks_cta_2_buttons_variant" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"appearance_background" "enum_pages_blocks_cta_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_cta_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_cta_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_cta_2_appearance_divider" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"appearance_background" "enum_pages_blocks_rich_text_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_rich_text_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_rich_text_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_rich_text_2_appearance_divider" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_group_columns" DEFAULT '2',
  	"gap" "enum_pages_blocks_group_gap" DEFAULT 'md',
  	"align" "enum_pages_blocks_group_align" DEFAULT 'stretch',
  	"appearance_background" "enum_pages_blocks_group_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_group_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_group_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_group_appearance_divider" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_hero_2_variant" DEFAULT 'centered',
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"image_id" integer,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"appearance_background" "enum__pages_v_blocks_hero_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_hero_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_hero_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_hero_2_appearance_divider" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_2_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum__pages_v_blocks_features_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_features_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_features_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_features_2_appearance_divider" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_2_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"variant" "enum__pages_v_blocks_cta_2_buttons_variant" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"appearance_background" "enum__pages_v_blocks_cta_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_cta_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_cta_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_cta_2_appearance_divider" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"appearance_background" "enum__pages_v_blocks_rich_text_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_rich_text_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_rich_text_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_rich_text_2_appearance_divider" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_group_columns" DEFAULT '2',
  	"gap" "enum__pages_v_blocks_group_gap" DEFAULT 'md',
  	"align" "enum__pages_v_blocks_group_align" DEFAULT 'stretch',
  	"appearance_background" "enum__pages_v_blocks_group_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_group_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_group_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_group_appearance_divider" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "variant" "enum_pages_blocks_hero_variant" DEFAULT 'centered';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "appearance_background" "enum_pages_blocks_hero_appearance_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "appearance_padding" "enum_pages_blocks_hero_appearance_padding" DEFAULT 'md';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "appearance_max_width" "enum_pages_blocks_hero_appearance_max_width" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "appearance_divider" "enum_pages_blocks_hero_appearance_divider" DEFAULT 'none';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "appearance_background" "enum_pages_blocks_features_appearance_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "appearance_padding" "enum_pages_blocks_features_appearance_padding" DEFAULT 'md';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "appearance_max_width" "enum_pages_blocks_features_appearance_max_width" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "appearance_divider" "enum_pages_blocks_features_appearance_divider" DEFAULT 'none';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "appearance_background" "enum_pages_blocks_cta_appearance_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "appearance_padding" "enum_pages_blocks_cta_appearance_padding" DEFAULT 'md';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "appearance_max_width" "enum_pages_blocks_cta_appearance_max_width" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "appearance_divider" "enum_pages_blocks_cta_appearance_divider" DEFAULT 'none';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "appearance_background" "enum_pages_blocks_rich_text_appearance_background" DEFAULT 'default';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "appearance_padding" "enum_pages_blocks_rich_text_appearance_padding" DEFAULT 'md';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "appearance_max_width" "enum_pages_blocks_rich_text_appearance_max_width" DEFAULT 'normal';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "appearance_divider" "enum_pages_blocks_rich_text_appearance_divider" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'centered';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "appearance_background" "enum__pages_v_blocks_hero_appearance_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "appearance_padding" "enum__pages_v_blocks_hero_appearance_padding" DEFAULT 'md';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "appearance_max_width" "enum__pages_v_blocks_hero_appearance_max_width" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "appearance_divider" "enum__pages_v_blocks_hero_appearance_divider" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "appearance_background" "enum__pages_v_blocks_features_appearance_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "appearance_padding" "enum__pages_v_blocks_features_appearance_padding" DEFAULT 'md';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "appearance_max_width" "enum__pages_v_blocks_features_appearance_max_width" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "appearance_divider" "enum__pages_v_blocks_features_appearance_divider" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "appearance_background" "enum__pages_v_blocks_cta_appearance_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "appearance_padding" "enum__pages_v_blocks_cta_appearance_padding" DEFAULT 'md';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "appearance_max_width" "enum__pages_v_blocks_cta_appearance_max_width" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "appearance_divider" "enum__pages_v_blocks_cta_appearance_divider" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "appearance_background" "enum__pages_v_blocks_rich_text_appearance_background" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "appearance_padding" "enum__pages_v_blocks_rich_text_appearance_padding" DEFAULT 'md';
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "appearance_max_width" "enum__pages_v_blocks_rich_text_appearance_max_width" DEFAULT 'normal';
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "appearance_divider" "enum__pages_v_blocks_rich_text_appearance_divider" DEFAULT 'none';
  ALTER TABLE "pages_blocks_hero_2" ADD CONSTRAINT "pages_blocks_hero_2_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_2" ADD CONSTRAINT "pages_blocks_hero_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_2_items" ADD CONSTRAINT "pages_blocks_features_2_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_2" ADD CONSTRAINT "pages_blocks_features_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_2_buttons" ADD CONSTRAINT "pages_blocks_cta_2_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_2" ADD CONSTRAINT "pages_blocks_cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_2" ADD CONSTRAINT "pages_blocks_rich_text_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_group" ADD CONSTRAINT "pages_blocks_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_2" ADD CONSTRAINT "_pages_v_blocks_hero_2_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_2" ADD CONSTRAINT "_pages_v_blocks_hero_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_2_items" ADD CONSTRAINT "_pages_v_blocks_features_2_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_2" ADD CONSTRAINT "_pages_v_blocks_features_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_2_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_2_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_2" ADD CONSTRAINT "_pages_v_blocks_cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_2" ADD CONSTRAINT "_pages_v_blocks_rich_text_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_group" ADD CONSTRAINT "_pages_v_blocks_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_2_order_idx" ON "pages_blocks_hero_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_2_parent_id_idx" ON "pages_blocks_hero_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_2_path_idx" ON "pages_blocks_hero_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_2_locale_idx" ON "pages_blocks_hero_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_2_image_idx" ON "pages_blocks_hero_2" USING btree ("image_id");
  CREATE INDEX "pages_blocks_features_2_items_order_idx" ON "pages_blocks_features_2_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_2_items_parent_id_idx" ON "pages_blocks_features_2_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_2_items_locale_idx" ON "pages_blocks_features_2_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_features_2_order_idx" ON "pages_blocks_features_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_2_parent_id_idx" ON "pages_blocks_features_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_2_path_idx" ON "pages_blocks_features_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_2_locale_idx" ON "pages_blocks_features_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_2_buttons_order_idx" ON "pages_blocks_cta_2_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_2_buttons_parent_id_idx" ON "pages_blocks_cta_2_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_2_buttons_locale_idx" ON "pages_blocks_cta_2_buttons" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_2_order_idx" ON "pages_blocks_cta_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_2_parent_id_idx" ON "pages_blocks_cta_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_2_path_idx" ON "pages_blocks_cta_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_2_locale_idx" ON "pages_blocks_cta_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_rich_text_2_order_idx" ON "pages_blocks_rich_text_2" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_2_parent_id_idx" ON "pages_blocks_rich_text_2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_2_path_idx" ON "pages_blocks_rich_text_2" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_2_locale_idx" ON "pages_blocks_rich_text_2" USING btree ("_locale");
  CREATE INDEX "pages_blocks_group_order_idx" ON "pages_blocks_group" USING btree ("_order");
  CREATE INDEX "pages_blocks_group_parent_id_idx" ON "pages_blocks_group" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_group_path_idx" ON "pages_blocks_group" USING btree ("_path");
  CREATE INDEX "pages_blocks_group_locale_idx" ON "pages_blocks_group" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_2_order_idx" ON "_pages_v_blocks_hero_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_2_parent_id_idx" ON "_pages_v_blocks_hero_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_2_path_idx" ON "_pages_v_blocks_hero_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_2_locale_idx" ON "_pages_v_blocks_hero_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_2_image_idx" ON "_pages_v_blocks_hero_2" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_features_2_items_order_idx" ON "_pages_v_blocks_features_2_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_2_items_parent_id_idx" ON "_pages_v_blocks_features_2_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_2_items_locale_idx" ON "_pages_v_blocks_features_2_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_features_2_order_idx" ON "_pages_v_blocks_features_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_2_parent_id_idx" ON "_pages_v_blocks_features_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_2_path_idx" ON "_pages_v_blocks_features_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_2_locale_idx" ON "_pages_v_blocks_features_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_2_buttons_order_idx" ON "_pages_v_blocks_cta_2_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_2_buttons_parent_id_idx" ON "_pages_v_blocks_cta_2_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_2_buttons_locale_idx" ON "_pages_v_blocks_cta_2_buttons" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_2_order_idx" ON "_pages_v_blocks_cta_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_2_parent_id_idx" ON "_pages_v_blocks_cta_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_2_path_idx" ON "_pages_v_blocks_cta_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_2_locale_idx" ON "_pages_v_blocks_cta_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_rich_text_2_order_idx" ON "_pages_v_blocks_rich_text_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_2_parent_id_idx" ON "_pages_v_blocks_rich_text_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_2_path_idx" ON "_pages_v_blocks_rich_text_2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_2_locale_idx" ON "_pages_v_blocks_rich_text_2" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_group_order_idx" ON "_pages_v_blocks_group" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_group_parent_id_idx" ON "_pages_v_blocks_group" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_group_path_idx" ON "_pages_v_blocks_group" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_group_locale_idx" ON "_pages_v_blocks_group" USING btree ("_locale");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_2" CASCADE;
  DROP TABLE "pages_blocks_features_2_items" CASCADE;
  DROP TABLE "pages_blocks_features_2" CASCADE;
  DROP TABLE "pages_blocks_cta_2_buttons" CASCADE;
  DROP TABLE "pages_blocks_cta_2" CASCADE;
  DROP TABLE "pages_blocks_rich_text_2" CASCADE;
  DROP TABLE "pages_blocks_group" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_2" CASCADE;
  DROP TABLE "_pages_v_blocks_features_2_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features_2" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_2_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_2" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_2" CASCADE;
  DROP TABLE "_pages_v_blocks_group" CASCADE;
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "appearance_background";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "appearance_padding";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "appearance_max_width";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "appearance_divider";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "appearance_background";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "appearance_padding";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "appearance_max_width";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "appearance_divider";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "appearance_background";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "appearance_padding";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "appearance_max_width";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "appearance_divider";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "appearance_background";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "appearance_padding";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "appearance_max_width";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "appearance_divider";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "appearance_background";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "appearance_padding";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "appearance_max_width";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "appearance_divider";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "appearance_background";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "appearance_padding";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "appearance_max_width";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "appearance_divider";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "appearance_background";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "appearance_padding";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "appearance_max_width";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "appearance_divider";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "appearance_background";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "appearance_padding";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "appearance_max_width";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_hero_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_hero_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_hero_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_features_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_features_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_features_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_features_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_cta_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_cta_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_cta_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_cta_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_rich_text_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_rich_text_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_rich_text_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_rich_text_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_hero_2_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_2_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_hero_2_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_hero_2_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_hero_2_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_features_2_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_features_2_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_features_2_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_features_2_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_cta_2_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_2_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_cta_2_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_cta_2_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_cta_2_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_rich_text_2_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_rich_text_2_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_rich_text_2_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_rich_text_2_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_group_columns";
  DROP TYPE "public"."enum_pages_blocks_group_gap";
  DROP TYPE "public"."enum_pages_blocks_group_align";
  DROP TYPE "public"."enum_pages_blocks_group_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_group_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_group_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_group_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_hero_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_hero_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_hero_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_features_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_features_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_features_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_features_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_cta_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_cta_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_cta_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_hero_2_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_2_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_hero_2_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_hero_2_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_hero_2_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_features_2_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_features_2_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_features_2_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_features_2_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_2_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_2_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_2_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_2_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_group_columns";
  DROP TYPE "public"."enum__pages_v_blocks_group_gap";
  DROP TYPE "public"."enum__pages_v_blocks_group_align";
  DROP TYPE "public"."enum__pages_v_blocks_group_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_group_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_group_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_group_appearance_divider";`);
}
