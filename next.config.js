const directusHost = new URL(
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055"
).hostname;

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // requis pour next/script JSON-LD inline
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: https://${directusHost} https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org`,
      "font-src 'self'",
      `connect-src 'self' https://${directusHost}`,
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'none'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: directusHost,
      },
    ],
  },
  serverExternalPackages: ["@react-pdf/renderer"],
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    after: true,
  },
};

export default nextConfig;
