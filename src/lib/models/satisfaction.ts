import { directusAdmin } from "@/lib/utils/directus";
import { readItems, createItem, updateItem } from "@directus/sdk";
import { logError } from "@/lib/logger";

export interface SatisfactionToken {
  id: string;
  token: string;
  label?: string;
  used_at?: string | null;
  expires_at?: string | null;
}

export interface SatisfactionResponseData {
  nps: number;
  quality: number;
  communication: number;
  would_recommend: boolean;
  comment?: string;
}

export async function getSatisfactionToken(token: string): Promise<SatisfactionToken | null> {
  try {
    const items = await directusAdmin.request(
      readItems("satisfaction_tokens", {
        fields: ["id", "token", "label", "used_at", "expires_at"],
        filter: { token: { _eq: token } },
        limit: 1,
      }),
    ) as SatisfactionToken[];

    const record = items[0] ?? null;
    if (!record) return null;
    if (record.used_at) return null;
    if (record.expires_at && new Date(record.expires_at) < new Date()) return null;
    return record;
  } catch (error: unknown) {
    logError("Directus:satisfaction", error, `getSatisfactionToken(${token})`);
    return null;
  }
}

export async function submitSatisfactionResponse(
  tokenId: string,
  token: string,
  data: SatisfactionResponseData,
): Promise<void> {
  await directusAdmin.request(
    createItem("satisfaction_responses", {
      token,
      nps: data.nps,
      quality: data.quality,
      communication: data.communication,
      would_recommend: data.would_recommend,
      comment: data.comment ?? null,
      submitted_at: new Date().toISOString(),
    }),
  );

  await directusAdmin.request(
    updateItem("satisfaction_tokens", tokenId, {
      used_at: new Date().toISOString(),
    }),
  );
}
