import { directus } from "@/lib/utils/directus";
import { readItems, aggregate } from "@directus/sdk";
import { logError } from "@/lib/logger";
import type { Post } from "@/lib/types";

export const POSTS_PER_PAGE = 9;

const POST_FIELDS = [
  "*",
  "category.id",
  "category.title",
  "authors.post_authors_id.name",
  "authors.post_authors_id.role",
];

const POST_DETAIL_FIELDS = [
  "*",
  "category.id",
  "category.title",
  "blocks.*",
  "authors.post_authors_id.name",
  "authors.post_authors_id.role",
];

export async function getBlogPaginated({
  page = 1,
  limit = POSTS_PER_PAGE,
  tier,
}: {
  page?: number;
  limit?: number;
  tier?: string;
} = {}): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const offset = (page - 1) * limit;
  const filter: Record<string, unknown> = { status: { _eq: "published" } };
  if (tier && tier !== "all") filter.tier = { _eq: tier };

  try {
    const [posts, countResult] = await Promise.all([
      directus.request(
        readItems("posts", {
          fields: POST_FIELDS,
          filter,
          sort: ["-date_created"],
          limit,
          offset,
        }),
      ),
      directus.request(
        aggregate("posts" as never, {
          aggregate: { count: "*" },
          query: { filter },
        }),
      ),
    ]);
    const total = Number((countResult as { count: string }[])[0]?.count ?? 0);
    return { posts: posts as Post[], total, totalPages: Math.ceil(total / limit) };
  } catch (error: unknown) {
    logError("Directus:blog", error, "getBlogPaginated");
    return { posts: [], total: 0, totalPages: 0 };
  }
}

export async function getBlogContent(): Promise<Post[]> {
  try {
    const response = await directus.request(
      readItems("posts", {
        fields: POST_FIELDS,
        filter: { status: { _eq: "published" } },
        sort: ["-date_created"],
        limit: 100,
      }),
    );
    return response as Post[];
  } catch (error: unknown) {
    logError("Directus:blog", error, "getBlogContent");
    return [];
  }
}

export async function getPostContent(id: string): Promise<Post | null> {
  const fields = POST_DETAIL_FIELDS;

  // Recherche par slug d'abord (requiert que le champ existe dans Directus)
  try {
    const bySlug = await directus.request(
      readItems("posts", {
        fields,
        filter: { status: { _eq: "published" }, slug: { _eq: id } },
        limit: 1,
      }),
    );
    if (bySlug[0]) return bySlug[0] as Post;
  } catch {
    // Champ slug absent → fallback sur l'id
  }

  // Fallback : recherche par id numérique / uuid
  try {
    const byId = await directus.request(
      readItems("posts", {
        fields,
        filter: { status: { _eq: "published" }, id: { _eq: id } },
        limit: 1,
      }),
    );
    return (byId[0] as Post) ?? null;
  } catch (error: unknown) {
    logError("Directus:blog", error, `getPostContent(${id})`);
    return null;
  }
}

/**
 * Récupère les articles liés à un post donné, en se basant sur la catégorie.
 * Évite le N+1 en faisant une seule requête Directus ciblée.
 *
 * @param postId     - ID du post courant (exclu des résultats)
 * @param categoryId - ID de la catégorie pour la similarité
 * @param limit      - Nombre max d'articles retournés (défaut : 3)
 */
export async function getRelatedPosts(
  postId: string | number,
  categoryId: string | number | undefined,
  limit = 3,
): Promise<Post[]> {
  if (!categoryId) return [];

  try {
    const response = await directus.request(
      readItems("posts", {
        fields: POST_FIELDS,
        filter: {
          status: { _eq: "published" },
          id:     { _neq: postId },
          category: { id: { _eq: categoryId } },
        },
        sort: ["-date_created"],
        limit,
      }),
    );
    return response as Post[];
  } catch (error: unknown) {
    logError("Directus:blog", error, `getRelatedPosts(post=${postId}, cat=${categoryId})`);
    return [];
  }
}
