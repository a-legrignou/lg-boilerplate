import type { Field } from "payload";

export const APPEARANCE_DEFAULTS = {
  background: "default",
  padding: "md",
  paddingTop: null,
  paddingBottom: null,
  maxWidth: "normal",
  divider: "none",
} as const;

export type Appearance = {
  background?: "default" | "muted" | "inverted" | "branded" | null;
  padding?: "none" | "sm" | "md" | "lg" | null;
  paddingTop?: "none" | "sm" | "md" | "lg" | null;
  paddingBottom?: "none" | "sm" | "md" | "lg" | null;
  maxWidth?: "narrow" | "normal" | "wide" | "full" | null;
  divider?: "none" | "top" | "bottom" | "both" | null;
};

const PAD_OPTIONS = [
  { label: "Aucun", value: "none" },
  { label: "Petit", value: "sm" },
  { label: "Moyen", value: "md" },
  { label: "Grand", value: "lg" },
];

/**
 * Shared appearance field group for blocks.
 */
export const appearanceField: Field = {
  name: "appearance",
  type: "group",
  label: "Apparence",
  admin: { description: "Mise en forme — palette restreinte au brand." },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "background",
          type: "select",
          defaultValue: APPEARANCE_DEFAULTS.background,
          label: "Fond",
          options: [
            { label: "Standard", value: "default" },
            { label: "Atténué", value: "muted" },
            { label: "Inversé (sombre)", value: "inverted" },
            { label: "Couleur de marque", value: "branded" },
          ],
        },
        {
          name: "maxWidth",
          type: "select",
          defaultValue: APPEARANCE_DEFAULTS.maxWidth,
          label: "Largeur max",
          options: [
            { label: "Étroit (texte)", value: "narrow" },
            { label: "Normal", value: "normal" },
            { label: "Large", value: "wide" },
            { label: "Pleine largeur", value: "full" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "padding",
          type: "select",
          defaultValue: APPEARANCE_DEFAULTS.padding,
          label: "Espacement (vertical)",
          admin: {
            description: "Appliqué haut + bas sauf si surchargé ci-dessous.",
          },
          options: PAD_OPTIONS,
        },
        {
          name: "divider",
          type: "select",
          defaultValue: APPEARANCE_DEFAULTS.divider,
          label: "Séparateur",
          options: [
            { label: "Aucun", value: "none" },
            { label: "Haut", value: "top" },
            { label: "Bas", value: "bottom" },
            { label: "Les deux", value: "both" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "paddingTop",
          type: "select",
          label: "Espacement haut (override)",
          admin: { description: "Optionnel. Surcharge la valeur ci-dessus." },
          options: PAD_OPTIONS,
        },
        {
          name: "paddingBottom",
          type: "select",
          label: "Espacement bas (override)",
          admin: { description: "Optionnel. Surcharge la valeur ci-dessus." },
          options: PAD_OPTIONS,
        },
      ],
    },
  ],
};
