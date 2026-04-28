import "server-only";
import { getPayload } from "payload";
import config from "@/payload.config";
import type { Where } from "payload";
import type {
  Brand,
  Footer,
  Header,
  Page,
  Post,
  Setting,
  Seo,
} from "@/payload-types";
import type { Locale } from "./i18n";

export const payload = async () => getPayload({ config });

export async function getPost(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  const client = await payload();
  const result = await client.find({
    collection: "posts",
    where: { slug: { equals: slug }, _status: { equals: "published" } },
    locale,
    limit: 1,
    depth: 1,
  });
  return result.docs[0] ?? null;
}

export async function getAllPosts(locale: Locale, limit = 100) {
  const client = await payload();
  return client.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    locale,
    limit,
    depth: 0,
    sort: "-createdAt",
  });
}

export async function getAuthorBySlug(slug: string) {
  const client = await payload();
  const result = await client.find({
    collection: "users",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  return result.docs[0] ?? null;
}

export async function getPostsByAuthor(
  authorId: number,
  locale: Locale,
  limit = 50,
) {
  const client = await payload();
  return client.find({
    collection: "posts",
    where: { author: { equals: authorId }, _status: { equals: "published" } },
    locale,
    limit,
    depth: 0,
    sort: "-createdAt",
  });
}

export async function getRelatedPosts(post: Post, locale: Locale, limit = 3) {
  const client = await payload();
  const tags = (post.tags ?? []).map((t) => t.tag).filter(Boolean) as string[];

  // First try: posts sharing at least one tag, exclude self
  if (tags.length) {
    const result = await client.find({
      collection: "posts",
      where: {
        and: [
          { id: { not_equals: post.id } },
          { _status: { equals: "published" } },
          { "tags.tag": { in: tags } },
        ],
      },
      locale,
      limit,
      depth: 1,
      sort: "-createdAt",
    });
    if (result.docs.length >= limit) return result.docs;
    // Fallback: fill with recent posts
    const remaining = limit - result.docs.length;
    const ids = [post.id, ...result.docs.map((d) => d.id)];
    const recent = await client.find({
      collection: "posts",
      where: {
        and: [{ id: { not_in: ids } }, { _status: { equals: "published" } }],
      },
      locale,
      limit: remaining,
      depth: 1,
      sort: "-createdAt",
    });
    return [...result.docs, ...recent.docs];
  }

  // No tags: just recent posts excluding self
  const recent = await client.find({
    collection: "posts",
    where: {
      and: [
        { id: { not_equals: post.id } },
        { _status: { equals: "published" } },
      ],
    },
    locale,
    limit,
    depth: 1,
    sort: "-createdAt",
  });
  return recent.docs;
}

export async function getPage(
  slug: string,
  locale: Locale,
  opts?: { draft?: boolean },
): Promise<Page | null> {
  const client = await payload();
  const where: Where = opts?.draft
    ? { slug: { equals: slug } }
    : {
        and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
      };
  const result = await client.find({
    collection: "pages",
    where,
    locale,
    limit: 1,
    depth: 1,
    draft: opts?.draft,
  });
  return result.docs[0] ?? null;
}

export async function getAllPageSlugs(locale: Locale) {
  const client = await payload();
  const result = await client.find({
    collection: "pages",
    where: { _status: { equals: "published" } },
    locale,
    limit: 1000,
    depth: 0,
    select: { slug: true, updatedAt: true },
  });
  return result.docs;
}

type GlobalMap = {
  header: Header;
  footer: Footer;
  settings: Setting;
  seo: Seo;
  brand: Brand;
};

export async function getGlobal<K extends keyof GlobalMap>(
  slug: K,
  locale?: Locale,
): Promise<GlobalMap[K]> {
  const client = await payload();
  return (await client.findGlobal({
    slug,
    ...(locale ? { locale } : {}),
    depth: 1,
  })) as GlobalMap[K];
}

export async function getSettings(locale: Locale): Promise<Setting> {
  return getGlobal("settings", locale);
}

export async function getSeoGlobal(locale: Locale): Promise<Seo> {
  return getGlobal("seo", locale);
}

export type SiteData = {
  settings: Setting | null;
  seo: Seo | null;
  brand: Brand | null;
};

export async function getSiteData(locale: Locale): Promise<SiteData> {
  const [settings, seo, brand] = await Promise.all([
    getSettings(locale).catch(() => null),
    getSeoGlobal(locale).catch(() => null),
    getGlobal("brand").catch(() => null),
  ]);
  return { settings, seo, brand };
}
