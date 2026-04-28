import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_brand_button_style" AS ENUM('fill', 'outline', 'soft', 'ghost');
  CREATE TYPE "public"."enum_brand_shadow" AS ENUM('none', 'sm', 'md', 'lg');
  ALTER TYPE "public"."enum_brand_preset" ADD VALUE 'premium';
  ALTER TYPE "public"."enum_brand_preset" ADD VALUE 'tech';
  ALTER TABLE "brand" ALTER COLUMN "foreground" SET DEFAULT '#0a0a0a';
  ALTER TABLE "brand" ADD COLUMN "card" varchar DEFAULT '#ffffff';
  ALTER TABLE "brand" ADD COLUMN "card_foreground" varchar DEFAULT '#0a0a0a';
  ALTER TABLE "brand" ADD COLUMN "muted" varchar DEFAULT '#f5f5f5';
  ALTER TABLE "brand" ADD COLUMN "muted_foreground" varchar DEFAULT '#737373';
  ALTER TABLE "brand" ADD COLUMN "primary_foreground" varchar DEFAULT '#ffffff';
  ALTER TABLE "brand" ADD COLUMN "accent_foreground" varchar DEFAULT '#0a0a0a';
  ALTER TABLE "brand" ADD COLUMN "border" varchar DEFAULT '#e5e5e5';
  ALTER TABLE "brand" ADD COLUMN "input" varchar DEFAULT '#e5e5e5';
  ALTER TABLE "brand" ADD COLUMN "ring" varchar DEFAULT '#6366f1';
  ALTER TABLE "brand" ADD COLUMN "destructive" varchar DEFAULT '#ef4444';
  ALTER TABLE "brand" ADD COLUMN "dark_background" varchar DEFAULT '#0a0a0a';
  ALTER TABLE "brand" ADD COLUMN "dark_foreground" varchar DEFAULT '#fafafa';
  ALTER TABLE "brand" ADD COLUMN "dark_card" varchar DEFAULT '#0f0f0f';
  ALTER TABLE "brand" ADD COLUMN "dark_card_foreground" varchar DEFAULT '#fafafa';
  ALTER TABLE "brand" ADD COLUMN "dark_muted" varchar DEFAULT '#1a1a1a';
  ALTER TABLE "brand" ADD COLUMN "dark_muted_foreground" varchar DEFAULT '#a3a3a3';
  ALTER TABLE "brand" ADD COLUMN "dark_primary" varchar DEFAULT '#818cf8';
  ALTER TABLE "brand" ADD COLUMN "dark_primary_foreground" varchar DEFAULT '#0a0a0a';
  ALTER TABLE "brand" ADD COLUMN "dark_accent" varchar DEFAULT '#67e8f9';
  ALTER TABLE "brand" ADD COLUMN "dark_accent_foreground" varchar DEFAULT '#0a0a0a';
  ALTER TABLE "brand" ADD COLUMN "dark_secondary" varchar DEFAULT '#c084fc';
  ALTER TABLE "brand" ADD COLUMN "dark_border" varchar DEFAULT '#262626';
  ALTER TABLE "brand" ADD COLUMN "dark_input" varchar DEFAULT '#262626';
  ALTER TABLE "brand" ADD COLUMN "dark_ring" varchar DEFAULT '#818cf8';
  ALTER TABLE "brand" ADD COLUMN "dark_success" varchar DEFAULT '#34d399';
  ALTER TABLE "brand" ADD COLUMN "dark_warning" varchar DEFAULT '#fbbf24';
  ALTER TABLE "brand" ADD COLUMN "dark_destructive" varchar DEFAULT '#f87171';
  ALTER TABLE "brand" ADD COLUMN "button_style" "enum_brand_button_style" DEFAULT 'fill';
  ALTER TABLE "brand" ADD COLUMN "shadow" "enum_brand_shadow" DEFAULT 'sm';
  ALTER TABLE "brand" DROP COLUMN "neutral";
  ALTER TABLE "brand" DROP COLUMN "danger";
  ALTER TABLE "brand" DROP COLUMN "dark_mode_background";
  ALTER TABLE "brand" DROP COLUMN "dark_mode_foreground";`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "brand" ALTER COLUMN "preset" SET DATA TYPE text;
  ALTER TABLE "brand" ALTER COLUMN "preset" SET DEFAULT 'modern'::text;
  DROP TYPE "public"."enum_brand_preset";
  CREATE TYPE "public"."enum_brand_preset" AS ENUM('custom', 'modern', 'editorial', 'bold', 'minimal', 'warm');
  ALTER TABLE "brand" ALTER COLUMN "preset" SET DEFAULT 'modern'::"public"."enum_brand_preset";
  ALTER TABLE "brand" ALTER COLUMN "preset" SET DATA TYPE "public"."enum_brand_preset" USING "preset"::"public"."enum_brand_preset";
  ALTER TABLE "brand" ALTER COLUMN "foreground" SET DEFAULT '#0f172a';
  ALTER TABLE "brand" ADD COLUMN "neutral" varchar DEFAULT '#64748b';
  ALTER TABLE "brand" ADD COLUMN "danger" varchar DEFAULT '#ef4444';
  ALTER TABLE "brand" ADD COLUMN "dark_mode_background" varchar DEFAULT '#0a0a0a';
  ALTER TABLE "brand" ADD COLUMN "dark_mode_foreground" varchar DEFAULT '#fafafa';
  ALTER TABLE "brand" DROP COLUMN "card";
  ALTER TABLE "brand" DROP COLUMN "card_foreground";
  ALTER TABLE "brand" DROP COLUMN "muted";
  ALTER TABLE "brand" DROP COLUMN "muted_foreground";
  ALTER TABLE "brand" DROP COLUMN "primary_foreground";
  ALTER TABLE "brand" DROP COLUMN "accent_foreground";
  ALTER TABLE "brand" DROP COLUMN "border";
  ALTER TABLE "brand" DROP COLUMN "input";
  ALTER TABLE "brand" DROP COLUMN "ring";
  ALTER TABLE "brand" DROP COLUMN "destructive";
  ALTER TABLE "brand" DROP COLUMN "dark_background";
  ALTER TABLE "brand" DROP COLUMN "dark_foreground";
  ALTER TABLE "brand" DROP COLUMN "dark_card";
  ALTER TABLE "brand" DROP COLUMN "dark_card_foreground";
  ALTER TABLE "brand" DROP COLUMN "dark_muted";
  ALTER TABLE "brand" DROP COLUMN "dark_muted_foreground";
  ALTER TABLE "brand" DROP COLUMN "dark_primary";
  ALTER TABLE "brand" DROP COLUMN "dark_primary_foreground";
  ALTER TABLE "brand" DROP COLUMN "dark_accent";
  ALTER TABLE "brand" DROP COLUMN "dark_accent_foreground";
  ALTER TABLE "brand" DROP COLUMN "dark_secondary";
  ALTER TABLE "brand" DROP COLUMN "dark_border";
  ALTER TABLE "brand" DROP COLUMN "dark_input";
  ALTER TABLE "brand" DROP COLUMN "dark_ring";
  ALTER TABLE "brand" DROP COLUMN "dark_success";
  ALTER TABLE "brand" DROP COLUMN "dark_warning";
  ALTER TABLE "brand" DROP COLUMN "dark_destructive";
  ALTER TABLE "brand" DROP COLUMN "button_style";
  ALTER TABLE "brand" DROP COLUMN "shadow";
  DROP TYPE "public"."enum_brand_button_style";
  DROP TYPE "public"."enum_brand_shadow";`);
}
