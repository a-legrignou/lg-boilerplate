import type { MetadataRoute } from "next";
import { getSeoGlobal } from "@/lib/payload";
import { DEFAULT_LOCALE } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoGlobal(DEFAULT_LOCALE).catch(() => null);
  const extraRules = seo?.robotsExtra?.trim() || "";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          ...(extraRules
            ? extraRules
                .split("\n")
                .filter((l) => l.startsWith("Disallow:"))
                .map((l) => l.replace(/^Disallow:\s*/, ""))
            : []),
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
