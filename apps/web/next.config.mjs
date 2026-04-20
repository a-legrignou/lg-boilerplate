// @ts-check

const isDev = process.env.NODE_ENV !== 'production';

const directusHost = new URL(
  process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'
).hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',

  // Security headers applied to every route
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 'unsafe-eval' needed by React dev tools (source maps, callstacks); never in prod
              isDev
                ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                : "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: https://${directusHost}`,
              "font-src 'self'",
              `connect-src 'self' https://${directusHost}`,
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'none'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: directusHost,
      },
      {
        // Allow localhost Directus in development
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
