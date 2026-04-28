import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../lib/revalidate";
import { isAdmin } from "../lib/access";
import { applyBrandPreset } from "../lib/brand-presets";

const HEX_OR_OKLCH = /^(#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})|oklch\([^)]+\))$/;
const validateColor = (value: unknown) =>
  !value || (typeof value === "string" && HEX_OR_OKLCH.test(value))
    ? true
    : "Format hex (#abc / #aabbcc) ou oklch(...) attendu";

const colorField = (
  name: string,
  label: string,
  defaultValue: string,
  description?: string,
) => ({
  name,
  type: "text" as const,
  defaultValue,
  label,
  validate: validateColor,
  admin: {
    components: { Field: "/admin/fields/ColorPicker" },
    ...(description ? { description } : {}),
  },
});

const colorPair = (
  bg: { name: string; label: string; def: string },
  fg: { name: string; label: string; def: string },
  description?: string,
) => ({
  type: "row" as const,
  fields: [
    colorField(bg.name, bg.label, bg.def, description),
    colorField(fg.name, fg.label, fg.def),
  ],
});

export const Brand: GlobalConfig = {
  slug: "brand",
  label: "Identité de marque",
  admin: {
    group: "Configuration",
    description:
      "Choisis un scénario pour appliquer une charte cohérente, ou règle chaque couleur à la main. Les utilisateurs avancés peuvent surcharger via l'onglet CSS personnalisé.",
    hidden: ({ user }) => (user as { role?: string } | null)?.role !== "admin",
  },
  hooks: {
    beforeChange: [applyBrandPreset],
    afterChange: [revalidateGlobal],
  },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ── Scénario ────────────────────────────────────────────────────
        {
          label: "Scénario",
          description:
            "Le moyen le plus rapide d'avoir un site cohérent. Choisis un scénario et toutes les couleurs claires + sombres sont remplies pour toi. Tu peux ensuite ajuster.",
          fields: [
            {
              name: "preset",
              type: "select",
              defaultValue: "modern",
              label: "Scénario",
              options: [
                {
                  label: "— Personnalisé (ne rien remplacer)",
                  value: "custom",
                },
                { label: "Modern — Indigo + Cyan, neutre", value: "modern" },
                {
                  label: "Editorial — Slate + Ambre, sérif",
                  value: "editorial",
                },
                { label: "Bold — Noir + Lime, type display", value: "bold" },
                { label: "Minimal — Neutres + Geist", value: "minimal" },
                { label: "Warm — Terracotta + Sable", value: "warm" },
                { label: "Premium — Bleu nuit + Or", value: "premium" },
                { label: "Tech — Cyan + Magenta", value: "tech" },
              ],
              admin: {
                description:
                  'À chaque sauvegarde, si ≠ "personnalisé", remplace toutes les couleurs (clair + sombre), la typo et le radius par ceux du scénario.',
              },
            },
          ],
        },

        // ── Mode clair ──────────────────────────────────────────────────
        {
          label: "Mode clair",
          description:
            "Couleurs utilisées sur le site quand le visiteur est en mode clair (ou n'a pas de préférence).",
          fields: [
            {
              type: "collapsible",
              label: "Surfaces & texte",
              admin: { initCollapsed: false },
              fields: [
                colorPair(
                  { name: "background", label: "Fond de page", def: "#ffffff" },
                  {
                    name: "foreground",
                    label: "Texte principal",
                    def: "#0a0a0a",
                  },
                  "Le fond global du site et la couleur de texte par-dessus.",
                ),
                colorPair(
                  { name: "card", label: "Fond carte", def: "#ffffff" },
                  {
                    name: "cardForeground",
                    label: "Texte carte",
                    def: "#0a0a0a",
                  },
                  "Couleurs des cards, panels et conteneurs élevés.",
                ),
                colorPair(
                  { name: "muted", label: "Fond atténué", def: "#f5f5f5" },
                  {
                    name: "mutedForeground",
                    label: "Texte atténué",
                    def: "#737373",
                  },
                  "Sections discrètes, badges, métadonnées.",
                ),
              ],
            },
            {
              type: "collapsible",
              label: "Marque & accents",
              admin: { initCollapsed: false },
              fields: [
                colorPair(
                  { name: "primary", label: "Primaire", def: "#6366f1" },
                  {
                    name: "primaryForeground",
                    label: "Texte sur primaire",
                    def: "#ffffff",
                  },
                  "Boutons principaux, liens, focus rings.",
                ),
                colorPair(
                  { name: "accent", label: "Accent", def: "#22d3ee" },
                  {
                    name: "accentForeground",
                    label: "Texte sur accent",
                    def: "#0a0a0a",
                  },
                  "Highlights, badges, CTAs secondaires.",
                ),
                colorField(
                  "secondary",
                  "Secondaire (optionnel)",
                  "#a855f7",
                  "Boutons alternatifs, dégradés.",
                ),
              ],
            },
            {
              type: "collapsible",
              label: "Bordures & focus",
              admin: { initCollapsed: true },
              fields: [
                {
                  type: "row",
                  fields: [
                    colorField("border", "Bordure", "#e5e5e5"),
                    colorField("input", "Bordure input", "#e5e5e5"),
                    colorField("ring", "Anneau de focus", "#6366f1"),
                  ],
                },
              ],
            },
            {
              type: "collapsible",
              label: "États (succès, alerte, erreur)",
              admin: { initCollapsed: true },
              fields: [
                {
                  type: "row",
                  fields: [
                    colorField("success", "Succès", "#10b981"),
                    colorField("warning", "Alerte", "#f59e0b"),
                    colorField("destructive", "Erreur", "#ef4444"),
                  ],
                },
              ],
            },
          ],
        },

        // ── Mode sombre ─────────────────────────────────────────────────
        {
          label: "Mode sombre",
          description:
            "Couleurs utilisées quand le visiteur est en mode sombre. Si tu laisses ces champs vides, le scénario en applique des valeurs cohérentes par défaut.",
          fields: [
            {
              name: "dark",
              type: "group",
              label: "",
              fields: [
                {
                  type: "collapsible",
                  label: "Surfaces & texte",
                  admin: { initCollapsed: false },
                  fields: [
                    colorPair(
                      {
                        name: "background",
                        label: "Fond de page",
                        def: "#0a0a0a",
                      },
                      {
                        name: "foreground",
                        label: "Texte principal",
                        def: "#fafafa",
                      },
                    ),
                    colorPair(
                      { name: "card", label: "Fond carte", def: "#0f0f0f" },
                      {
                        name: "cardForeground",
                        label: "Texte carte",
                        def: "#fafafa",
                      },
                    ),
                    colorPair(
                      { name: "muted", label: "Fond atténué", def: "#1a1a1a" },
                      {
                        name: "mutedForeground",
                        label: "Texte atténué",
                        def: "#a3a3a3",
                      },
                    ),
                  ],
                },
                {
                  type: "collapsible",
                  label: "Marque & accents",
                  admin: { initCollapsed: false },
                  fields: [
                    colorPair(
                      { name: "primary", label: "Primaire", def: "#818cf8" },
                      {
                        name: "primaryForeground",
                        label: "Texte sur primaire",
                        def: "#0a0a0a",
                      },
                    ),
                    colorPair(
                      { name: "accent", label: "Accent", def: "#67e8f9" },
                      {
                        name: "accentForeground",
                        label: "Texte sur accent",
                        def: "#0a0a0a",
                      },
                    ),
                    colorField("secondary", "Secondaire", "#c084fc"),
                  ],
                },
                {
                  type: "collapsible",
                  label: "Bordures & focus",
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        colorField("border", "Bordure", "#262626"),
                        colorField("input", "Bordure input", "#262626"),
                        colorField("ring", "Anneau de focus", "#818cf8"),
                      ],
                    },
                  ],
                },
                {
                  type: "collapsible",
                  label: "États (succès, alerte, erreur)",
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        colorField("success", "Succès", "#34d399"),
                        colorField("warning", "Alerte", "#fbbf24"),
                        colorField("destructive", "Erreur", "#f87171"),
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Composants ──────────────────────────────────────────────────
        {
          label: "Composants",
          description:
            "Style des éléments d'interface partagés sur tout le site.",
          fields: [
            {
              name: "buttonStyle",
              type: "select",
              defaultValue: "fill",
              label: "Style des boutons (par défaut)",
              options: [
                { label: "Plein (fill)", value: "fill" },
                { label: "Contour (outline)", value: "outline" },
                { label: "Doux (soft, fond translucide)", value: "soft" },
                { label: "Fantôme (ghost, sans fond)", value: "ghost" },
              ],
              admin: {
                description:
                  "Variante de base. Les blocks peuvent toujours surcharger sur leurs propres CTAs.",
              },
            },
            {
              name: "radius",
              type: "select",
              defaultValue: "md",
              label: "Arrondi des éléments",
              options: [
                { label: "Carré (0px)", value: "none" },
                { label: "Petit (4px)", value: "sm" },
                { label: "Moyen (8px)", value: "md" },
                { label: "Grand (14px)", value: "lg" },
                { label: "Très grand (20px)", value: "xl" },
                { label: "Pleinement arrondi", value: "full" },
              ],
            },
            {
              name: "shadow",
              type: "select",
              defaultValue: "sm",
              label: "Ombre des cards",
              options: [
                { label: "Aucune", value: "none" },
                { label: "Subtile", value: "sm" },
                { label: "Moyenne", value: "md" },
                { label: "Marquée", value: "lg" },
              ],
            },
          ],
        },

        // ── Typographie ─────────────────────────────────────────────────
        {
          label: "Typographie",
          fields: [
            {
              name: "fontHeading",
              type: "select",
              defaultValue: "Inter",
              label: "Police des titres",
              options: [
                { label: "Inter", value: "Inter" },
                { label: "Manrope", value: "Manrope" },
                { label: "Geist", value: "Geist" },
                { label: "DM Sans", value: "DM Sans" },
                { label: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
                { label: "Outfit", value: "Outfit" },
                { label: "Space Grotesk", value: "Space Grotesk" },
                { label: "Lora (serif)", value: "Lora" },
                {
                  label: "Playfair Display (serif)",
                  value: "Playfair Display",
                },
                { label: "Merriweather (serif)", value: "Merriweather" },
                {
                  label: "Cormorant Garamond (serif)",
                  value: "Cormorant Garamond",
                },
                { label: "Système", value: "system" },
              ],
            },
            {
              name: "fontBody",
              type: "select",
              defaultValue: "Inter",
              label: "Police du corps",
              options: [
                { label: "Inter", value: "Inter" },
                { label: "Manrope", value: "Manrope" },
                { label: "Geist", value: "Geist" },
                { label: "DM Sans", value: "DM Sans" },
                { label: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
                { label: "Outfit", value: "Outfit" },
                { label: "Space Grotesk", value: "Space Grotesk" },
                { label: "Lora (serif)", value: "Lora" },
                {
                  label: "Source Serif Pro (serif)",
                  value: "Source Serif Pro",
                },
                { label: "Système", value: "system" },
              ],
            },
            {
              name: "fontMono",
              type: "select",
              defaultValue: "JetBrains Mono",
              label: "Police monospace",
              options: [
                { label: "JetBrains Mono", value: "JetBrains Mono" },
                { label: "Geist Mono", value: "Geist Mono" },
                { label: "IBM Plex Mono", value: "IBM Plex Mono" },
                { label: "Fira Code", value: "Fira Code" },
                { label: "Système", value: "system" },
              ],
            },
          ],
        },

        // ── Logo ────────────────────────────────────────────────────────
        {
          label: "Logo",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "logoLight",
                  type: "upload",
                  relationTo: "media",
                  label: "Logo (mode clair)",
                  admin: {
                    description:
                      "Affiché en mode clair. SVG ou PNG transparent recommandé.",
                  },
                },
                {
                  name: "logoDark",
                  type: "upload",
                  relationTo: "media",
                  label: "Logo (mode sombre)",
                  admin: {
                    description:
                      "Optionnel. Si absent, le logo clair est utilisé partout.",
                  },
                },
              ],
            },
            {
              name: "logoText",
              type: "text",
              label: "Wordmark (texte)",
              admin: {
                description:
                  "Si pas de logo upload, ce texte est affiché. Par défaut : nom du site.",
              },
            },
          ],
        },

        // ── CSS personnalisé ────────────────────────────────────────────
        {
          label: "CSS personnalisé",
          description:
            "Pour aller plus loin que les options ci-dessus. Injecté en dernier dans <head>, donc prioritaire sur tout le reste. Tu peux référencer les variables CSS exposées (--background, --primary, etc.).",
          fields: [
            {
              name: "customCss",
              type: "code",
              label: "CSS global",
              admin: {
                language: "css",
                description:
                  "Ex: .prose h2 { color: var(--primary); }   |   .btn { font-weight: 600; }",
              },
            },
          ],
        },
      ],
    },
  ],
};
