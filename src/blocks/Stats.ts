import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const Stats: Block = {
  slug: "stats",
  labels: { singular: "Chiffres clés", plural: "Chiffres clés" },
  fields: [
    { name: "heading", type: "text", localized: true },
    { name: "intro", type: "textarea", localized: true },
    {
      name: "items",
      type: "array",
      minRows: 1,
      maxRows: 6,
      localized: true,
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
          admin: { description: 'e.g. "12k+", "99.9%", "150"' },
        },
        { name: "label", type: "text", required: true },
        {
          name: "suffix",
          type: "text",
          admin: { description: "Optional unit displayed under value" },
        },
      ],
    },
    appearanceField,
    visibilityField,
  ],
};
