/**
 * mock/data.ts
 * ============
 * Données de base pour lancer le site sans Directus.
 * Activer avec NEXT_PUBLIC_USE_MOCK=true dans .env.local.
 *
 * Remplacer ces valeurs par votre contenu réel,
 * ou connecter Directus et désactiver le mock.
 */

import type { SiteSettings, MenuItem, Post, CaseStudy, Member, ProductModule } from "@/lib/types";

/* ─── Site settings ──────────────────────────────────────────────── */

export const MOCK_SETTINGS: SiteSettings = {
  site_name:   "Mon Projet",
  tagline:     "Votre tagline ici",
  description: "Description de votre activité en quelques mots.",
  email:       "contact@votre-domaine.fr",
  phone:       "+33 1 00 00 00 00",
  address:     "Paris, France",
  linkedin_url: "https://linkedin.com",
};

/* ─── Menus ──────────────────────────────────────────────────────── */

export const MOCK_TOP_MENU: MenuItem[] = [
  { id: 1, label: "Accueil",   path: "/",         sort: 1, active: true, parent: null },
  { id: 2, label: "Services",  path: "/proposal", sort: 2, active: true, parent: null },
  { id: 3, label: "Blog",      path: "/blog",     sort: 3, active: true, parent: null },
  { id: 4, label: "Contact",   path: "/contact",  sort: 4, active: true, parent: null },
];

export const MOCK_FOOTER_MENU: MenuItem[] = [
  { id: 5, label: "Accueil",        path: "/",          sort: 1, active: true, parent: null },
  { id: 6, label: "Nos services",   path: "/proposal",  sort: 2, active: true, parent: null },
  { id: 7, label: "Blog",           path: "/blog",      sort: 3, active: true, parent: null },
  { id: 8, label: "Mentions légales", path: "/mentions", sort: 4, active: true, parent: null },
];

export const MOCK_FOOTER_CONTACT_MENU: MenuItem[] = [
  { id: 9,  label: "contact@votre-domaine.fr", path: "mailto:contact@votre-domaine.fr", sort: 1, active: true, parent: null },
  { id: 10, label: "+33 1 00 00 00 00",        path: "tel:+33100000000",               sort: 2, active: true, parent: null },
];

/* ─── Products / Services ────────────────────────────────────────── */

export const MOCK_PRODUCTS: (ProductModule & Record<string, unknown>)[] = [
  {
    id:          "1",
    slug:        "audit-strategique",
    title:       "Audit stratégique",
    description: "Évaluez votre positionnement et identifiez vos leviers de croissance.",
    excerpt:     "Vous avez besoin d'une vision claire de vos forces et faiblesses pour prendre les bonnes décisions.",
    axe:         "growth",
    persona:     "dirigeants",
    duration:    "4 à 6 semaines",
    deliverable: "Rapport d'audit + recommandations",
    format:      "Entretiens + analyse documentaire",
    why:         "- Vous traversez une période de transformation\n- Vous souhaitez valider vos hypothèses stratégiques\n- Vos résultats stagnent malgré vos efforts",
    how:         "Nous menons des entretiens approfondis avec vos équipes et analysons vos données pour produire un diagnostic actionnable.",
    benefits:    ["Vision claire de vos atouts", "Feuille de route priorisée", "Recommandations opérationnelles"],
    budget:      "Sur devis",
    image:       undefined,
    sort:        1,
  },
  {
    id:          "2",
    slug:        "accompagnement-transformation",
    title:       "Accompagnement transformation",
    description: "Un accompagnement sur mesure pour piloter votre projet de changement.",
    excerpt:     "La transformation ne se décrète pas — elle se conduit avec méthode et en impliquant vos équipes.",
    axe:         "growth",
    persona:     "dirigeants,investisseurs",
    duration:    "3 à 12 mois",
    deliverable: "Plan de transformation + suivi mensuel",
    format:      "Coaching + ateliers collectifs",
    why:         "- Vous lancez un projet structurant\n- Vos équipes résistent au changement\n- Vous avez besoin d'un regard externe",
    how:         "Nous co-construisons votre plan de transformation et vous accompagnons à chaque étape avec des points réguliers.",
    benefits:    ["Équipes engagées", "Risques maîtrisés", "Résultats mesurables"],
    budget:      "À partir de 5 000 € / mois",
    image:       undefined,
    sort:        2,
  },
  {
    id:          "3",
    slug:        "formation-equipes",
    title:       "Formation équipes",
    description: "Développez les compétences de vos collaborateurs sur les enjeux stratégiques.",
    excerpt:     "Vos équipes sont votre premier actif — investir dans leurs compétences, c'est investir dans votre avenir.",
    axe:         "resilience",
    persona:     "dirigeants",
    duration:    "1 à 3 jours",
    deliverable: "Support de formation + plan d'action individuel",
    format:      "Présentiel ou distanciel",
    why:         "- Vos managers ont besoin de monter en compétences\n- Vous souhaitez diffuser une culture stratégique\n- Vos équipes font face à de nouveaux défis",
    how:         "Des formations concrètes, ancrées dans vos réalités opérationnelles, avec des mises en situation pratiques.",
    benefits:    ["Compétences renforcées", "Autonomie accrue", "Culture commune"],
    budget:      "À partir de 2 500 € / jour",
    image:       undefined,
    sort:        3,
  },
];

/* ─── Blog posts ─────────────────────────────────────────────────── */

export const MOCK_POSTS: Post[] = [
  {
    id:           "1",
    title:        "Titre de votre premier article",
    subtitle:     "Un sous-titre accrocheur",
    excerpt:      "Un résumé de l'article en quelques lignes pour donner envie de lire la suite.",
    slug:         "premier-article",
    status:       "published",
    date_created: "2024-01-15T10:00:00Z",
    readtime:     5,
    tier:         undefined,
    category:     { id: "1", title: "Stratégie" },
    image:        undefined,
  },
  {
    id:           "2",
    title:        "Deuxième article de démonstration",
    subtitle:     "Explorer un sujet en profondeur",
    excerpt:      "Cet article illustre la structure d'un contenu éditorial sur votre thématique principale.",
    slug:         "deuxieme-article",
    status:       "published",
    date_created: "2024-02-01T10:00:00Z",
    readtime:     8,
    tier:         undefined,
    category:     { id: "2", title: "Transformation" },
    image:        undefined,
  },
  {
    id:           "3",
    title:        "Troisième article — votre expertise en action",
    subtitle:     "Un cas concret",
    excerpt:      "Démontrez votre expertise à travers un exemple concret et des résultats mesurables.",
    slug:         "troisieme-article",
    status:       "published",
    date_created: "2024-03-10T10:00:00Z",
    readtime:     6,
    tier:         undefined,
    category:     { id: "1", title: "Stratégie" },
    image:        undefined,
  },
];

/* ─── Case studies / Références ─────────────────────────────────── */

export const MOCK_CASES: CaseStudy[] = [
  {
    id:            "1",
    slug:          "reference-client-1",
    title:         "Transformation d'une ETI industrielle",
    subtitle:      "Croissance de 30% en 18 mois",
    description:   "Accompagnement complet d'un groupe industriel dans sa réorganisation stratégique.",
    client_sector: "industry",
    client_size:   "eti",
    eyebrow:       "Industrie",
    status:        "published",
    date_created:  "2024-01-01T00:00:00Z",
  },
  {
    id:            "2",
    slug:          "reference-client-2",
    title:         "Repositionnement stratégique",
    subtitle:      "Nouveau marché conquis en 12 mois",
    description:   "Audit et redéfinition du positionnement pour une PME de services.",
    client_sector: "tech",
    client_size:   "pme",
    eyebrow:       "Tech & Services",
    status:        "published",
    date_created:  "2024-02-01T00:00:00Z",
  },
];

/* ─── Team ───────────────────────────────────────────────────────── */

export const MOCK_MEMBERS: Member[] = [
  {
    id:                "1",
    first_name:        "Prénom",
    last_name:         "Nom",
    title:             "Prénom Nom",
    role:              "Fondateur & Directeur",
    subtitle:          "Fondateur & Directeur",
    short_description: "Expert en stratégie avec 15 ans d'expérience.",
    sort:              1,
  },
  {
    id:                "2",
    first_name:        "Prénom",
    last_name:         "Associé",
    title:             "Prénom Associé",
    role:              "Associé",
    subtitle:          "Associé",
    short_description: "Spécialiste en transformation organisationnelle.",
    sort:              2,
  },
];
