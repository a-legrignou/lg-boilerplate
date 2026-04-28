import { headers } from "next/headers";
import { payload } from "@/lib/payload";
import { findPreset } from "@/templates/block-presets";
import type { Locale } from "@/lib/i18n";

/**
 * POST /api/admin/append-block-preset
 * body: { pageId: number, presetId: string, locale?: 'fr' | 'en' }
 * Append le block preset au champ `layout` de la page.
 * Auth: Payload session (admin OR editor).
 */
export async function POST(req: Request) {
  const client = await payload();
  const { user } = await client.auth({ headers: await headers() });
  const role = (user as { role?: string } | null)?.role;
  if (!user || (role !== "admin" && role !== "editor")) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { pageId?: number; presetId?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { pageId, presetId } = body;
  const locale = (body.locale === "en" ? "en" : "fr") as Locale;
  if (typeof pageId !== "number")
    return Response.json({ error: "pageId_required" }, { status: 400 });
  const preset = presetId ? findPreset(presetId) : null;
  if (!preset)
    return Response.json({ error: "unknown_preset" }, { status: 400 });

  const page = await client
    .findByID({ collection: "pages", id: pageId, locale, depth: 0 })
    .catch(() => null);
  if (!page) return Response.json({ error: "page_not_found" }, { status: 404 });

  const currentLayout = ((page as { layout?: unknown[] }).layout ??
    []) as unknown[];
  const nextLayout = [...currentLayout, preset.data];

  await client.update({
    collection: "pages",
    id: pageId,
    locale,
    data: { layout: nextLayout } as never,
  });

  return Response.json({ ok: true, count: nextLayout.length });
}
