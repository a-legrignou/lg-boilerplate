import { directus } from "@/lib/utils/directus";
import { readItems } from "@directus/sdk";
import { logError } from "@/lib/logger";
import type { Member } from "@/lib/types";

export async function getMembers(): Promise<Member[]> {
  try {
    const items = await directus.request(
      readItems("team_members", {
        fields: ["id", "first_name", "last_name", "role", "short_description", "image.id", "sort"],
        sort: ["sort"],
      }),
    ) as Omit<Member, "title" | "subtitle">[];

    return items.map((m) => ({
      ...m,
      title: [m.first_name, m.last_name].filter(Boolean).join(" "),
      subtitle: m.role ?? null,
    }));
  } catch (error: unknown) {
    logError("Directus:team", error, "getMembers");
    return [];
  }
}
