import { z } from 'zod';

import { fetchCollection } from './directus';

// Types
export const ProductCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  product: z.string(),
  sku: z.string(),
  price: z.number(),
  stock: z.number(),
  options: z.record(z.string(), z.any()).optional(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  details: z.record(z.string(), z.any()).optional(),
  price: z.number(),
  status: z.enum(['draft', 'published']),
  categories: z.array(ProductCategorySchema).optional(),
  cover_image: z.string().optional(),
  variants: z.array(ProductVariantSchema).optional(),
  date_created: z.string().optional(),
  date_updated: z.string().optional(),
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type Product = z.infer<typeof ProductSchema>;

// Fetch functions
export async function getProducts(limit = 50, offset = 0): Promise<Product[]> {
  const response = await fetchCollection<Product[]>('products', {
    filter: {
      status: {
        _eq: 'published',
      },
    },
    fields: [
      'id',
      'name',
      'slug',
      'description',
      'price',
      'status',
      'cover_image',
      'categories.product_categories_id.name',
      'categories.product_categories_id.slug',
      'variants.id',
      'variants.sku',
      'variants.price',
      'variants.stock',
      'variants.options',
      'date_created',
      'date_updated',
    ],
    limit,
    offset,
    sort: ['-date_created'],
  });

  return response?.map(transformProduct) || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetchCollection<Product[]>('products', {
    filter: {
      slug: {
        _eq: slug,
      },
      status: {
        _eq: 'published',
      },
    },
    fields: [
      'id',
      'name',
      'slug',
      'description',
      'details',
      'price',
      'status',
      'cover_image',
      'categories.product_categories_id.id',
      'categories.product_categories_id.name',
      'categories.product_categories_id.slug',
      'variants.id',
      'variants.sku',
      'variants.price',
      'variants.stock',
      'variants.options',
      'date_created',
      'date_updated',
    ],
    limit: 1,
  });

  const data = response?.[0];
  return data ? transformProduct(data) : null;
}

export async function getCategories(): Promise<ProductCategory[]> {
  return (
    (await fetchCollection<ProductCategory[]>('product_categories', {
      fields: ['id', 'name', 'slug'],
      sort: ['name'],
    })) || []
  );
}

export async function getProductsByCategory(
  categorySlug: string,
  limit = 50,
  offset = 0
): Promise<Product[]> {
  const response = await fetchCollection<Product[]>('products', {
    filter: {
      status: {
        _eq: 'published',
      },
      categories: {
        product_categories_id: {
          slug: {
            _eq: categorySlug,
          },
        },
      },
    },
    fields: [
      'id',
      'name',
      'slug',
      'description',
      'price',
      'status',
      'cover_image',
      'categories.product_categories_id.name',
      'categories.product_categories_id.slug',
      'variants.id',
      'variants.sku',
      'variants.price',
      'variants.stock',
      'variants.options',
      'date_created',
      'date_updated',
    ],
    limit,
    offset,
    sort: ['-date_created'],
  });

  return response?.map(transformProduct) || [];
}

// Helper function to transform Directus response
function transformProduct(item: any): Product {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    details: item.details,
    price: item.price,
    status: item.status,
    cover_image: item.cover_image,
    categories:
      item.categories?.map((cat: any) => ({
        id: cat.product_categories_id.id,
        name: cat.product_categories_id.name,
        slug: cat.product_categories_id.slug,
      })) || [],
    variants:
      item.variants?.map((variant: any) => ({
        id: variant.id,
        product: variant.product,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        options: variant.options,
      })) || [],
    date_created: item.date_created,
    date_updated: item.date_updated,
  };
}
