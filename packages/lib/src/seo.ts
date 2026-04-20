import { siteConfig } from './config';

export function getMetadata({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
}) {
  return {
    title,
    description: description ?? siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title,
      description: description ?? siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? siteConfig.description,
    },
  };
}
