import { fetchCollection } from './directus';

export type CorePageBlock = {
  id: string;
  block_type: string;
  content: unknown;
  position: number;
};

export type CorePage = {
  id: string;
  title: string;
  slug: string;
  status: string;
  seo_title?: string;
  seo_description?: string;
  content?: CorePageBlock[];
  og_image?: { id: string; title?: string; url?: string };
  publish_date?: string;
  updated_at?: string;
};

export async function getCorePages() {
  return (
    (await fetchCollection<CorePage[]>('pages', {
      filter: { status: { _eq: 'published' } },
      sort: ['-publish_date'],
      fields: ['*', 'og_image.*'],
    })) ?? []
  );
}

export async function getCorePageBySlug(slug: string) {
  const response = await fetchCollection<CorePage[]>('pages', {
    filter: { slug: { _eq: slug } },
    limit: 1,
    fields: ['*', 'og_image.*'],
  });

  return response?.[0] ?? null;
}

export async function getCorePageSlugs() {
  const response = await fetchCollection<Array<{ slug: string }>>('pages', {
    filter: { status: { _eq: 'published' } },
    fields: ['slug'],
  });

  return (response ?? []).map((item) => item.slug);
}
