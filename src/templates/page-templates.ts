/**
 * Page templates — layouts pré-composés pour démarrer une page rapidement.
 * Le format est exactement celui attendu par le champ Pages.layout (un array de blocks).
 */

export type PageTemplate = {
  id: "landing" | "about" | "pricing-page" | "article";
  name: string;
  description: string;
  defaults: { title: string; slug: string };
  layout: Record<string, unknown>[];
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "landing",
    name: "Landing SaaS",
    description: "Hero + features + témoignages + pricing + CTA + FAQ",
    defaults: { title: "Accueil", slug: "home" },
    layout: [
      {
        blockType: "hero",
        variant: "centered",
        eyebrow: "NOUVEAU",
        title: "Le produit qui change tout",
        subtitle: "Une accroche courte qui dit pourquoi.",
        cta: { label: "Démarrer", href: "/sign-up" },
      },
      {
        blockType: "features",
        heading: "Pourquoi nous",
        intro: "Trois piliers qui font la différence.",
        items: [
          {
            icon: "Zap",
            title: "Rapide",
            description: "Description du pilier 1.",
          },
          {
            icon: "Lock",
            title: "Sécurisé",
            description: "Description du pilier 2.",
          },
          {
            icon: "Sparkles",
            title: "Élégant",
            description: "Description du pilier 3.",
          },
        ],
      },
      {
        blockType: "testimonials",
        heading: "Ce qu'ils en disent",
        columns: "3",
        items: [
          {
            quote: "Citation 1.",
            authorName: "Alice",
            authorRole: "CTO, Acme",
          },
          {
            quote: "Citation 2.",
            authorName: "Bob",
            authorRole: "Founder, Globex",
          },
          {
            quote: "Citation 3.",
            authorName: "Carol",
            authorRole: "Lead, Initech",
          },
        ],
      },
      {
        blockType: "pricing",
        heading: "Tarifs",
        intro: "Simple, transparent.",
        tiers: [
          {
            name: "Starter",
            price: "0 €",
            period: "/ mois",
            features: [{ label: "5 projets" }],
            cta: { label: "Commencer", href: "/sign-up" },
          },
          {
            name: "Pro",
            price: "19 €",
            period: "/ mois",
            features: [
              { label: "Projets illimités" },
              { label: "Support prioritaire" },
            ],
            cta: { label: "Démarrer", href: "/sign-up" },
            highlighted: true,
          },
        ],
      },
      {
        blockType: "faq",
        heading: "Questions fréquentes",
        items: [
          { question: "Question 1 ?", answer: "Réponse 1." },
          { question: "Question 2 ?", answer: "Réponse 2." },
        ],
      },
      {
        blockType: "cta",
        title: "Prêt à démarrer ?",
        description: "Crée ton compte en 30 secondes.",
        buttons: [{ label: "Démarrer", href: "/sign-up", variant: "default" }],
        appearance: { background: "branded" },
      },
    ],
  },
  {
    id: "about",
    name: "À propos",
    description: "Hero + histoire + équipe + chiffres clés",
    defaults: { title: "À propos", slug: "a-propos" },
    layout: [
      {
        blockType: "hero",
        variant: "centered",
        eyebrow: "À PROPOS",
        title: "Notre mission",
        subtitle: "Construire un produit dont on est fier.",
      },
      {
        blockType: "richText",
        content: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "Notre histoire commence ici. Édite ce bloc pour raconter la tienne.",
                  },
                ],
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
      },
      {
        blockType: "stats",
        heading: "En chiffres",
        items: [
          { value: "10+", label: "Années d'expertise" },
          { value: "500+", label: "Clients satisfaits" },
          { value: "99.9%", label: "Uptime" },
        ],
      },
    ],
  },
  {
    id: "pricing-page",
    name: "Tarifs",
    description: "Hero + grille tarifaire + FAQ",
    defaults: { title: "Tarifs", slug: "tarifs" },
    layout: [
      {
        blockType: "hero",
        variant: "centered",
        title: "Choisis ton plan",
        subtitle: "Simple, transparent, sans surprise.",
      },
      {
        blockType: "pricing",
        tiers: [
          {
            name: "Starter",
            price: "0 €",
            period: "/ mois",
            features: [{ label: "5 projets" }],
            cta: { label: "Commencer", href: "/sign-up" },
          },
          {
            name: "Pro",
            price: "19 €",
            period: "/ mois",
            features: [{ label: "Illimité" }, { label: "Support prioritaire" }],
            cta: { label: "Démarrer", href: "/sign-up" },
            highlighted: true,
          },
          {
            name: "Team",
            price: "Sur devis",
            features: [{ label: "Tout Pro" }, { label: "SSO" }],
            cta: { label: "Contact", href: "/contact" },
          },
        ],
      },
      {
        blockType: "faq",
        heading: "Questions fréquentes",
        items: [
          {
            question: "Puis-je annuler à tout moment ?",
            answer: "Oui, sans frais.",
          },
          {
            question: "Comment fonctionne la facturation ?",
            answer: "Mensuelle ou annuelle, ton choix.",
          },
        ],
      },
    ],
  },
  {
    id: "article",
    name: "Article long",
    description: "Hero compact + texte mis en forme + CTA",
    defaults: { title: "Article", slug: "mon-article" },
    layout: [
      {
        blockType: "hero",
        variant: "centered",
        title: "Titre de l'article",
        subtitle: "Une accroche en une phrase.",
        appearance: { padding: "sm" },
      },
      {
        blockType: "richText",
        content: {
          root: {
            type: "root",
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: "Premier paragraphe. Édite-moi pour écrire ton article.",
                  },
                ],
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
          },
        },
        appearance: { maxWidth: "narrow" },
      },
      {
        blockType: "cta",
        title: "Tu as aimé ?",
        description: "Découvre les autres articles.",
        buttons: [{ label: "Voir le blog", href: "/blog", variant: "default" }],
      },
    ],
  },
];
