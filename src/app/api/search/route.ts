import { search } from "@/lib/search";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { rateLimit, getClientKey, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const limit = rateLimit({
    key: await getClientKey("search"),
    limit: 30,
    windowMs: 60_000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfter);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const localeParam = searchParams.get("locale") ?? DEFAULT_LOCALE;
  const locale = isLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  const results = await search(q, locale, 20);
  return Response.json({ query: q, locale, results });
}
