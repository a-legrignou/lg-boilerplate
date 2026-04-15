import { directus } from "@/lib/utils/directus";
import { readItems } from "@directus/sdk";
import { logError } from "@/lib/logger";
import type { MenuItem } from "@/lib/types";

export async function getTopMenu(): Promise<MenuItem[]> {
  return getMenu(1);
}

export async function getFooterMenu(): Promise<MenuItem[]> {
  return getMenu(2);
}

export async function getFooterContactMenu(): Promise<MenuItem[]> {
  return getMenu(3);
}

async function getMenu(menuId: number): Promise<MenuItem[]> {
  try {
    const items = await directus.request(
      readItems("navigation_items", {
        fields: [
          "id", "sort", "label", "path", "active", "parent",
          "children.id", "children.label", "children.path",
          "children.sort", "children.active",
        ],
        filter: { menu: { _eq: menuId }, active: { _eq: true } },
        sort: ["sort"],
      }),
    ) as MenuItem[];

    return items.filter((item) => item.parent === null);
  } catch (error: unknown) {
    logError("Directus:menus", error, `getMenu(${menuId})`);
    return [];
  }
}
