import { z } from "zod";

const schema = z.object({
  // Postgres
  DATABASE_URI: z.string().url("DATABASE_URI must be a valid postgres:// URL"),

  // Secrets
  PAYLOAD_SECRET: z
    .string()
    .min(
      16,
      "PAYLOAD_SECRET must be >=16 chars (run: openssl rand -base64 32)",
    ),
  BETTER_AUTH_SECRET: z
    .string()
    .min(16, "BETTER_AUTH_SECRET must be >=16 chars"),

  // URLs
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),

  // Email — optional in dev (logs to console), required in prod if you want emails
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Stripe — all optional; webhook returns 503 if not configured
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_PRICE_ID_PREMIUM: z.string().optional(),

  // Revalidation webhook secret (Payload → Next)
  REVALIDATE_SECRET: z.string().optional(),

  // OAuth providers — both halves required if either is set
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Analytics (consent-gated)
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_PLAUSIBLE_SCRIPT: z.string().url().optional(),

  // Observability
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // AI translation — Anthropic preferred, OpenAI fallback. Si les deux sont définis, Anthropic gagne.
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  TRANSLATE_PROVIDER: z.enum(["auto", "anthropic", "openai"]).default("auto"),

  // Newsletter (Resend audience)
  RESEND_AUDIENCE_ID: z.string().optional(),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("\n❌ Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error("\nFix .env.local and restart.\n");
  throw new Error("Environment validation failed");
}

export const env = parsed.data;
export type Env = typeof env;
