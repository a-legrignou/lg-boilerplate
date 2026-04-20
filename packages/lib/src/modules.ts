const parseFlag = (value?: string) => value?.toLowerCase() === 'true';

export const moduleFlags = {
  corePages: parseFlag(process.env.NEXT_PUBLIC_ENABLE_CORE_PAGES),
  blog: parseFlag(process.env.NEXT_PUBLIC_ENABLE_BLOG),
  products: parseFlag(process.env.NEXT_PUBLIC_ENABLE_PRODUCTS),
  auth: parseFlag(process.env.NEXT_PUBLIC_ENABLE_AUTH),
  admin: parseFlag(process.env.NEXT_PUBLIC_ENABLE_ADMIN),
};

export const enabledModules = () =>
  [
    {
      name: 'core-pages',
      label: 'Core pages',
      enabled: moduleFlags.corePages,
      description: 'Pages CMS dynamiques avec SEO, sitemap et page builder.',
    },
    {
      name: 'blog',
      label: 'Blog',
      enabled: moduleFlags.blog,
      description: 'Articles, catégories, tags, RSS et SEO article.',
    },
    {
      name: 'products',
      label: 'Products',
      enabled: moduleFlags.products,
      description: 'Catalogue produit modulable avec variantes et filtres.',
    },
    {
      name: 'auth',
      label: 'Auth',
      enabled: moduleFlags.auth,
      description: 'Connexion, inscription, espace compte et sécurité.',
    },
    {
      name: 'admin',
      label: 'Admin',
      enabled: moduleFlags.admin,
      description: 'Dashboard santé et statistiques accessible aux admins.',
    },
  ].filter((module) => module.enabled);
