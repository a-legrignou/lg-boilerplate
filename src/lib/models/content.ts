import { directus } from "@/lib/utils/directus";
import { readItems } from "@directus/sdk";
import { logError } from "@/lib/logger";
import type { Page, Section, SectionStatus } from "@/lib/types";

const isProd = () =>
  (process.env.NEXT_PUBLIC_APP_ENV ?? "development") === "production";

function filterSectionsByEnv(sections: Section[]): Section[] {
  const prod = isProd();
  return sections.filter((s) => {
    const status = s?.status as SectionStatus;
    if (status === "published") return true;   // visible partout
    if (status === "prod")      return true;   // visible partout (prod + dev)
    if (status === "dev")       return !prod;  // visible en dev uniquement
    return false;                             // draft, archived → masqué
  });
}

const CASE_FIELDS = ["id", "slug", "title", "description", "client_sector", "client_size", "image.id"];
const TEAM_FIELDS = ["id", "first_name", "last_name", "role", "image.id"];
const PRODUCT_FIELDS = ["id", "slug", "title", "description", "excerpt", "why", "how", "axe", "persona", "image.id"];

export async function getPageContent(slug = "home"): Promise<Page | null> {
  try {
    const response = await directus.request(
      readItems("pages", {
        fields: [
          "*",
          "sections.*",
          "sections.image.id",
          "sections.blocks.collection",
          "sections.blocks.item:blocks.*",
          "sections.blocks.item:blocks.image.id",
          ...CASE_FIELDS.map((f) => `sections.blocks.item:case_studies.${f}`),
          ...TEAM_FIELDS.map((f) => `sections.blocks.item:team_members.${f}`),
          ...PRODUCT_FIELDS.map((f) => `sections.blocks.item:products.${f}`),
        ],
        filter: { slug: { _eq: slug } },
        limit: 1,
      }),
    );
    const page = response[0] as Page | undefined;
    if (!page) return null;
    if (page.sections) page.sections = filterSectionsByEnv(page.sections);
    return page;
  } catch (error: unknown) {
    logError("Directus:content", error, `getPageContent(${slug})`);
    return null;
  }
}

export async function getAllPages(): Promise<Pick<Page, "id" | "slug" | "date_updated" | "priority">[]> {
  try {
    return await directus.request(
      readItems("pages", {
        fields: ["id", "slug", "date_updated", "priority"],
      }),
    ) as Pick<Page, "id" | "slug" | "date_updated" | "priority">[];
  } catch (error: unknown) {
    logError("Directus:content", error, "getAllPages");
    return [];
  }
}
