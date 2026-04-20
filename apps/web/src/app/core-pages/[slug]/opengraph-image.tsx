import { ImageResponse } from 'next/og';
import { getCorePageBySlug } from '@lib/core-pages';
import { env } from '@lib/env';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const page = await getCorePageBySlug(params.slug).catch(() => null);

  const title = page?.seo_title ?? page?.title ?? env.NEXT_PUBLIC_SITE_NAME;
  const description = page?.seo_description ?? env.NEXT_PUBLIC_SITE_DESCRIPTION;
  const siteName = env.NEXT_PUBLIC_SITE_NAME;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #030712 0%, #0f172a 100%)',
        padding: '80px 64px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
        }}
      />

      <p
        style={{
          fontSize: 18,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#38bdf8',
          marginBottom: 32,
        }}
      >
        {siteName}
      </p>

      <h1
        style={{
          fontSize: title.length > 50 ? 48 : 64,
          fontWeight: 700,
          color: '#f8fafc',
          lineHeight: 1.15,
          margin: '0 0 24px',
          maxWidth: 950,
        }}
      >
        {title}
      </h1>

      {description && (
        <p
          style={{
            fontSize: 24,
            color: '#94a3b8',
            maxWidth: 800,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {description.length > 120
            ? description.slice(0, 120) + '…'
            : description}
        </p>
      )}
    </div>,
    { ...size }
  );
}
