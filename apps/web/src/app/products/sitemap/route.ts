import { getProducts } from '@lib/products';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const products = await getProducts(1000); // Get all products for sitemap

    const productUrls = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.date_updated
        ? new Date(product.date_updated)
        : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      ...productUrls,
    ];
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    // Return basic sitemap if products can't be fetched
    return [
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ];
  }
}
