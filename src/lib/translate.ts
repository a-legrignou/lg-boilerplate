import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Locale } from "./i18n";
import { logger } from "./logger";

export type TranslateProvider = "anthropic" | "openai" | "none";

const LANG_NAME: Record<Locale, string> = { fr: "French", en: "English" };

export class TranslateError extends Error {
  code: "no_provider" | "parse_failed" | "provider_failed";
  constructor(code: TranslateError["code"], message: string) {
    super(message);
    this.code = code;
    this.name = "TranslateError";
  }
}

const buildPrompt = (
  from: Locale,
  to: Locale,
  fields: Record<string, unknown>,
) => `Translate the values of the following JSON object from ${LANG_NAME[from]} to ${LANG_NAME[to]}.

Rules:
- Preserve the JSON structure exactly: same keys, same nesting, same array lengths.
- Translate string values only. Do NOT translate URL slugs, hrefs, icon names, hex colors, or other technical identifiers — leave those untouched.
- For "slug" fields specifically, produce a URL-friendly translated version (kebab-case, no accents).
- Preserve placeholders like {{var}} and Markdown / HTML tags as-is.
- Return ONLY the JSON object, no prose, no code fences.

Input:
${JSON.stringify(fields, null, 2)}`;

const parseJson = (raw: string): Record<string, unknown> => {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch (err) {
    logger.error({ err, raw }, "translate: failed to parse JSON");
    throw new TranslateError(
      "parse_failed",
      "Le LLM a retourné un JSON invalide.",
    );
  }
};

/**
 * Selects the provider to use based on env config + available keys.
 * - TRANSLATE_PROVIDER=anthropic|openai forces a specific one
 * - TRANSLATE_PROVIDER=auto (default) prefers Anthropic, falls back to OpenAI
 */
export function getTranslateProvider(): TranslateProvider {
  const forced = process.env.TRANSLATE_PROVIDER;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (forced === "anthropic") return hasAnthropic ? "anthropic" : "none";
  if (forced === "openai") return hasOpenAI ? "openai" : "none";
  if (hasAnthropic) return "anthropic";
  if (hasOpenAI) return "openai";
  return "none";
}

async function translateAnthropic(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey)
    throw new TranslateError("no_provider", "ANTHROPIC_API_KEY manquante.");
  const client = new Anthropic({ apiKey });
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
    return response.content
      .filter((c): c is Anthropic.TextBlock => c.type === "text")
      .map((c) => c.text)
      .join("");
  } catch (err) {
    logger.error({ err }, "translate: anthropic call failed");
    throw new TranslateError(
      "provider_failed",
      `Anthropic a échoué : ${(err as Error).message}`,
    );
  }
}

async function translateOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    throw new TranslateError("no_provider", "OPENAI_API_KEY manquante.");
  const model = process.env.OPENAI_TRANSLATE_MODEL || "gpt-4o-mini";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.error({ status: res.status, body }, "translate: openai non-200");
      throw new TranslateError(
        "provider_failed",
        `OpenAI a renvoyé ${res.status} : ${body.slice(0, 200)}`,
      );
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    if (!text)
      throw new TranslateError(
        "provider_failed",
        "OpenAI a retourné une réponse vide.",
      );
    return text;
  } catch (err) {
    if (err instanceof TranslateError) throw err;
    logger.error({ err }, "translate: openai call failed");
    throw new TranslateError(
      "provider_failed",
      `OpenAI a échoué : ${(err as Error).message}`,
    );
  }
}

export async function translate({
  fields,
  from,
  to,
}: {
  fields: Record<string, unknown>;
  from: Locale;
  to: Locale;
}): Promise<{ data: Record<string, unknown>; provider: TranslateProvider }> {
  const provider = getTranslateProvider();
  if (provider === "none") {
    throw new TranslateError(
      "no_provider",
      "Aucune clé IA configurée. Ajoute ANTHROPIC_API_KEY ou OPENAI_API_KEY dans .env.local et relance le serveur.",
    );
  }

  const prompt = buildPrompt(from, to, fields);
  const raw =
    provider === "anthropic"
      ? await translateAnthropic(prompt)
      : await translateOpenAI(prompt);
  return { data: parseJson(raw), provider };
}
