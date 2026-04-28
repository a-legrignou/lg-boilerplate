import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const Hero: Block = {
  slug: "hero",
  labels: { singular: "Bannière (Hero)", plural: "Bannières" },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "variant",
          type: "select",
          defaultValue: "centered",
          label: "Variante",
          options: [
            { label: "Centré", value: "centered" },
            { label: "Split (texte + image)", value: "split" },
          ],
        },
        {
          name: "textAlign",
          type: "select",
          defaultValue: "auto",
          label: "Alignement texte",
          options: [
            { label: "Auto", value: "auto" },
            { label: "Gauche", value: "left" },
            { label: "Centre", value: "center" },
            { label: "Droite", value: "right" },
          ],
        },
      ],
    },
    { name: "eyebrow", type: "text", localized: true, label: "Surtitre" },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: "Titre",
    },
    {
      name: "subtitle",
      type: "textarea",
      localized: true,
      label: "Sous-titre",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Image",
      admin: {
        description: 'Requise pour la variante "Split".',
        condition: (_, siblingData) => siblingData?.variant !== undefined,
      },
    },
    {
      name: "cta",
      type: "group",
      label: "Bouton d'action",
      fields: [
        { name: "label", type: "text", localized: true, label: "Libellé" },
        { name: "href", type: "text", label: "Lien" },
      ],
    },
    appearanceField,
    visibilityField,
  ],
};
