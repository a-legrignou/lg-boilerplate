import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const RichTextBlock: Block = {
  slug: "richText",
  labels: { singular: "Texte mis en forme", plural: "Textes mis en forme" },
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
      label: "Contenu",
    },
    appearanceField,
    visibilityField,
  ],
};
