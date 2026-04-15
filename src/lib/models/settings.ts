import { directus } from "@/lib/utils/directus";
import { readSingleton } from "@directus/sdk";
import { logError } from "@/lib/logger";
import type { SiteSettings } from "@/lib/types";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await directus.request(readSingleton("site_settings")) as SiteSettings;
  } catch (error: unknown) {
    logError("Directus:settings", error, "getSiteSettings");
    return null;
  }
}
