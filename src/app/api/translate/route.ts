import { headers } from "next/headers";
import {
  translate,
  TranslateError,
  getTranslateProvider,
} from "@/lib/translate";
import { isLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { payload } from "@/lib/payload";
import { rateLimit, getClientKey, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const TRANSLATABLE: Record<string, string[]> = {
  pages: ["title", "layout"],
  posts: ["title", "excerpt", "content"],
};

/**
 * POST /api/translate
 * body: { collection: 'pages' | 'posts', id: number, from: Locale, to: Locale }
 * Auth: Payload admin/editor session (cookie posé par /admin login).
 */
export async function POST(req: Request) {
  const limit = rateLimit({
    key: await getClientKey("translate"),
    limit: 10,
    windowMs: 60_000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfter);

  const client = await payload();
  const { user } = await client.auth({ headers: await headers() });
  const role = (user as { role?: string } | null)?.role;
  if (!user || (role !== "admin" && role !== "editor")) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { collection?: string; id?: number; from?: string; to?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { collection, id } = body;
  const from = body.from ?? DEFAULT_LOCALE;
  const to = body.to ?? "";
  if (!collection || !TRANSLATABLE[collection])
    return Response.json({ error: "unknown_collection" }, { status: 400 });
  if (typeof id !== "number")
    return Response.json({ error: "missing_id" }, { status: 400 });
  if (!isLocale(from) || !isLocale(to) || from === to)
    return Response.json({ error: "invalid_locale" }, { status: 400 });

  const collectionSlug = collection as "pages" | "posts";
  const fieldKeys = TRANSLATABLE[collectionSlug];

  try {
    const source = await client.findByID({
      collection: collectionSlug,
      id,
      locale: from as Locale,
      depth: 0,
    });

    const sourceRecord = source as unknown as Record<string, unknown>;
    const fields = fieldKeys.reduce<Record<string, unknown>>((acc, key) => {
      const value = sourceRecord[key];
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {});

    const { data: translated, provider } = await translate({
      fields,
      from: from as Locale,
      to: to as Locale,
    });

    await client.update({
      collection: collectionSlug,
      id,
      locale: to as Locale,
      data: translated as never,
    });

    return Response.json({
      ok: true,
      collection: collectionSlug,
      id,
      from,
      to,
      provider,
    });
  } catch (err) {
    if (err instanceof TranslateError) {
      const status = err.code === "no_provider" ? 503 : 502;
      return Response.json(
        { error: err.code, message: err.message },
        { status },
      );
    }
    logger.error({ err }, "translate failed");
    return Response.json(
      { error: "translate_failed", message: (err as Error).message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/translate — status check.
 * Returns the configured provider so the admin button can show a clear state.
 */
export async function GET() {
  const provider = getTranslateProvider();
  return Response.json({ provider, ok: provider !== "none" });
}
