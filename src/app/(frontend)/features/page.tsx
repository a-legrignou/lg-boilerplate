import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocLayout, Section, Code } from "@/components/DocLayout";

export const metadata: Metadata = {
  title: "Features",
  description: "Modules, routes, intégrations et commandes du boilerplate.",
};

const StatusDot = ({ ok }: { ok: boolean }) => (
  <span
    className={`inline-block size-2 rounded-full ${ok ? "bg-emerald-500" : "bg-neutral-500"}`}
  />
);

const COLLECTIONS = [
  ["pages", "Pages", "Pages avec layout en blocks. SEO + drafts."],
  ["posts", "Articles", "Blog posts, RSS, JSON-LD Article."],
  [
    "snippets",
    "Blocs réutilisables",
    "Compositions référencables depuis Pages.",
  ],
  ["media", "Médias", "Images + uploads, Sharp pour resize auto."],
  ["forms", "Formulaires", "Form builder visuel (plugin officiel)."],
  ["form-submissions", "Soumissions", "Submissions des formulaires."],
  ["redirects", "Redirections", "301/302 — préserve le link juice SEO."],
  [
    "users",
    "Utilisateurs",
    "Comptes Payload (admin/editor/service). API key built-in.",
  ],
];

const GLOBALS = [
  ["header", "En-tête", "Nav + CTA, localisé."],
  ["footer", "Pied de page", "Tagline, colonnes, copyright."],
  [
    "settings",
    "Paramètres",
    "Nom du site, description courte, contact, mentions légales.",
  ],
  [
    "seo",
    "Référencement (SEO)",
    "Métadonnées par défaut, OG, social, JSON-LD Org, vérifications, robots, analytics.",
  ],
  [
    "brand",
    "Identité de marque",
    "Palette complète, typo, logo, presets, dark mode — CSS vars.",
  ],
];

const BLOCKS = [
  "Bannière (Hero) — variants centered/split",
  "Liste de fonctionnalités",
  "Bouton d'action (CTA)",
  "Texte mis en forme (richText Lexical)",
  "Mise en colonnes (Group, 1-4 colonnes)",
  "Bandeau logos",
  "Grille tarifaire",
  "Témoignages",
  "FAQ — émet automatiquement JSON-LD FAQPage",
  "Chiffres clés",
  "Bloc réutilisable (référence un Snippet)",
  "Insertion formulaire",
  "Inscription newsletter",
];

const ROUTES = {
  Frontend: [
    ["/", "Accueil (cette page de doc)"],
    ["/features, /design, /security", "Pages de documentation"],
    ["/[...slug]", "Pages CMS (FR sans préfixe, /en/* pour EN)"],
    ["/blog, /blog/[slug]", "Index + détail des articles"],
    ["/search", "Recherche full-text Postgres"],
    ["/sign-in, /sign-up", "Auth (email/password + magic link + OAuth)"],
    ["/dashboard, /settings", "Pages protégées (proxy.ts)"],
    ["/pricing", "Plans + Stripe checkout"],
  ],
  API: [
    ["/api/health", "Health check (DB + uptime)"],
    ["/api/og?title=…", "OG image dynamique branded"],
    ["/api/search?q=…", "Search Postgres FTS"],
    ["/api/translate", "AI translate FR↔EN (auth requise)"],
    ["/api/newsletter", "Inscription Resend audience"],
    ["/api/preview", "Active draft mode (auth requise)"],
    ["/api/vitals", "Web Vitals collector"],
    ["/api/auth/*", "Better Auth handlers"],
    ["/api/[collection]", "REST Payload (auto-généré)"],
  ],
  Data: [
    ["/sitemap.xml", "Multi-locale avec hreflang"],
    ["/robots.txt", "Disallow /admin /api"],
    ["/rss.xml, /en/rss.xml", "Feed RSS 2.0 par locale"],
  ],
};

const COMMANDS = [
  ["make dev", "Démarre Postgres + applique migrations + lance Next"],
  ["make types", "Régénère payload-types.ts + importMap admin"],
  ["make payload-migrate", "Applique les migrations Payload pending"],
  ["make seed", "Pré-remplit la DB avec démo (idempotent)"],
  ["make check", "Lint + typecheck + tests unit"],
  ["make test-e2e", "Tests Playwright"],
  ["make clean", "Supprime .next (si écran blanc /admin)"],
  ["make update", "Applique les upgrades du boilerplate"],
  ["make db-reset", "Nuke la DB (avec confirmation)"],
];

export default function FeaturesPage() {
  const features = [
    {
      name: "Postgres",
      via: "DATABASE_URI",
      active: !!process.env.DATABASE_URI,
    },
    {
      name: "Resend (emails)",
      via: "RESEND_API_KEY",
      active: !!process.env.RESEND_API_KEY,
    },
    {
      name: "Stripe",
      via: "STRIPE_SECRET_KEY",
      active: !!process.env.STRIPE_SECRET_KEY,
    },
    {
      name: "Anthropic (AI translate)",
      via: "ANTHROPIC_API_KEY",
      active: !!process.env.ANTHROPIC_API_KEY,
    },
    {
      name: "OAuth GitHub",
      via: "GITHUB_CLIENT_ID",
      active: !!process.env.GITHUB_CLIENT_ID,
    },
    {
      name: "OAuth Google",
      via: "GOOGLE_CLIENT_ID",
      active: !!process.env.GOOGLE_CLIENT_ID,
    },
    {
      name: "Plausible Analytics",
      via: "NEXT_PUBLIC_PLAUSIBLE_DOMAIN",
      active: !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    },
    {
      name: "Sentry",
      via: "SENTRY_DSN",
      active: !!(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN),
    },
    {
      name: "Newsletter (Resend audience)",
      via: "RESEND_AUDIENCE_ID",
      active: !!process.env.RESEND_AUDIENCE_ID,
    },
  ];
  const activeCount = features.filter((f) => f.active).length;

  return (
    <DocLayout
      current="/features"
      title="Modules & fonctionnalités"
      intro="Tout ce qui est dans la boîte : collections Payload, globals, blocks réutilisables, routes Next, intégrations tierces, commandes Make."
    >
      <Section
        title={`Configuration — ${activeCount}/${features.length} actifs`}
        anchor="config"
      >
        <p>
          État de configuration de cet environnement. Les features en gris sont
          disponibles mais non configurées (variable d'env absente).
          Renseigne-les dans{" "}
          <code className="font-mono text-foreground">.env.local</code>.
        </p>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2"
            >
              <StatusDot ok={f.active} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">
                  {f.name}
                </div>
                <div className="truncate font-mono text-xs">{f.via}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Collections" anchor="collections">
        <p>
          Modèles de données, exposés via REST{" "}
          <code className="font-mono text-foreground">/api/[collection]</code>{" "}
          et GraphQL.
        </p>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {COLLECTIONS.map(([slug, label, desc]) => (
                <li
                  key={slug}
                  className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <a
                      href={`/admin/collections/${slug}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {label}
                    </a>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                  <code className="shrink-0 font-mono text-xs">{slug}</code>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section title="Globals" anchor="globals">
        <p>
          Singletons (un seul doc par site, pas de liste). Souvent localisés.
        </p>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {GLOBALS.map(([slug, label, desc]) => (
                <li
                  key={slug}
                  className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <a
                      href={`/admin/globals/${slug}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {label}
                    </a>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                  <code className="shrink-0 font-mono text-xs">{slug}</code>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section title="Blocks" anchor="blocks">
        <p>
          {BLOCKS.length} blocks utilisables dans Pages et Snippets. Chacun
          expose un onglet Apparence (background, padding, max-width, divider)
          et Visibilité (mobile, locale, dates). Voir{" "}
          <Link href="/design" className="text-foreground underline">
            /design
          </Link>{" "}
          pour le rendu visuel.
        </p>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {BLOCKS.map((b) => (
            <li
              key={b}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
            >
              {b}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Routes" anchor="routes">
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(ROUTES).map(([group, routes]) => (
            <Card key={group}>
              <CardHeader>
                <CardTitle className="text-base">{group}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {routes.map(([path, desc]) => (
                    <li key={path}>
                      <code className="font-mono text-xs text-foreground">
                        {path}
                      </code>
                      <div className="text-xs">{desc}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Commandes (Makefile)" anchor="commands">
        <p>
          Tout passe par le Makefile, pour ne pas mémoriser les invocations
          pnpm.
        </p>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              {COMMANDS.map(([cmd, desc]) => (
                <li
                  key={cmd}
                  className="border-b border-border/50 pb-2 last:border-0"
                >
                  <code className="font-mono text-sm text-foreground">
                    {cmd}
                  </code>
                  <div className="text-xs">{desc}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section title="SEO" anchor="seo">
        <p>
          Le boilerplate est SEO-first. Chaque page / post émet automatiquement
          :
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Metadata Next.js (title, description, canonical, og:*, twitter:*)
            générée via{" "}
            <code className="font-mono text-foreground">buildMetadata()</code>
          </li>
          <li>
            Hreflang multi-locale (fr / en / x-default) avec stripping du
            préfixe
          </li>
          <li>
            JSON-LD : Organization, WebSite, WebPage, Article, BreadcrumbList,
            FAQPage, Product, HowTo
          </li>
          <li>
            OG image dynamique branded à{" "}
            <code className="font-mono text-foreground">/api/og?title=…</code>{" "}
            (fallback automatique)
          </li>
          <li>
            Sitemap multi-locale avec{" "}
            <code className="font-mono text-foreground">
              alternates.languages
            </code>
          </li>
          <li>Robots.txt + RSS feeds par locale</li>
          <li>
            Plugin{" "}
            <code className="font-mono text-foreground">
              @payloadcms/plugin-seo
            </code>{" "}
            sur Pages + Posts (onglet Meta auto)
          </li>
        </ul>
      </Section>

      <Section title="Versioning du boilerplate" anchor="versioning">
        <p>
          Chaque site forké a un fichier{" "}
          <code className="font-mono text-foreground">
            .boilerplate-version
          </code>
          . Quand une nouvelle version sort, on récupère les nouveaux scripts
          d'upgrade et on lance :
        </p>
        <Code>{`git fetch upstream main
git checkout upstream/main -- scripts/upgrades/
make update`}</Code>
        <p>
          Le runner liste les upgrades à appliquer, demande confirmation,
          exécute en séquence, et bump
          <code className="font-mono text-foreground">
            {" "}
            .boilerplate-version
          </code>{" "}
          après chaque succès. Voir{" "}
          <code className="font-mono text-foreground">CLAUDE.md</code> pour le
          workflow maintainer.
        </p>
      </Section>
    </DocLayout>
  );
}
