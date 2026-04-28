import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const FAQ: Block = {
  slug: "faq",
  labels: { singular: "FAQ", plural: "FAQ" },
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      defaultValue: "Questions fréquentes",
    },
    {
      name: "items",
      type: "array",
      minRows: 1,
      localized: true,
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
    appearanceField,
    visibilityField,
  ],
};
