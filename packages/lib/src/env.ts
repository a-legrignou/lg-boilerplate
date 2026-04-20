import { z } from 'zod';

const envSchema = z.object({
  DIRECTUS_URL: z.string().url(),
  DIRECTUS_PUBLIC_URL: z.string().url(),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Mon Projet'),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().default(''),
  NEXT_PUBLIC_ENABLE_CORE_PAGES: z.string().optional(),
  NEXT_PUBLIC_ENABLE_BLOG: z.string().optional(),
  NEXT_PUBLIC_ENABLE_PRODUCTS: z.string().optional(),
  NEXT_PUBLIC_ENABLE_AUTH: z.string().optional(),
  NEXT_PUBLIC_ENABLE_ADMIN: z.string().optional(),
  NEXT_REVALIDATE_TOKEN: z.string().min(10),
  DIRECTUS_STATIC_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
