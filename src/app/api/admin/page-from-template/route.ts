import { headers } from "next/headers";
import { payload } from "@/lib/payload";
import { PAGE_TEMPLATES } from "@/templates/page-templates";

/**
 * POST /api/admin/page-from-template
 * body: { templateId: string }
 * Crée une nouvelle Page (status: draft) avec le layout du template.
 * Auth: Payload session (admin OR editor) — pas Better Auth.
 */
export async function POST(req: Request) {
  const client = await payload();
  const { user } = await client.auth({ headers: await headers() });
  const role = (user as { role?: string } | null)?.role;
  if (!user || (role !== "admin" && role !== "editor")) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { templateId?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const template = PAGE_TEMPLATES.find((t) => t.id === body.templateId);
  if (!template)
    return Response.json({ error: "unknown_template" }, { status: 400 });

  const created = await client.create({
    collection: "pages",
    locale: "fr",
    data: {
      title: template.defaults.title,
      slug: `${template.defaults.slug}-${Date.now().toString(36).slice(-4)}`,
      layout: template.layout,
      _status: "draft",
    } as never,
  });

  return Response.json({ ok: true, id: created.id });
}
