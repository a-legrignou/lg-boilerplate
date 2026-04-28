import { Resend } from "resend";
import { rateLimit, getClientKey, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const apiKey = process.env.RESEND_API_KEY;
const audienceId = process.env.RESEND_AUDIENCE_ID;
const resend = apiKey ? new Resend(apiKey) : null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const limit = rateLimit({
    key: await getClientKey("newsletter"),
    limit: 5,
    windowMs: 60_000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfter);

  let email: string | undefined;
  try {
    ({ email } = (await req.json()) as { email?: string });
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email))
    return Response.json({ error: "invalid_email" }, { status: 400 });

  if (!resend || !audienceId) {
    // Dev fallback — log so the dev sees something happens.
    logger.info({ email }, "newsletter signup (no Resend audience configured)");
    return Response.json({ ok: true, mode: "dev" });
  }

  try {
    await resend.contacts.create({ email, audienceId, unsubscribed: false });
    return Response.json({ ok: true });
  } catch (err) {
    logger.error({ err, email }, "newsletter: resend create contact failed");
    return Response.json({ error: "subscribe_failed" }, { status: 500 });
  }
}
