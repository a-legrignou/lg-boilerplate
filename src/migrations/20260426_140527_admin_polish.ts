import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_snippets_blocks_newsletter_appearance_background" AS ENUM('default', 'muted', 'inverted', 'branded');
  CREATE TYPE "public"."enum_snippets_blocks_newsletter_appearance_padding" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TYPE "public"."enum_snippets_blocks_newsletter_appearance_max_width" AS ENUM('narrow', 'normal', 'wide', 'full');
  CREATE TYPE "public"."enum_snippets_blocks_newsletter_appearance_divider" AS ENUM('none', 'top', 'bottom', 'both');
  CREATE TYPE "public"."enum_snippets_blocks_newsletter_visibility_show_if_locale" AS ENUM('any', 'fr', 'en');
  CREATE TABLE "snippets_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Reste informé',
  	"subtitle" varchar,
  	"placeholder" varchar DEFAULT 'ton@email.com',
  	"submit_label" varchar DEFAULT 'S''abonner',
  	"success_message" varchar DEFAULT 'Merci, à bientôt !',
  	"appearance_background" "enum_snippets_blocks_newsletter_appearance_background" DEFAULT 'default',
  	"appearance_padding" "enum_snippets_blocks_newsletter_appearance_padding" DEFAULT 'md',
  	"appearance_max_width" "enum_snippets_blocks_newsletter_appearance_max_width" DEFAULT 'normal',
  	"appearance_divider" "enum_snippets_blocks_newsletter_appearance_divider" DEFAULT 'none',
  	"visibility_mobile_hidden" boolean,
  	"visibility_show_if_locale" "enum_snippets_blocks_newsletter_visibility_show_if_locale" DEFAULT 'any',
  	"visibility_show_from" timestamp(3) with time zone,
  	"visibility_show_until" timestamp(3) with time zone,
  	"block_name" varchar
  );
  
  ALTER TABLE "snippets_blocks_newsletter" ADD CONSTRAINT "snippets_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "snippets_blocks_newsletter_order_idx" ON "snippets_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "snippets_blocks_newsletter_parent_id_idx" ON "snippets_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "snippets_blocks_newsletter_path_idx" ON "snippets_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "snippets_blocks_newsletter_locale_idx" ON "snippets_blocks_newsletter" USING btree ("_locale");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "snippets_blocks_newsletter" CASCADE;
  DROP TYPE "public"."enum_snippets_blocks_newsletter_appearance_background";
  DROP TYPE "public"."enum_snippets_blocks_newsletter_appearance_padding";
  DROP TYPE "public"."enum_snippets_blocks_newsletter_appearance_max_width";
  DROP TYPE "public"."enum_snippets_blocks_newsletter_appearance_divider";
  DROP TYPE "public"."enum_snippets_blocks_newsletter_visibility_show_if_locale";`);
}
