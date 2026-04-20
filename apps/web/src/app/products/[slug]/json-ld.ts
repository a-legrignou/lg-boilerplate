import { Product } from '@lib/products';

export function generateProductJsonLd(product: Product) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const productUrl = `${baseUrl}/products/${product.slug}`;

  const offers =
    product.variants && product.variants.length > 0
      ? product.variants.map((variant) => ({
          '@type': 'Offer',
          sku: variant.sku,
          price: variant.price.toString(),
          priceCurrency: 'EUR',
          availability:
            variant.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          inventoryLevel: variant.stock,
        }))
      : [
          {
            '@type': 'Offer',
            price: product.price.toString(),
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          },
        ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.cover_image
      ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${product.cover_image}`
      : undefined,
    url: productUrl,
    category: product.categories?.map((cat) => cat.name).join(', '),
    offers,
    brand: {
      '@type': 'Brand',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Brand',
    },
    manufacturer: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Brand',
    },
  };
}
