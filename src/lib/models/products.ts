import { directus } from "@/lib/utils/directus";
import { readItems } from "@directus/sdk";
import { logError } from "@/lib/logger";
import type { ProductModule } from "@/lib/types";

const MODULE_FIELDS = [
  "id", "slug", "title", "description", "excerpt", "why", "how",
  "axe", "persona", "sort", "image.id", "duration", "deliverable", "format",
  "benefits", "budget",
];

export async function getAllModules(): Promise<ProductModule[]> {
  try {
    return await directus.request(
      readItems("products", {
        fields: MODULE_FIELDS,
        sort: ["sort"],
      }),
    ) as ProductModule[];
  } catch (error: unknown) {
    logError("Directus:products", error, "getAllModules");
    return [];
  }
}

export async function getModuleBySlug(slug: string): Promise<ProductModule | null> {
  try {
    const items = await directus.request(
      readItems("products", {
        fields: MODULE_FIELDS,
        filter: { slug: { _eq: slug } },
        limit: 1,
      }),
    ) as ProductModule[];
    return items[0] ?? null;
  } catch (error: unknown) {
    logError("Directus:products", error, `getModuleBySlug(${slug})`);
    return null;
  }
}
