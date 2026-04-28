import { headers } from "next/headers";
import { payload } from "@/lib/payload";

/**
 * POST /api/admin/onboarding
 * body: {
 *   preset: 'modern' | 'editorial' | 'bold' | 'minimal' | 'warm',
 *   siteName: string,
 *   siteDescription?: string,
 *   contactEmail?: string,
 * }
 * Auth: Payload session (admin only).
 */
export async function POST(req: Request) {
  const client = await payload();
  const { user } = await client.auth({ headers: await headers() });
  const role = (user as { role?: string } | null)?.role;
  if (!user || role !== "admin") {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: {
    preset?: string;
    siteName?: string;
    siteDescription?: string;
    contactEmail?: string;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const VALID_PRESETS = ["modern", "editorial", "bold", "minimal", "warm"];
  const preset =
    body.preset && VALID_PRESETS.includes(body.preset) ? body.preset : "modern";
  const siteName = (body.siteName || "").trim();
  if (!siteName)
    return Response.json({ error: "siteName_required" }, { status: 400 });

  await client.updateGlobal({
    slug: "brand",
    data: { preset } as never,
  });

  await client.updateGlobal({
    slug: "settings",
    locale: "fr",
    data: {
      siteName,
      ...(body.siteDescription
        ? { siteDescription: body.siteDescription }
        : {}),
      ...(body.contactEmail ? { contact: { email: body.contactEmail } } : {}),
    } as never,
  });

  return Response.json({ ok: true });
}
