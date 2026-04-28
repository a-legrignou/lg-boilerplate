import "server-only";
import { Pool } from "pg";
import type { Locale } from "./i18n";

const pool = new Pool({ connectionString: process.env.DATABASE_URI });

export type SearchHit = {
  type: "page" | "post";
  title: string;
  slug: string;
  excerpt: string;
  rank: number;
};

/**
 * Postgres full-text search across Pages + Posts using ts_vector / ts_rank.
 * Locale-scoped via the *_locales tables. No external service.
 */
export async function search(
  query: string,
  locale: Locale,
  limit = 20,
): Promise<SearchHit[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const dict = locale === "fr" ? "french" : "english";

  const sql = `
    WITH q AS (SELECT websearch_to_tsquery($1, $2) AS query)
    SELECT * FROM (
      SELECT
        'page'::text AS type,
        pl.title,
        pl.slug,
        '' AS excerpt,
        ts_rank(setweight(to_tsvector($1, coalesce(pl.title, '')), 'A'), q.query) AS rank
      FROM pages_locales pl, q
      WHERE pl._locale = $3
        AND to_tsvector($1, coalesce(pl.title, '')) @@ q.query

      UNION ALL

      SELECT
        'post'::text AS type,
        pol.title,
        pol.slug,
        coalesce(pol.excerpt, '') AS excerpt,
        ts_rank(
          setweight(to_tsvector($1, coalesce(pol.title, '')), 'A')
          || setweight(to_tsvector($1, coalesce(pol.excerpt, '')), 'B'),
          q.query
        ) AS rank
      FROM posts_locales pol, q
      WHERE pol._locale = $3
        AND (
          to_tsvector($1, coalesce(pol.title, '')) @@ q.query
          OR to_tsvector($1, coalesce(pol.excerpt, '')) @@ q.query
        )
    ) results
    ORDER BY rank DESC
    LIMIT $4
  `;

  try {
    const { rows } = await pool.query<SearchHit>(sql, [
      dict,
      trimmed,
      locale,
      limit,
    ]);
    return rows;
  } catch {
    return [];
  }
}
