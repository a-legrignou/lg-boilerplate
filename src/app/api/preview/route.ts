import { draftMode, headers } from "next/headers";
import { redirect } from "next/navigation";
import { payload } from "@/lib/payload";

/**
 * /api/preview — active draftMode + redirect vers la page CMS.
 * Auth: Payload admin/editor (Live Preview iframe ouvre l'URL avec le cookie Payload).
 */
export async function GET(req: Request) {
  const client = await payload();
  const { user } = await client.auth({ headers: await headers() });
  const role = (user as { role?: string } | null)?.role;
  if (!user || (role !== "admin" && role !== "editor")) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "/";
  if (!path.startsWith("/"))
    return Response.json({ error: "bad path" }, { status: 400 });

  const draft = await draftMode();
  draft.enable();
  redirect(path);
}

export async function DELETE() {
  const draft = await draftMode();
  draft.disable();
  return Response.json({ ok: true });
}
