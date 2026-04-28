import { headers } from "next/headers";
import { payload } from "@/lib/payload";
import type { Locale } from "@/lib/i18n";

/**
 * POST /api/admin/block/remove
 * body: { pageId: number, index: number, locale?: 'fr' | 'en' }
 * Supprime le block à l'index donné dans le layout.
 * Auth: Payload session (admin OR editor).
 */
export async function POST(req: Request) {
  const client = await payload();
  const { user } = await client.auth({ headers: await headers() });
  const role = (user as { role?: string } | null)?.role;
  if (!user || (role !== "admin" && role !== "editor")) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { pageId?: number; index?: number; locale?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { pageId, index } = body;
  const locale = (body.locale === "en" ? "en" : "fr") as Locale;
  if (typeof pageId !== "number")
    return Response.json({ error: "pageId_required" }, { status: 400 });
  if (typeof index !== "number" || index < 0)
    return Response.json({ error: "invalid_index" }, { status: 400 });

  const page = await client
    .findByID({
      collection: "pages",
      id: pageId,
      locale,
      depth: 0,
      draft: true,
    })
    .catch(() => null);
  if (!page) return Response.json({ error: "page_not_found" }, { status: 404 });

  const layout = [
    ...((page as { layout?: unknown[] }).layout ?? []),
  ] as unknown[];
  if (index >= layout.length)
    return Response.json({ error: "index_out_of_range" }, { status: 400 });

  layout.splice(index, 1);

  await client.update({
    collection: "pages",
    id: pageId,
    locale,
    draft: true,
    data: { layout } as never,
  });

  return Response.json({ ok: true, count: layout.length });
}
