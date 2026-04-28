/**
 * Block presets — configurations pré-stylées pour insérer rapidement un block sur une page existante.
 * Format : un object par preset, avec le `blockType` et les valeurs des champs.
 * Utilisé par BlockPresetGallery (admin) qui appelle /api/admin/append-block-preset.
 */

export type BlockPreset = {
  id: string;
  category:
    | "hero"
    | "features"
    | "cta"
    | "social-proof"
    | "pricing"
    | "content";
  label: string;
  description: string;
  data: Record<string, unknown>;
};

export const BLOCK_PRESETS: BlockPreset[] = [
  // ── Heroes ────────────────────────────────────────────────
  {
    id: "hero-minimal",
    category: "hero",
    label: "Hero — Minimal",
    description: "Eyebrow + titre + accroche + 1 CTA, centré.",
    data: {
      blockType: "hero",
      variant: "centered",
      eyebrow: "NOUVEAU",
      title: "Le titre de votre produit",
      subtitle: "Une phrase courte qui dit pourquoi.",
      cta: { label: "Démarrer", href: "/sign-up" },
    },
  },
  {
    id: "hero-split",
    category: "hero",
    label: "Hero — Split (texte + image)",
    description: "Texte à gauche, image à droite.",
    data: {
      blockType: "hero",
      variant: "split",
      title: "Présentez votre produit",
      subtitle: "Décrivez la valeur en 2 lignes maximum.",
      cta: { label: "Voir la démo", href: "#demo" },
    },
  },

  // ── Features ──────────────────────────────────────────────
  {
    id: "features-trio",
    category: "features",
    label: "Features — 3 piliers",
    description: "Trois colonnes avec icône + titre + description.",
    data: {
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
  },
  {
    id: "features-quad",
    category: "features",
    label: "Features — 4 capacités",
    description: "Quatre cartes en grille 2×2.",
    data: {
      blockType: "features",
      heading: "Tout ce qu'il vous faut",
      items: [
        { icon: "Boxes", title: "Modulaire", description: "…" },
        { icon: "Palette", title: "Personnalisable", description: "…" },
        { icon: "Shield", title: "Robuste", description: "…" },
        { icon: "Globe", title: "Multilingue", description: "…" },
      ],
    },
  },

  // ── CTAs ──────────────────────────────────────────────────
  {
    id: "cta-end-of-page",
    category: "cta",
    label: "CTA — Bandeau de fin de page",
    description: "Une dernière chance de convertir.",
    data: {
      blockType: "cta",
      heading: "Prêt à vous lancer ?",
      subheading: "Démarrez en moins d'une minute, sans carte bancaire.",
      cta: { label: "Créer un compte", href: "/sign-up" },
    },
  },
  {
    id: "cta-newsletter",
    category: "cta",
    label: "CTA — Inscription newsletter",
    description: "Bandeau d'inscription email.",
    data: {
      blockType: "newsletter",
      heading: "Restez informés",
      description: "Une fois par mois, pas de spam.",
      buttonLabel: "S'inscrire",
    },
  },

  // ── Social proof ──────────────────────────────────────────
  {
    id: "social-logos",
    category: "social-proof",
    label: "Logos clients",
    description: 'Bandeau "ils nous font confiance".',
    data: {
      blockType: "logoCloud",
      heading: "Ils nous font confiance",
      logos: [],
    },
  },
  {
    id: "social-testimonials-3",
    category: "social-proof",
    label: "Témoignages — 3 colonnes",
    description: "Trois citations avec auteur + rôle.",
    data: {
      blockType: "testimonials",
      heading: "Ce qu'ils en disent",
      columns: "3",
      items: [
        { quote: "Citation 1.", authorName: "Alice", authorRole: "CTO, Acme" },
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
  },
  {
    id: "stats-numbers",
    category: "social-proof",
    label: "Chiffres clés",
    description: "Quatre statistiques alignées.",
    data: {
      blockType: "stats",
      items: [
        { value: "10k+", label: "Utilisateurs" },
        { value: "99.9%", label: "Uptime" },
        { value: "24h/7", label: "Support" },
        { value: "4.8★", label: "Satisfaction" },
      ],
    },
  },

  // ── Content ───────────────────────────────────────────────
  {
    id: "content-faq",
    category: "content",
    label: "FAQ",
    description: "Questions/réponses (émet aussi du JSON-LD FAQPage).",
    data: {
      blockType: "faq",
      heading: "Questions fréquentes",
      items: [
        { question: "Question 1 ?", answer: "Réponse 1." },
        { question: "Question 2 ?", answer: "Réponse 2." },
        { question: "Question 3 ?", answer: "Réponse 3." },
      ],
    },
  },

  // ── Pricing ───────────────────────────────────────────────
  {
    id: "pricing-3plans",
    category: "pricing",
    label: "Pricing — 3 plans",
    description: "Grille 3 colonnes avec plan recommandé au centre.",
    data: {
      blockType: "pricing",
      heading: "Tarifs simples et transparents",
      plans: [
        {
          name: "Starter",
          price: "0 €",
          period: "/mois",
          features: [{ feature: "Feature 1" }, { feature: "Feature 2" }],
          cta: { label: "Démarrer", href: "/sign-up" },
        },
        {
          name: "Pro",
          price: "29 €",
          period: "/mois",
          recommended: true,
          features: [
            { feature: "Tout Starter" },
            { feature: "Feature avancée" },
          ],
          cta: { label: "Choisir Pro", href: "/checkout" },
        },
        {
          name: "Enterprise",
          price: "Sur devis",
          features: [{ feature: "Tout Pro" }, { feature: "SLA 99.99%" }],
          cta: { label: "Nous contacter", href: "/contact" },
        },
      ],
    },
  },
];

export const groupByCategory = () => {
  const out: Record<string, BlockPreset[]> = {};
  for (const p of BLOCK_PRESETS) {
    out[p.category] ??= [];
    out[p.category].push(p);
  }
  return out;
};

export const findPreset = (id: string) =>
  BLOCK_PRESETS.find((p) => p.id === id) ?? null;
