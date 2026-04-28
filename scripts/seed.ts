/**
 * pnpm seed — pré-remplit la DB avec :
 *   - 1 home page (FR + EN)
 *   - 2 pages (about, pricing) FR + EN
 *   - 2 posts FR + EN
 *   - 1 snippet (footer banner)
 *   - Header / Footer / Settings / SEO / Brand
 *
 * Idempotent : utilise `slug` comme clé d'unicité.
 */
import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";

const upsertPage = async (
  client: Awaited<ReturnType<typeof getPayload>>,
  locale: "fr" | "en",
  data: { title: string; slug: string; layout: unknown[] },
) => {
  const existing = await client.find({
    collection: "pages",
    where: { slug: { equals: data.slug } },
    locale,
    limit: 1,
  });
  if (existing.docs[0]) {
    await client.update({
      collection: "pages",
      id: existing.docs[0].id,
      locale,
      data: { ...data, _status: "published" } as never,
    });
    console.log(`  ↻  page "${data.slug}" (${locale}) updated`);
  } else {
    await client.create({
      collection: "pages",
      locale,
      data: { ...data, _status: "published" } as never,
    });
    console.log(`  ✓  page "${data.slug}" (${locale}) created`);
  }
};

const upsertPost = async (
  client: Awaited<ReturnType<typeof getPayload>>,
  locale: "fr" | "en",
  data: { title: string; slug: string; excerpt: string },
) => {
  const existing = await client.find({
    collection: "posts",
    where: { slug: { equals: data.slug } },
    locale,
    limit: 1,
  });
  if (existing.docs[0]) {
    await client.update({
      collection: "posts",
      id: existing.docs[0].id,
      locale,
      data: { ...data, _status: "published" } as never,
    });
    console.log(`  ↻  post "${data.slug}" (${locale}) updated`);
  } else {
    await client.create({
      collection: "posts",
      locale,
      data: { ...data, _status: "published" } as never,
    });
    console.log(`  ✓  post "${data.slug}" (${locale}) created`);
  }
};

async function main() {
  const client = await getPayload({ config });

  console.log("\n📦  Seeding…\n");

  // Brand global (preset Modern par défaut)
  await client.updateGlobal({
    slug: "brand",
    data: { preset: "modern" } as never,
  });
  console.log("  ✓  brand global");

  // Settings (FR)
  await client.updateGlobal({
    slug: "settings",
    locale: "fr",
    data: {
      siteName: "Folio",
      siteDescription: "Boilerplate Next + Payload, orienté contenu et SEO.",
    } as never,
  });
  await client.updateGlobal({
    slug: "settings",
    locale: "en",
    data: {
      siteName: "Folio",
      siteDescription:
        "Next + Payload boilerplate, content-first and SEO-native.",
    } as never,
  });
  console.log("  ✓  settings (fr + en)");

  // SEO
  await client.updateGlobal({
    slug: "seo",
    locale: "fr",
    data: { titleTemplate: "%s — %siteName%" } as never,
  });
  console.log("  ✓  seo");

  // Header
  await client.updateGlobal({
    slug: "header",
    locale: "fr",
    data: {
      nav: [
        { label: "À propos", href: "/about" },
        { label: "Tarifs", href: "/pricing-page" },
        { label: "Blog", href: "/blog" },
      ],
      cta: { label: "Démarrer", href: "/sign-up" },
    } as never,
  });
  await client.updateGlobal({
    slug: "header",
    locale: "en",
    data: {
      nav: [
        { label: "About", href: "/about" },
        { label: "Pricing", href: "/pricing-page" },
        { label: "Blog", href: "/blog" },
      ],
      cta: { label: "Get started", href: "/sign-up" },
    } as never,
  });
  console.log("  ✓  header (fr + en)");

  // Footer
  await client.updateGlobal({
    slug: "footer",
    locale: "fr",
    data: {
      tagline: "Construit avec ❤️ et beaucoup de café.",
      copyright: `© ${new Date().getFullYear()} Mon Boilerplate`,
    } as never,
  });
  await client.updateGlobal({
    slug: "footer",
    locale: "en",
    data: {
      tagline: "Built with ❤️ and lots of coffee.",
      copyright: `© ${new Date().getFullYear()} My Boilerplate`,
    } as never,
  });
  console.log("  ✓  footer (fr + en)");

  // About page
  await upsertPage(client, "fr", {
    title: "À propos",
    slug: "about",
    layout: [
      {
        blockType: "hero",
        variant: "centered",
        eyebrow: "À PROPOS",
        title: "Construit pour aller vite",
        subtitle: "Un boilerplate qui te débarrasse du boilerplate.",
      },
      {
        blockType: "features",
        heading: "Pourquoi nous",
        items: [
          {
            icon: "Zap",
            title: "Rapide",
            description: "Du dev au ship en quelques heures.",
          },
          {
            icon: "Lock",
            title: "Sécurisé",
            description: "Sessions, OAuth, magic links.",
          },
          {
            icon: "Sparkles",
            title: "Élégant",
            description: "shadcn/ui + brand cohérent.",
          },
        ],
      },
    ],
  });
  await upsertPage(client, "en", {
    title: "About",
    slug: "about",
    layout: [
      {
        blockType: "hero",
        variant: "centered",
        eyebrow: "ABOUT",
        title: "Built to ship fast",
        subtitle: "A boilerplate that gets the boilerplate out of your way.",
      },
      {
        blockType: "features",
        heading: "Why us",
        items: [
          {
            icon: "Zap",
            title: "Fast",
            description: "From dev to ship in hours.",
          },
          {
            icon: "Lock",
            title: "Secure",
            description: "Sessions, OAuth, magic links.",
          },
          {
            icon: "Sparkles",
            title: "Polished",
            description: "shadcn/ui + consistent brand.",
          },
        ],
      },
    ],
  });

  // Pricing page
  await upsertPage(client, "fr", {
    title: "Tarifs",
    slug: "pricing-page",
    layout: [
      {
        blockType: "pricing",
        heading: "Choisis ton plan",
        intro: "Simple, transparent, sans surprise.",
        tiers: [
          {
            name: "Starter",
            price: "0 €",
            period: "/ mois",
            features: [
              { label: "5 projets" },
              { label: "Support communautaire" },
            ],
            cta: { label: "Commencer", href: "/sign-up" },
          },
          {
            name: "Pro",
            price: "19 €",
            period: "/ mois",
            features: [
              { label: "Projets illimités" },
              { label: "Support prioritaire" },
              { label: "Analytics avancés" },
            ],
            cta: { label: "Démarrer", href: "/sign-up" },
            highlighted: true,
          },
          {
            name: "Team",
            price: "Sur devis",
            features: [
              { label: "Tout Pro" },
              { label: "SSO" },
              { label: "SLA 99.9%" },
            ],
            cta: { label: "Contact", href: "/contact" },
          },
        ],
      },
    ],
  });
  await upsertPage(client, "en", {
    title: "Pricing",
    slug: "pricing-page",
    layout: [
      {
        blockType: "pricing",
        heading: "Pick your plan",
        intro: "Simple, transparent pricing.",
        tiers: [
          {
            name: "Starter",
            price: "$0",
            period: "/ month",
            features: [{ label: "5 projects" }, { label: "Community support" }],
            cta: { label: "Get started", href: "/sign-up" },
          },
          {
            name: "Pro",
            price: "$19",
            period: "/ month",
            features: [
              { label: "Unlimited projects" },
              { label: "Priority support" },
              { label: "Advanced analytics" },
            ],
            cta: { label: "Start", href: "/sign-up" },
            highlighted: true,
          },
          {
            name: "Team",
            price: "Talk to us",
            features: [
              { label: "Everything in Pro" },
              { label: "SSO" },
              { label: "99.9% SLA" },
            ],
            cta: { label: "Contact", href: "/contact" },
          },
        ],
      },
    ],
  });

  // Posts
  await upsertPost(client, "fr", {
    title: "Hello World",
    slug: "hello-world",
    excerpt: "Premier article de demo.",
  });
  await upsertPost(client, "en", {
    title: "Hello World",
    slug: "hello-world",
    excerpt: "First demo post.",
  });

  console.log("\n✅  Seed terminé\n");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
