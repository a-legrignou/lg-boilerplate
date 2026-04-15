import { directus } from "@/lib/utils/directus";
import { readItems } from "@directus/sdk";
import { logError } from "@/lib/logger";
import type { Maintenance } from "@/lib/types";

const FIELDS = ["id", "status", "title", "message", "return_date", "image", "contact_mail"];

export async function getMaintenance(): Promise<Maintenance | null> {
  try {
    const response = await directus.request(readItems("maintenance", { fields: FIELDS, limit: 1 }));
    return (response as Maintenance[])[0] ?? null;
  } catch (error: unknown) {
    logError("Directus:maintenance", error, "getMaintenance");
    return null;
  }
}
