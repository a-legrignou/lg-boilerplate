/**
 * Hook Directus → revalidation Next.js
 *
 * Déclenché sur create/update/delete de toutes les collections CMS.
 * Appelle /api/revalidate avec le tag correspondant à la collection.
 *
 * Variables requises dans Directus :
 *   NEXTJS_URL           = https://votre-site.fr  (ou http://web:3000 en Docker interne)
 *   NEXT_REVALIDATE_TOKEN = même valeur que dans .env.local Next.js
 */

// Mapping collection → cache tag Next.js
const COLLECTION_TAGS: Record<string, string[]> = {
  pages: ['pages'],
  articles: ['articles', 'blog'],
  products: ['products'],
  product_variants: ['products'],
  product_images: ['products'],
  authors: ['articles', 'blog'],
};

// Collections à surveiller (ignore les collections système Directus)
const WATCHED = new Set(Object.keys(COLLECTION_TAGS));

export default ({
  action,
}: {
  action: (
    event: string,
    handler: (meta: unknown, context: unknown) => void
  ) => void;
}) => {
  const handler = async (meta: {
    collection?: string;
    key?: string | number;
  }) => {
    const { collection } = meta;
    if (!collection || !WATCHED.has(collection)) return;

    const url = process.env.NEXTJS_URL?.replace(/\/$/, '');
    const token = process.env.NEXT_REVALIDATE_TOKEN;

    if (!url || !token) {
      console.warn(
        '[revalidate] NEXTJS_URL ou NEXT_REVALIDATE_TOKEN manquant — revalidation ignorée.'
      );
      return;
    }

    const tags = COLLECTION_TAGS[collection] ?? ['pages'];

    try {
      const res = await fetch(`${url}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tags }),
      });

      if (res.ok) {
        console.log(
          `[revalidate] ✓ Tags invalidés : ${tags.join(', ')} (${collection})`
        );
      } else {
        console.warn(`[revalidate] ✗ Erreur ${res.status} pour ${collection}`);
      }
    } catch (err) {
      console.error('[revalidate] Erreur réseau :', err);
    }
  };

  action('items.create', handler);
  action('items.update', handler);
  action('items.delete', handler);
};
