import { directus } from "@/lib/utils/directus";
import { readItems } from "@directus/sdk";
import { logError } from "@/lib/logger";

export async function getProposalContent(): Promise<unknown[] | null> {
  try {
    return await directus.request(
      readItems("lines", { fields: ["*", "modules.*.*"] }),
    ) as unknown[];
  } catch (error: unknown) {
    logError("Directus:proposal", error, "getProposalContent");
    return null;
  }
}
