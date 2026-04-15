import { directus } from "@/lib/utils/directus";
import { readItems } from "@directus/sdk";
import { logError } from "@/lib/logger";
import type { CaseStudy } from "@/lib/types";

const FIELDS = ["*", "image.id", "image.width", "image.height"];

export async function getCases(): Promise<CaseStudy[]> {
  try {
    return await directus.request(
      readItems("case_studies", {
        fields: FIELDS,
        filter: { status: { _eq: "published" } },
        sort: ["-date_created"],
      }),
    ) as CaseStudy[];
  } catch (error: unknown) {
    logError("Directus:cases", error, "getCases");
    return [];
  }
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const items = await directus.request(
      readItems("case_studies", {
        fields: FIELDS,
        filter: { status: { _eq: "published" }, slug: { _eq: slug } },
        limit: 1,
      }),
    ) as CaseStudy[];
    return items[0] ?? null;
  } catch (error: unknown) {
    logError("Directus:cases", error, `getCaseBySlug(${slug})`);
    return null;
  }
}
