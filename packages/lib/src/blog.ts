import { fetchCollection } from './directus';

export type BlogAuthor = {
  id: string;
  first_name: string;
  last_name: string;
  slug: string;
  bio?: string;
  avatar?: { id: string; url?: string };
};

export type BlogArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: unknown;
  cover_image?: { id: string; url?: string; title?: string };
  author?: BlogAuthor;
  categories?: string[];
  tags?: string[];
  published_at?: string;
  reading_time?: number;
  seo_title?: string;
  seo_description?: string;
};

export async function getBlogArticles() {
  return (
    (await fetchCollection<BlogArticle[]>('articles', {
      filter: { status: { _eq: 'published' } },
      sort: ['-published_at'],
      fields: ['*', 'cover_image.*', 'author.*'],
      limit: 50,
    })) ?? []
  );
}

export async function getBlogArticleBySlug(slug: string) {
  const response = await fetchCollection<BlogArticle[]>('articles', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    limit: 1,
    fields: ['*', 'cover_image.*', 'author.*'],
  });

  return response?.[0] ?? null;
}

export async function getBlogArticleSlugs() {
  const response = await fetchCollection<Array<{ slug: string }>>('articles', {
    filter: { status: { _eq: 'published' } },
    fields: ['slug'],
    limit: 100,
  });

  return (response ?? []).map((item) => item.slug);
}

export function formatReadingTime(article: BlogArticle) {
  return article.reading_time ?? 0;
}
