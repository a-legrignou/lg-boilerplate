import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const Pricing: Block = {
  slug: "pricing",
  labels: { singular: "Grille tarifaire", plural: "Grilles tarifaires" },
  fields: [
    { name: "heading", type: "text", localized: true },
    { name: "intro", type: "textarea", localized: true },
    {
      name: "tiers",
      type: "array",
      minRows: 1,
      maxRows: 4,
      localized: true,
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "price",
          type: "text",
          required: true,
          admin: { description: 'Free-form (e.g. "9 €", "$29", "Sur devis")' },
        },
        {
          name: "period",
          type: "text",
          admin: { description: 'e.g. "/ mois", "/ an"' },
        },
        { name: "description", type: "textarea" },
        {
          name: "features",
          type: "array",
          fields: [{ name: "label", type: "text", required: true }],
        },
        {
          name: "cta",
          type: "group",
          fields: [
            { name: "label", type: "text" },
            { name: "href", type: "text" },
          ],
        },
        {
          name: "highlighted",
          type: "checkbox",
          label: "Mettre en avant (couleur brand)",
        },
      ],
    },
    appearanceField,
    visibilityField,
  ],
};
