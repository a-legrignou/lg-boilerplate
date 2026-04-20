import { ImageResponse } from 'next/og';
import { getBlogArticleBySlug } from '@lib/blog';
import { env } from '@lib/env';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const article = await getBlogArticleBySlug(params.slug).catch(() => null);

  const title = article?.title ?? 'Article';
  const siteName = env.NEXT_PUBLIC_SITE_NAME;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #030712 0%, #0f172a 100%)',
        padding: '64px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Accent line */}
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

      {/* Site name */}
      <p
        style={{
          fontSize: 18,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#38bdf8',
          marginBottom: 24,
        }}
      >
        {siteName} · Blog
      </p>

      {/* Title */}
      <h1
        style={{
          fontSize: title.length > 60 ? 44 : 56,
          fontWeight: 700,
          color: '#f8fafc',
          lineHeight: 1.15,
          margin: 0,
          maxWidth: 900,
        }}
      >
        {title}
      </h1>

      {/* Author + date */}
      {article && (
        <p style={{ fontSize: 20, color: '#94a3b8', marginTop: 32 }}>
          {article.author?.first_name ? `Par ${article.author.first_name}` : ''}
          {article.published_at
            ? ` · ${new Date(article.published_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`
            : ''}
        </p>
      )}
    </div>,
    { ...size }
  );
}
