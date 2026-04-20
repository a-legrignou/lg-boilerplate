import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import './globals.css';
import { siteConfig } from '@lib/config';
import { PageShell } from '@ui/page-shell';
import { DraftBanner } from '@ui/draft-banner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <PageShell>{children}</PageShell>
        <DraftBanner isEnabled={isDraft} />
      </body>
    </html>
  );
}
