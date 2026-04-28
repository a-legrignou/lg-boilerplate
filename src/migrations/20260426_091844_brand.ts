import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_brand_font_preset" AS ENUM('sans', 'serif', 'mono');
  CREATE TYPE "public"."enum_brand_radius" AS ENUM('none', 'sm', 'md', 'lg');
  CREATE TABLE "brand" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_color" varchar DEFAULT '#6366f1',
  	"accent_color" varchar DEFAULT '#22d3ee',
  	"font_preset" "enum_brand_font_preset" DEFAULT 'sans',
  	"radius" "enum_brand_radius" DEFAULT 'md',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "brand" CASCADE;
  DROP TYPE "public"."enum_brand_font_preset";
  DROP TYPE "public"."enum_brand_radius";`);
}
