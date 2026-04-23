import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Webhook endpoint called by Directus flows to invalidate the Next.js cache.
 *
 * Body: { secret: string, path?: string, tag?: string | string[] }
 *
 * - `path`  → revalidates a specific URL path (e.g. "/blog/my-article")
 * - `tag`   → revalidates all fetches tagged with that value
 *             (e.g. tag: "blog" or tag: ["blog", "blog-my-article"])
 * - If neither is provided, revalidates "/" as a fallback.
 *
 * Secure with NEXT_REVALIDATE_TOKEN env var.
 */
export async function POST(request: Request) {
  const token = process.env.NEXT_REVALIDATE_TOKEN;

  // Accepte le token soit en Bearer header (hook Directus) soit dans le body (appels manuels)
  const authHeader = request.headers.get('authorization') ?? '';
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  const body = (await request.json().catch(() => ({}))) as {
    secret?: string;
    path?: string;
    tag?: string | string[];
    tags?: string[];
  };

  const isAuthorized =
    token && (bearerToken === token || body.secret === token);
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const revalidated: string[] = [];

  // Tag-based revalidation (preferred for ISR)
  const tagInput = body.tags ?? body.tag;
  if (tagInput) {
    const tags = Array.isArray(tagInput) ? tagInput : [tagInput];
    for (const tag of tags) {
      revalidateTag(tag, 'max');
      revalidated.push(`tag:${tag}`);
    }
  }

  // Path-based revalidation (for specific routes)
  if (typeof body.path === 'string' && body.path.length > 0) {
    revalidatePath(body.path);
    revalidated.push(`path:${body.path}`);
  }

  // Fallback
  if (revalidated.length === 0) {
    revalidatePath('/');
    revalidated.push('path:/');
  }

  return NextResponse.json({
    revalidated,
    timestamp: new Date().toISOString(),
  });
}
