import type { Field, FieldHook } from "payload";
import { slugify } from "./slugify";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Field toolkit — building blocks réutilisables pour les collections Payload.
 *
 *  Chaque fonction retourne un Field config standard. À utiliser dans `fields:`.
 *  Objectif : éviter la duplication boilerplate quand on ajoute une nouvelle
 *  collection (un nouveau modèle métier devrait coûter <30 min, pas 2h).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const slugFromSourceHook =
  (source: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    const incoming = (data as Record<string, unknown> | undefined)?.[source];
    const existing = (originalDoc as Record<string, unknown> | undefined)?.[
      source
    ];
    const fallback =
      (typeof incoming === "string"
        ? incoming
        : typeof existing === "string"
          ? existing
          : null) ?? "";
    if (typeof value === "string" && value.trim()) return slugify(value);
    return fallback ? slugify(fallback) : value;
  };

/**
 * Slug auto-dérivé depuis un autre champ (par défaut "title"), unique, sidebar.
 * Si l'utilisateur saisit son slug à la main, il est resluggifié (slugify normalise).
 */
export const slugField = (opts?: {
  source?: string;
  localized?: boolean;
  required?: boolean;
}): Field => ({
  name: "slug",
  type: "text",
  required: opts?.required ?? true,
  unique: true,
  localized: opts?.localized ?? true,
  admin: {
    position: "sidebar",
    description: `URL-friendly. Dérivé automatiquement de "${opts?.source ?? "title"}" si laissé vide.`,
  },
  hooks: { beforeValidate: [slugFromSourceHook(opts?.source ?? "title")] },
});

/**
 * Excerpt textarea, localisé par défaut, optionnel.
 */
export const excerptField = (opts?: { localized?: boolean }): Field => ({
  name: "excerpt",
  type: "textarea",
  localized: opts?.localized ?? true,
  label: "Extrait",
  admin: {
    description:
      "Phrase courte utilisée comme description SEO et dans les cards.",
  },
});

/**
 * Cover image (relation media, sidebar).
 */
export const coverField = (opts?: {
  name?: string;
  label?: string;
  relationTo?: "media";
}): Field => ({
  name: opts?.name ?? "cover",
  type: "upload",
  relationTo: opts?.relationTo ?? "media",
  ...(opts?.label ? { label: opts.label } : {}),
  admin: { position: "sidebar" },
});

/**
 * Tags (array de strings simple).
 */
export const tagsField = (opts?: {
  localized?: boolean;
  sidebar?: boolean;
  description?: string;
}): Field => ({
  name: "tags",
  type: "array",
  localized: opts?.localized ?? false,
  label: "Tags",
  labels: { singular: "Tag", plural: "Tags" },
  fields: [{ name: "tag", type: "text", required: true }],
  ...(opts?.sidebar || opts?.description
    ? {
        admin: {
          ...(opts.sidebar ? { position: "sidebar" as const } : {}),
          ...(opts.description ? { description: opts.description } : {}),
        },
      }
    : {}),
});

/**
 * Auteur (relation users, sidebar).
 */
export const authorField = (): Field => ({
  name: "author",
  type: "relationship",
  relationTo: "users",
  label: "Auteur",
  admin: { position: "sidebar" },
});

/**
 * Date de publication (sidebar), avec valeur par défaut à la création.
 */
export const publishedAtField = (): Field => ({
  name: "publishedAt",
  type: "date",
  label: "Publié le",
  admin: {
    position: "sidebar",
    date: { pickerAppearance: "dayAndTime" },
    description: "Date affichée publiquement. Différente de createdAt.",
  },
  hooks: {
    beforeChange: [
      ({ value, operation }) => {
        if (operation === "create" && !value) return new Date().toISOString();
        return value;
      },
    ],
  },
});

/**
 * Flag "noindex" + canonical override en sidebar.
 * À appeler dans les collections publiques (Pages, Posts, CaseStudy, etc).
 */
export const seoOverrideFields = (): Field[] => [
  {
    name: "noindex",
    type: "checkbox",
    label: "Ne pas indexer",
    admin: {
      position: "sidebar",
      description:
        'Ajoute <meta name="robots" content="noindex"> et exclut du sitemap.',
    },
  },
  {
    name: "canonical",
    type: "text",
    label: "URL canonique (override)",
    admin: {
      position: "sidebar",
      description: "Optionnel. Override la canonical auto-générée.",
    },
  },
];

/**
 * CSS personnalisé per-doc (sidebar).
 */
export const customCssField = (): Field => ({
  name: "customCss",
  type: "code",
  label: "CSS de la page",
  admin: {
    language: "css",
    description: "Optionnel. Injecté uniquement sur ce document.",
  },
});

/**
 * Onglet "Contenu" qui prend un titre + des fields métier.
 * Wrapper standard pour avoir une structure tabs cohérente.
 */
export const contentTab = (label: string, fields: Field[]): Field => ({
  type: "tabs",
  tabs: [{ label, fields }],
});

/**
 * Helper combiné : les champs sidebar SEO + status + slug pour une collection
 * publique standard (Pages-like). À spreader dans `fields:`.
 */
export const standardSidebarFields = (opts?: {
  slugSource?: string;
}): Field[] => [
  slugField({ source: opts?.slugSource ?? "title" }),
  ...seoOverrideFields(),
];
