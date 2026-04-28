import { readFileSync } from "fs";
import path from "path";
import Link from "next/link";
import { headers } from "next/headers";
import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  Palette,
  Shield,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { JsonLd } from "@/components/JsonLd";
import { getSiteData } from "@/lib/payload";
import { buildMetadata } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { settings, seo } = await getSiteData("fr");
  return buildMetadata({
    doc: {
      title: settings?.siteName ?? "Folio",
      meta: { description: settings?.siteDescription },
    },
    path: "/",
    locale: "fr",
    settings,
    seo,
  });
}

const readVersion = (): string => {
  try {
    return readFileSync(
      path.resolve(process.cwd(), ".boilerplate-version"),
      "utf8",
    ).trim();
  } catch {
    return "1.0.0";
  }
};

const STACK = [
  "Next 16",
  "Payload v3",
  "Better Auth",
  "Postgres",
  "Tailwind v4",
];

const DOCS = [
  {
    href: "/features",
    icon: Boxes,
    title: "Modules & fonctionnalités",
    desc: "Collections, globals, blocks, routes, intégrations, commandes Make. Tout ce qu'il y a dans la boîte.",
  },
  {
    href: "/design",
    icon: Palette,
    title: "Design system",
    desc: "Identité de marque, blocks visuels, palette d'apparence (background/padding/width), conventions.",
  },
  {
    href: "/security",
    icon: Shield,
    title: "Sécurité & permissions",
    desc: "RBAC 3 rôles, rate limiting, auth Better Auth + magic link, env validation Zod, monitoring Sentry.",
  },
];

const STATS = [
  { value: "8", label: "Collections" },
  { value: "5", label: "Globals" },
  { value: "13", label: "Blocks" },
  { value: "2", label: "Locales (FR + EN)" },
  { value: "8", label: "Schemas JSON-LD" },
  { value: "22+9", label: "Tests (unit + E2E)" },
];

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { settings, seo } = await getSiteData("fr");
  const version = readVersion();

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={[organizationSchema(settings, seo), websiteSchema(settings)]}
      />

      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="font-mono text-sm font-semibold">
              {settings?.siteName || "Folio"}
            </Link>
            <span className="font-mono text-xs text-muted-foreground">
              v{version}
            </span>
          </div>
          <nav className="flex items-center gap-1 md:gap-3">
            <Link
              href="/features"
              className="hidden text-sm text-muted-foreground hover:text-foreground md:inline"
            >
              Features
            </Link>
            <Link
              href="/design"
              className="hidden text-sm text-muted-foreground hover:text-foreground md:inline"
            >
              Design
            </Link>
            <Link
              href="/security"
              className="hidden text-sm text-muted-foreground hover:text-foreground md:inline"
            >
              Security
            </Link>
            <span className="hidden h-4 w-px bg-border md:inline-block" />
            <Button size="sm" variant="outline" asChild>
              <Link href="/admin">/admin</Link>
            </Button>
            {session ? (
              <Button size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                asChild
                className="hidden md:inline-flex"
              >
                <Link href="/sign-in">Connexion</Link>
              </Button>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3" />
          {STACK.join(" · ")}
        </div>

        <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight md:text-6xl">
          Le boilerplate Next + Payload, pensé pour le SEO.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          Stack complète pour démarrer un produit B2B ou un site marketing : CMS
          code-first, auth + paywall, i18n FR/EN, blocks réutilisables, tests,
          CI, et upgrades versionnés.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/features">
              Découvrir les features <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/admin">Ouvrir l'admin</Link>
          </Button>
        </div>

        {/* Stats inline */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 md:grid-cols-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 doc cards */}
      <section className="container mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {DOCS.map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <Icon className="size-5 text-muted-foreground" />
                  <CardTitle className="flex items-center justify-between">
                    {title}
                    <ArrowRight className="size-4 opacity-0 transition group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground">
          <div>v{version} · MIT · Made in France</div>
          <div className="flex gap-4">
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <Link href="/search" className="hover:underline">
              Recherche
            </Link>
            <Link
              href="https://github.com/payloadcms/payload"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Doc Payload <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
