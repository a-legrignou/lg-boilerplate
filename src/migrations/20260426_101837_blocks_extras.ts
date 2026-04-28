import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_text_align" AS ENUM('auto', 'left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_hero_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_features_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_cta_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_cta_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_hero_2_text_align" AS ENUM('auto', 'left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_hero_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_features_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_cta_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_logo_cloud_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_pricing_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_pricing_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_pricing_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_pricing_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_pricing_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_faq_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_faq_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_faq_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_faq_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_faq_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_stats_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_stats_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_stats_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_stats_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_stats_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_group_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_snippet_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_form_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_pages_blocks_form_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_form_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_pages_blocks_form_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_pages_blocks_form_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_text_align" AS ENUM('auto', 'left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_features_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_2_text_align" AS ENUM('auto', 'left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_features_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_cloud_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_group_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_snippet_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum__pages_v_blocks_form_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum__pages_v_blocks_form_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_form_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_form_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_form_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_hero_variant" AS ENUM('centered', 'split');
  CREATE TYPE "public"."enum_snippets_blocks_hero_text_align" AS ENUM('auto', 'left', 'center', 'right');
  CREATE TYPE "public"."enum_snippets_blocks_hero_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_hero_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_hero_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_hero_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_hero_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_features_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_features_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_features_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_features_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_features_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_cta_buttons_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_snippets_blocks_cta_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_snippets_blocks_cta_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_cta_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_cta_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_cta_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_cta_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_hero_2_variant" AS ENUM('centered', 'split');
  CREATE TYPE "public"."enum_snippets_blocks_hero_2_text_align" AS ENUM('auto', 'left', 'center', 'right');
  CREATE TYPE "public"."enum_snippets_blocks_hero_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_hero_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_hero_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_hero_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_hero_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_features_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_features_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_features_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_features_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_features_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_cta_2_buttons_variant" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_snippets_blocks_cta_2_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_snippets_blocks_cta_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_cta_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_cta_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_cta_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_cta_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_2_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_2_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_2_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_2_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_rich_text_2_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_logo_cloud_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_logo_cloud_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_logo_cloud_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_logo_cloud_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_logo_cloud_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_pricing_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_pricing_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_pricing_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_pricing_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_pricing_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_testimonials_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum_snippets_blocks_testimonials_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_testimonials_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_testimonials_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_testimonials_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_testimonials_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_faq_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_faq_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_faq_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_faq_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_faq_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_stats_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_stats_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_stats_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_stats_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_stats_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_snippets_blocks_group_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_snippets_blocks_group_gap" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_group_align" AS ENUM('start', 'center', 'stretch');
  CREATE TYPE "public"."enum_snippets_blocks_group_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_group_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_group_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_group_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_group_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TABLE "pages_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"appearance_background" "enum_pages_blocks_logo_cloud_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_logo_cloud_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_logo_cloud_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_logo_cloud_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_pages_blocks_logo_cloud_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"period" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"highlighted" boolean
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum_pages_blocks_pricing_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_pricing_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_pricing_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_pricing_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_pages_blocks_pricing_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_role" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_pages_blocks_testimonials_columns" DEFAULT '3',
  	"appearance_background" "enum_pages_blocks_testimonials_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_testimonials_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_testimonials_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_testimonials_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_pages_blocks_testimonials_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Questions fréquentes',
  	"appearance_background" "enum_pages_blocks_faq_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_faq_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_faq_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_faq_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_pages_blocks_faq_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"suffix" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum_pages_blocks_stats_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_stats_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_stats_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_stats_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_pages_blocks_stats_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_snippet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"snippet_id" integer,
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_pages_blocks_snippet_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"heading" varchar,
  	"description" varchar,
  	"appearance_background" "enum_pages_blocks_form_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_pages_blocks_form_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_pages_blocks_form_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_pages_blocks_form_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_pages_blocks_form_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"appearance_background" "enum__pages_v_blocks_logo_cloud_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_logo_cloud_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_logo_cloud_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_logo_cloud_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum__pages_v_blocks_logo_cloud_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"period" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"highlighted" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum__pages_v_blocks_pricing_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_pricing_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_pricing_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_pricing_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum__pages_v_blocks_pricing_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_role" varchar,
  	"avatar_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum__pages_v_blocks_testimonials_columns" DEFAULT '3',
  	"appearance_background" "enum__pages_v_blocks_testimonials_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_testimonials_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_testimonials_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_testimonials_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum__pages_v_blocks_testimonials_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Questions fréquentes',
  	"appearance_background" "enum__pages_v_blocks_faq_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_faq_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_faq_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_faq_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum__pages_v_blocks_faq_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"suffix" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum__pages_v_blocks_stats_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_stats_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_stats_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_stats_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum__pages_v_blocks_stats_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_snippet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"snippet_id" integer,
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum__pages_v_blocks_snippet_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"heading" varchar,
  	"description" varchar,
  	"appearance_background" "enum__pages_v_blocks_form_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum__pages_v_blocks_form_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum__pages_v_blocks_form_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum__pages_v_blocks_form_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum__pages_v_blocks_form_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_snippets_blocks_hero_variant" DEFAULT 'centered',
  	"text_align" "enum_snippets_blocks_hero_text_align" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"image_id" integer,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"appearance_background" "enum_snippets_blocks_hero_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_hero_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_hero_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_hero_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_hero_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "snippets_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum_snippets_blocks_features_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_features_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_features_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_features_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_features_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"variant" "enum_snippets_blocks_cta_buttons_variant" DEFAULT 'default'
  );
  
  CREATE TABLE "snippets_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_align" "enum_snippets_blocks_cta_text_align" DEFAULT 'center',
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"appearance_background" "enum_snippets_blocks_cta_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_cta_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_cta_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_cta_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_cta_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"appearance_background" "enum_snippets_blocks_rich_text_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_rich_text_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_rich_text_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_rich_text_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_rich_text_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_hero_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_snippets_blocks_hero_2_variant" DEFAULT 'centered',
  	"text_align" "enum_snippets_blocks_hero_2_text_align" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"image_id" integer,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"appearance_background" "enum_snippets_blocks_hero_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_hero_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_hero_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_hero_2_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_hero_2_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_features_2_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "snippets_blocks_features_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum_snippets_blocks_features_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_features_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_features_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_features_2_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_features_2_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_cta_2_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"variant" "enum_snippets_blocks_cta_2_buttons_variant" DEFAULT 'default'
  );
  
  CREATE TABLE "snippets_blocks_cta_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text_align" "enum_snippets_blocks_cta_2_text_align" DEFAULT 'center',
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"appearance_background" "enum_snippets_blocks_cta_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_cta_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_cta_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_cta_2_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_cta_2_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_rich_text_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"appearance_background" "enum_snippets_blocks_rich_text_2_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_rich_text_2_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_rich_text_2_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_rich_text_2_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_rich_text_2_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_logo_cloud_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "snippets_blocks_logo_cloud" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"appearance_background" "enum_snippets_blocks_logo_cloud_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_logo_cloud_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_logo_cloud_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_logo_cloud_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_logo_cloud_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_pricing_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "snippets_blocks_pricing_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" varchar NOT NULL,
  	"period" varchar,
  	"description" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"highlighted" boolean
  );
  
  CREATE TABLE "snippets_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum_snippets_blocks_pricing_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_pricing_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_pricing_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_pricing_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_pricing_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_role" varchar,
  	"avatar_id" integer
  );
  
  CREATE TABLE "snippets_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"columns" "enum_snippets_blocks_testimonials_columns" DEFAULT '3',
  	"appearance_background" "enum_snippets_blocks_testimonials_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_testimonials_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_testimonials_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_testimonials_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_testimonials_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "snippets_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Questions fréquentes',
  	"appearance_background" "enum_snippets_blocks_faq_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_faq_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_faq_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_faq_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_faq_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "snippets_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"appearance_background" "enum_snippets_blocks_stats_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_stats_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_stats_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_stats_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_stats_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets_blocks_group" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_snippets_blocks_group_columns" DEFAULT '2',
  	"gap" "enum_snippets_blocks_group_gap" DEFAULT 'md',
  	"align" "enum_snippets_blocks_group_align" DEFAULT 'stretch',
  	"appearance_background" "enum_snippets_blocks_group_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_group_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_group_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_group_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_group_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  CREATE TABLE "snippets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "text_align" "enum_pages_blocks_hero_text_align" DEFAULT 'auto';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_hero_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_features" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_features" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_features_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_features" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_features" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "text_align" "enum_pages_blocks_cta_text_align" DEFAULT 'center';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_cta_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_rich_text_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_hero_2" ADD COLUMN "text_align" "enum_pages_blocks_hero_2_text_align" DEFAULT 'auto';
  ALTER TABLE "pages_blocks_hero_2" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_hero_2" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_hero_2_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_hero_2" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_hero_2" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_features_2" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_features_2" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_features_2_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_features_2" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_features_2" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_cta_2" ADD COLUMN "text_align" "enum_pages_blocks_cta_2_text_align" DEFAULT 'center';
  ALTER TABLE "pages_blocks_cta_2" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_cta_2" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_cta_2_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_cta_2" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_cta_2" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_rich_text_2" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_rich_text_2" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_rich_text_2_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_rich_text_2" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_rich_text_2" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_group" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "pages_blocks_group" ADD COLUMN "visibility_show_if_locale" "enum_pages_blocks_group_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "pages_blocks_group" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_group" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "text_align" "enum__pages_v_blocks_hero_text_align" DEFAULT 'auto';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_hero_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_features_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "text_align" "enum__pages_v_blocks_cta_text_align" DEFAULT 'center';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_cta_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_rich_text_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_hero_2" ADD COLUMN "text_align" "enum__pages_v_blocks_hero_2_text_align" DEFAULT 'auto';
  ALTER TABLE "_pages_v_blocks_hero_2" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_hero_2" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_hero_2_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_hero_2" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_hero_2" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_features_2" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_features_2" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_features_2_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_features_2" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_features_2" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_cta_2" ADD COLUMN "text_align" "enum__pages_v_blocks_cta_2_text_align" DEFAULT 'center';
  ALTER TABLE "_pages_v_blocks_cta_2" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_cta_2" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_cta_2_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_cta_2" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_cta_2" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_rich_text_2" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_rich_text_2" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_rich_text_2_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_rich_text_2" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_rich_text_2" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_group" ADD COLUMN "visibility_mobile_hidden" boolean;
  ALTER TABLE "_pages_v_blocks_group" ADD COLUMN "visibility_show_if_locale" "enum__pages_v_blocks_group_visibility_show_if_locale" DEFAULT 'any';
  ALTER TABLE "_pages_v_blocks_group" ADD COLUMN "visibility_show_from" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_group" ADD COLUMN "visibility_show_until" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "snippets_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud_logos" ADD CONSTRAINT "pages_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_cloud" ADD CONSTRAINT "pages_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_tiers_features" ADD CONSTRAINT "pages_blocks_pricing_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_tiers" ADD CONSTRAINT "pages_blocks_pricing_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_snippet" ADD CONSTRAINT "pages_blocks_snippet_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_snippet" ADD CONSTRAINT "pages_blocks_snippet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form" ADD CONSTRAINT "pages_blocks_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form" ADD CONSTRAINT "pages_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_cloud" ADD CONSTRAINT "_pages_v_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_tiers_features" ADD CONSTRAINT "_pages_v_blocks_pricing_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_tiers" ADD CONSTRAINT "_pages_v_blocks_pricing_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_snippet" ADD CONSTRAINT "_pages_v_blocks_snippet_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_snippet" ADD CONSTRAINT "_pages_v_blocks_snippet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form" ADD CONSTRAINT "_pages_v_blocks_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form" ADD CONSTRAINT "_pages_v_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_hero" ADD CONSTRAINT "snippets_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "snippets_blocks_hero" ADD CONSTRAINT "snippets_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_features_items" ADD CONSTRAINT "snippets_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_features" ADD CONSTRAINT "snippets_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_cta_buttons" ADD CONSTRAINT "snippets_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_cta" ADD CONSTRAINT "snippets_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_rich_text" ADD CONSTRAINT "snippets_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_hero_2" ADD CONSTRAINT "snippets_blocks_hero_2_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "snippets_blocks_hero_2" ADD CONSTRAINT "snippets_blocks_hero_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_features_2_items" ADD CONSTRAINT "snippets_blocks_features_2_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_features_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_features_2" ADD CONSTRAINT "snippets_blocks_features_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_cta_2_buttons" ADD CONSTRAINT "snippets_blocks_cta_2_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_cta_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_cta_2" ADD CONSTRAINT "snippets_blocks_cta_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_rich_text_2" ADD CONSTRAINT "snippets_blocks_rich_text_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_logo_cloud_logos" ADD CONSTRAINT "snippets_blocks_logo_cloud_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "snippets_blocks_logo_cloud_logos" ADD CONSTRAINT "snippets_blocks_logo_cloud_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_logo_cloud"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_logo_cloud" ADD CONSTRAINT "snippets_blocks_logo_cloud_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_pricing_tiers_features" ADD CONSTRAINT "snippets_blocks_pricing_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_pricing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_pricing_tiers" ADD CONSTRAINT "snippets_blocks_pricing_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_pricing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_pricing" ADD CONSTRAINT "snippets_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_testimonials_items" ADD CONSTRAINT "snippets_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "snippets_blocks_testimonials_items" ADD CONSTRAINT "snippets_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_testimonials" ADD CONSTRAINT "snippets_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_faq_items" ADD CONSTRAINT "snippets_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_faq" ADD CONSTRAINT "snippets_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_stats_items" ADD CONSTRAINT "snippets_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_stats" ADD CONSTRAINT "snippets_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "snippets_blocks_group" ADD CONSTRAINT "snippets_blocks_group_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_logo_cloud_logos_order_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_logos_parent_id_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_logos_locale_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("_locale");
  CREATE INDEX "pages_blocks_logo_cloud_logos_logo_idx" ON "pages_blocks_logo_cloud_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_cloud_order_idx" ON "pages_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_cloud_parent_id_idx" ON "pages_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_cloud_path_idx" ON "pages_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_cloud_locale_idx" ON "pages_blocks_logo_cloud" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pricing_tiers_features_order_idx" ON "pages_blocks_pricing_tiers_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_tiers_features_parent_id_idx" ON "pages_blocks_pricing_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_tiers_features_locale_idx" ON "pages_blocks_pricing_tiers_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pricing_tiers_order_idx" ON "pages_blocks_pricing_tiers" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_tiers_parent_id_idx" ON "pages_blocks_pricing_tiers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_tiers_locale_idx" ON "pages_blocks_pricing_tiers" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_locale_idx" ON "pages_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_locale_idx" ON "pages_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonials_items_avatar_idx" ON "pages_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_locale_idx" ON "pages_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locale_idx" ON "pages_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_locale_idx" ON "pages_blocks_faq" USING btree ("_locale");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_items_locale_idx" ON "pages_blocks_stats_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_locale_idx" ON "pages_blocks_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_snippet_order_idx" ON "pages_blocks_snippet" USING btree ("_order");
  CREATE INDEX "pages_blocks_snippet_parent_id_idx" ON "pages_blocks_snippet" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_snippet_path_idx" ON "pages_blocks_snippet" USING btree ("_path");
  CREATE INDEX "pages_blocks_snippet_locale_idx" ON "pages_blocks_snippet" USING btree ("_locale");
  CREATE INDEX "pages_blocks_snippet_snippet_idx" ON "pages_blocks_snippet" USING btree ("snippet_id");
  CREATE INDEX "pages_blocks_form_order_idx" ON "pages_blocks_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_parent_id_idx" ON "pages_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_path_idx" ON "pages_blocks_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_locale_idx" ON "pages_blocks_form" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_form_idx" ON "pages_blocks_form" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_order_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_parent_id_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_locale_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_logo_cloud_logos_logo_idx" ON "_pages_v_blocks_logo_cloud_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_order_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_cloud_parent_id_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_cloud_path_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_cloud_locale_idx" ON "_pages_v_blocks_logo_cloud" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pricing_tiers_features_order_idx" ON "_pages_v_blocks_pricing_tiers_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_tiers_features_parent_id_idx" ON "_pages_v_blocks_pricing_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_tiers_features_locale_idx" ON "_pages_v_blocks_pricing_tiers_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pricing_tiers_order_idx" ON "_pages_v_blocks_pricing_tiers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_tiers_parent_id_idx" ON "_pages_v_blocks_pricing_tiers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_tiers_locale_idx" ON "_pages_v_blocks_pricing_tiers" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_locale_idx" ON "_pages_v_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_locale_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonials_items_avatar_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_locale_idx" ON "_pages_v_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_locale_idx" ON "_pages_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_locale_idx" ON "_pages_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_locale_idx" ON "_pages_v_blocks_stats_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_locale_idx" ON "_pages_v_blocks_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_snippet_order_idx" ON "_pages_v_blocks_snippet" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_snippet_parent_id_idx" ON "_pages_v_blocks_snippet" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_snippet_path_idx" ON "_pages_v_blocks_snippet" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_snippet_locale_idx" ON "_pages_v_blocks_snippet" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_snippet_snippet_idx" ON "_pages_v_blocks_snippet" USING btree ("snippet_id");
  CREATE INDEX "_pages_v_blocks_form_order_idx" ON "_pages_v_blocks_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_parent_id_idx" ON "_pages_v_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_path_idx" ON "_pages_v_blocks_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_locale_idx" ON "_pages_v_blocks_form" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_form_idx" ON "_pages_v_blocks_form" USING btree ("form_id");
  CREATE INDEX "snippets_blocks_hero_order_idx" ON "snippets_blocks_hero" USING btree ("_order");
  CREATE INDEX "snippets_blocks_hero_parent_id_idx" ON "snippets_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_hero_path_idx" ON "snippets_blocks_hero" USING btree ("_path");
  CREATE INDEX "snippets_blocks_hero_locale_idx" ON "snippets_blocks_hero" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_hero_image_idx" ON "snippets_blocks_hero" USING btree ("image_id");
  CREATE INDEX "snippets_blocks_features_items_order_idx" ON "snippets_blocks_features_items" USING btree ("_order");
  CREATE INDEX "snippets_blocks_features_items_parent_id_idx" ON "snippets_blocks_features_items" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_features_items_locale_idx" ON "snippets_blocks_features_items" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_features_order_idx" ON "snippets_blocks_features" USING btree ("_order");
  CREATE INDEX "snippets_blocks_features_parent_id_idx" ON "snippets_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_features_path_idx" ON "snippets_blocks_features" USING btree ("_path");
  CREATE INDEX "snippets_blocks_features_locale_idx" ON "snippets_blocks_features" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_cta_buttons_order_idx" ON "snippets_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "snippets_blocks_cta_buttons_parent_id_idx" ON "snippets_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_cta_buttons_locale_idx" ON "snippets_blocks_cta_buttons" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_cta_order_idx" ON "snippets_blocks_cta" USING btree ("_order");
  CREATE INDEX "snippets_blocks_cta_parent_id_idx" ON "snippets_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_cta_path_idx" ON "snippets_blocks_cta" USING btree ("_path");
  CREATE INDEX "snippets_blocks_cta_locale_idx" ON "snippets_blocks_cta" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_rich_text_order_idx" ON "snippets_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "snippets_blocks_rich_text_parent_id_idx" ON "snippets_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_rich_text_path_idx" ON "snippets_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "snippets_blocks_rich_text_locale_idx" ON "snippets_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_hero_2_order_idx" ON "snippets_blocks_hero_2" USING btree ("_order");
  CREATE INDEX "snippets_blocks_hero_2_parent_id_idx" ON "snippets_blocks_hero_2" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_hero_2_path_idx" ON "snippets_blocks_hero_2" USING btree ("_path");
  CREATE INDEX "snippets_blocks_hero_2_locale_idx" ON "snippets_blocks_hero_2" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_hero_2_image_idx" ON "snippets_blocks_hero_2" USING btree ("image_id");
  CREATE INDEX "snippets_blocks_features_2_items_order_idx" ON "snippets_blocks_features_2_items" USING btree ("_order");
  CREATE INDEX "snippets_blocks_features_2_items_parent_id_idx" ON "snippets_blocks_features_2_items" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_features_2_items_locale_idx" ON "snippets_blocks_features_2_items" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_features_2_order_idx" ON "snippets_blocks_features_2" USING btree ("_order");
  CREATE INDEX "snippets_blocks_features_2_parent_id_idx" ON "snippets_blocks_features_2" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_features_2_path_idx" ON "snippets_blocks_features_2" USING btree ("_path");
  CREATE INDEX "snippets_blocks_features_2_locale_idx" ON "snippets_blocks_features_2" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_cta_2_buttons_order_idx" ON "snippets_blocks_cta_2_buttons" USING btree ("_order");
  CREATE INDEX "snippets_blocks_cta_2_buttons_parent_id_idx" ON "snippets_blocks_cta_2_buttons" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_cta_2_buttons_locale_idx" ON "snippets_blocks_cta_2_buttons" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_cta_2_order_idx" ON "snippets_blocks_cta_2" USING btree ("_order");
  CREATE INDEX "snippets_blocks_cta_2_parent_id_idx" ON "snippets_blocks_cta_2" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_cta_2_path_idx" ON "snippets_blocks_cta_2" USING btree ("_path");
  CREATE INDEX "snippets_blocks_cta_2_locale_idx" ON "snippets_blocks_cta_2" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_rich_text_2_order_idx" ON "snippets_blocks_rich_text_2" USING btree ("_order");
  CREATE INDEX "snippets_blocks_rich_text_2_parent_id_idx" ON "snippets_blocks_rich_text_2" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_rich_text_2_path_idx" ON "snippets_blocks_rich_text_2" USING btree ("_path");
  CREATE INDEX "snippets_blocks_rich_text_2_locale_idx" ON "snippets_blocks_rich_text_2" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_logo_cloud_logos_order_idx" ON "snippets_blocks_logo_cloud_logos" USING btree ("_order");
  CREATE INDEX "snippets_blocks_logo_cloud_logos_parent_id_idx" ON "snippets_blocks_logo_cloud_logos" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_logo_cloud_logos_locale_idx" ON "snippets_blocks_logo_cloud_logos" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_logo_cloud_logos_logo_idx" ON "snippets_blocks_logo_cloud_logos" USING btree ("logo_id");
  CREATE INDEX "snippets_blocks_logo_cloud_order_idx" ON "snippets_blocks_logo_cloud" USING btree ("_order");
  CREATE INDEX "snippets_blocks_logo_cloud_parent_id_idx" ON "snippets_blocks_logo_cloud" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_logo_cloud_path_idx" ON "snippets_blocks_logo_cloud" USING btree ("_path");
  CREATE INDEX "snippets_blocks_logo_cloud_locale_idx" ON "snippets_blocks_logo_cloud" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_pricing_tiers_features_order_idx" ON "snippets_blocks_pricing_tiers_features" USING btree ("_order");
  CREATE INDEX "snippets_blocks_pricing_tiers_features_parent_id_idx" ON "snippets_blocks_pricing_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_pricing_tiers_features_locale_idx" ON "snippets_blocks_pricing_tiers_features" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_pricing_tiers_order_idx" ON "snippets_blocks_pricing_tiers" USING btree ("_order");
  CREATE INDEX "snippets_blocks_pricing_tiers_parent_id_idx" ON "snippets_blocks_pricing_tiers" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_pricing_tiers_locale_idx" ON "snippets_blocks_pricing_tiers" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_pricing_order_idx" ON "snippets_blocks_pricing" USING btree ("_order");
  CREATE INDEX "snippets_blocks_pricing_parent_id_idx" ON "snippets_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_pricing_path_idx" ON "snippets_blocks_pricing" USING btree ("_path");
  CREATE INDEX "snippets_blocks_pricing_locale_idx" ON "snippets_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_testimonials_items_order_idx" ON "snippets_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "snippets_blocks_testimonials_items_parent_id_idx" ON "snippets_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_testimonials_items_locale_idx" ON "snippets_blocks_testimonials_items" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_testimonials_items_avatar_idx" ON "snippets_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "snippets_blocks_testimonials_order_idx" ON "snippets_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "snippets_blocks_testimonials_parent_id_idx" ON "snippets_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_testimonials_path_idx" ON "snippets_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "snippets_blocks_testimonials_locale_idx" ON "snippets_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_faq_items_order_idx" ON "snippets_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "snippets_blocks_faq_items_parent_id_idx" ON "snippets_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_faq_items_locale_idx" ON "snippets_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_faq_order_idx" ON "snippets_blocks_faq" USING btree ("_order");
  CREATE INDEX "snippets_blocks_faq_parent_id_idx" ON "snippets_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_faq_path_idx" ON "snippets_blocks_faq" USING btree ("_path");
  CREATE INDEX "snippets_blocks_faq_locale_idx" ON "snippets_blocks_faq" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_stats_items_order_idx" ON "snippets_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "snippets_blocks_stats_items_parent_id_idx" ON "snippets_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_stats_items_locale_idx" ON "snippets_blocks_stats_items" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_stats_order_idx" ON "snippets_blocks_stats" USING btree ("_order");
  CREATE INDEX "snippets_blocks_stats_parent_id_idx" ON "snippets_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_stats_path_idx" ON "snippets_blocks_stats" USING btree ("_path");
  CREATE INDEX "snippets_blocks_stats_locale_idx" ON "snippets_blocks_stats" USING btree ("_locale");
  CREATE INDEX "snippets_blocks_group_order_idx" ON "snippets_blocks_group" USING btree ("_order");
  CREATE INDEX "snippets_blocks_group_parent_id_idx" ON "snippets_blocks_group" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_group_path_idx" ON "snippets_blocks_group" USING btree ("_path");
  CREATE INDEX "snippets_blocks_group_locale_idx" ON "snippets_blocks_group" USING btree ("_locale");
  CREATE INDEX "snippets_updated_at_idx" ON "snippets" USING btree ("updated_at");
  CREATE INDEX "snippets_created_at_idx" ON "snippets" USING btree ("created_at");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_snippets_fk" FOREIGN KEY ("snippets_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_snippets_id_idx" ON "payload_locked_documents_rels" USING btree ("snippets_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_logo_cloud_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_cloud" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing_tiers_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_snippet" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_cloud_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_cloud" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pricing_tiers_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pricing_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_snippet" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_cta_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_hero_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_features_2_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_features_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_cta_2_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_cta_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_rich_text_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_logo_cloud_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_logo_cloud" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_pricing_tiers_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_pricing_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets_blocks_group" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "snippets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_submission_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_cloud" CASCADE;
  DROP TABLE "pages_blocks_pricing_tiers_features" CASCADE;
  DROP TABLE "pages_blocks_pricing_tiers" CASCADE;
  DROP TABLE "pages_blocks_pricing" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_snippet" CASCADE;
  DROP TABLE "pages_blocks_form" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_cloud" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_tiers_features" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_tiers" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_snippet" CASCADE;
  DROP TABLE "_pages_v_blocks_form" CASCADE;
  DROP TABLE "snippets_blocks_hero" CASCADE;
  DROP TABLE "snippets_blocks_features_items" CASCADE;
  DROP TABLE "snippets_blocks_features" CASCADE;
  DROP TABLE "snippets_blocks_cta_buttons" CASCADE;
  DROP TABLE "snippets_blocks_cta" CASCADE;
  DROP TABLE "snippets_blocks_rich_text" CASCADE;
  DROP TABLE "snippets_blocks_hero_2" CASCADE;
  DROP TABLE "snippets_blocks_features_2_items" CASCADE;
  DROP TABLE "snippets_blocks_features_2" CASCADE;
  DROP TABLE "snippets_blocks_cta_2_buttons" CASCADE;
  DROP TABLE "snippets_blocks_cta_2" CASCADE;
  DROP TABLE "snippets_blocks_rich_text_2" CASCADE;
  DROP TABLE "snippets_blocks_logo_cloud_logos" CASCADE;
  DROP TABLE "snippets_blocks_logo_cloud" CASCADE;
  DROP TABLE "snippets_blocks_pricing_tiers_features" CASCADE;
  DROP TABLE "snippets_blocks_pricing_tiers" CASCADE;
  DROP TABLE "snippets_blocks_pricing" CASCADE;
  DROP TABLE "snippets_blocks_testimonials_items" CASCADE;
  DROP TABLE "snippets_blocks_testimonials" CASCADE;
  DROP TABLE "snippets_blocks_faq_items" CASCADE;
  DROP TABLE "snippets_blocks_faq" CASCADE;
  DROP TABLE "snippets_blocks_stats_items" CASCADE;
  DROP TABLE "snippets_blocks_stats" CASCADE;
  DROP TABLE "snippets_blocks_group" CASCADE;
  DROP TABLE "snippets" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_snippets_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_snippets_id_idx";
  DROP INDEX "payload_locked_documents_rels_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "text_align";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "visibility_show_until";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_features" DROP COLUMN "visibility_show_until";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "text_align";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "visibility_show_until";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "visibility_show_until";
  ALTER TABLE "pages_blocks_hero_2" DROP COLUMN "text_align";
  ALTER TABLE "pages_blocks_hero_2" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_hero_2" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_hero_2" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_hero_2" DROP COLUMN "visibility_show_until";
  ALTER TABLE "pages_blocks_features_2" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_features_2" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_features_2" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_features_2" DROP COLUMN "visibility_show_until";
  ALTER TABLE "pages_blocks_cta_2" DROP COLUMN "text_align";
  ALTER TABLE "pages_blocks_cta_2" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_cta_2" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_cta_2" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_cta_2" DROP COLUMN "visibility_show_until";
  ALTER TABLE "pages_blocks_rich_text_2" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_rich_text_2" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_rich_text_2" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_rich_text_2" DROP COLUMN "visibility_show_until";
  ALTER TABLE "pages_blocks_group" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "pages_blocks_group" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "pages_blocks_group" DROP COLUMN "visibility_show_from";
  ALTER TABLE "pages_blocks_group" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "text_align";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "text_align";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_hero_2" DROP COLUMN "text_align";
  ALTER TABLE "_pages_v_blocks_hero_2" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_hero_2" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_hero_2" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_hero_2" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_features_2" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_features_2" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_features_2" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_features_2" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_cta_2" DROP COLUMN "text_align";
  ALTER TABLE "_pages_v_blocks_cta_2" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_cta_2" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_cta_2" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_cta_2" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_rich_text_2" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_rich_text_2" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_rich_text_2" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_rich_text_2" DROP COLUMN "visibility_show_until";
  ALTER TABLE "_pages_v_blocks_group" DROP COLUMN "visibility_mobile_hidden";
  ALTER TABLE "_pages_v_blocks_group" DROP COLUMN "visibility_show_if_locale";
  ALTER TABLE "_pages_v_blocks_group" DROP COLUMN "visibility_show_from";
  ALTER TABLE "_pages_v_blocks_group" DROP COLUMN "visibility_show_until";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "snippets_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  DROP TYPE "public"."enum_pages_blocks_hero_text_align";
  DROP TYPE "public"."enum_pages_blocks_hero_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_features_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_cta_text_align";
  DROP TYPE "public"."enum_pages_blocks_cta_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_rich_text_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_hero_2_text_align";
  DROP TYPE "public"."enum_pages_blocks_hero_2_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_features_2_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_cta_2_text_align";
  DROP TYPE "public"."enum_pages_blocks_cta_2_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_rich_text_2_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_logo_cloud_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_pricing_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_pricing_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_pricing_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_pricing_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_pricing_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_testimonials_columns";
  DROP TYPE "public"."enum_pages_blocks_testimonials_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_testimonials_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_testimonials_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_testimonials_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_testimonials_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_faq_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_faq_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_faq_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_faq_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_faq_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_stats_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_stats_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_stats_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_stats_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_stats_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_group_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_snippet_visibility_show_if_locale";
  DROP TYPE "public"."enum_pages_blocks_form_appearance_background";
  DROP TYPE "public"."enum_pages_blocks_form_appearance_padding";
  DROP TYPE "public"."enum_pages_blocks_form_appearance_max_width";
  DROP TYPE "public"."enum_pages_blocks_form_appearance_divider";
  DROP TYPE "public"."enum_pages_blocks_form_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_hero_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_hero_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_features_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_cta_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_cta_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_hero_2_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_hero_2_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_features_2_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_cta_2_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_2_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_logo_cloud_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_columns";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_faq_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_faq_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_faq_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_faq_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_faq_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_stats_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_stats_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_stats_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_stats_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_stats_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_group_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_snippet_visibility_show_if_locale";
  DROP TYPE "public"."enum__pages_v_blocks_form_appearance_background";
  DROP TYPE "public"."enum__pages_v_blocks_form_appearance_padding";
  DROP TYPE "public"."enum__pages_v_blocks_form_appearance_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_form_appearance_divider";
  DROP TYPE "public"."enum__pages_v_blocks_form_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_hero_variant";
  DROP TYPE "public"."enum_snippets_blocks_hero_text_align";
  DROP TYPE "public"."enum_snippets_blocks_hero_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_hero_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_hero_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_hero_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_hero_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_features_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_features_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_features_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_features_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_features_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_cta_buttons_variant";
  DROP TYPE "public"."enum_snippets_blocks_cta_text_align";
  DROP TYPE "public"."enum_snippets_blocks_cta_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_cta_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_cta_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_cta_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_cta_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_hero_2_variant";
  DROP TYPE "public"."enum_snippets_blocks_hero_2_text_align";
  DROP TYPE "public"."enum_snippets_blocks_hero_2_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_hero_2_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_hero_2_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_hero_2_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_hero_2_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_features_2_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_features_2_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_features_2_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_features_2_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_features_2_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_cta_2_buttons_variant";
  DROP TYPE "public"."enum_snippets_blocks_cta_2_text_align";
  DROP TYPE "public"."enum_snippets_blocks_cta_2_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_cta_2_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_cta_2_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_cta_2_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_cta_2_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_2_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_2_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_2_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_2_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_rich_text_2_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_logo_cloud_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_logo_cloud_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_logo_cloud_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_logo_cloud_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_logo_cloud_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_pricing_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_pricing_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_pricing_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_pricing_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_pricing_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_testimonials_columns";
  DROP TYPE "public"."enum_snippets_blocks_testimonials_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_testimonials_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_testimonials_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_testimonials_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_testimonials_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_faq_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_faq_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_faq_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_faq_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_faq_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_stats_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_stats_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_stats_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_stats_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_stats_visibility_show_if_locale";
  DROP TYPE "public"."enum_snippets_blocks_group_columns";
  DROP TYPE "public"."enum_snippets_blocks_group_gap";
  DROP TYPE "public"."enum_snippets_blocks_group_align";
  DROP TYPE "public"."enum_snippets_blocks_group_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_group_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_group_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_group_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_group_visibility_show_if_locale";
  DROP TYPE "public"."enum_forms_confirmation_type";`);
}
