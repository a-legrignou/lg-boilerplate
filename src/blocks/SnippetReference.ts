import type { Block } from "payload";
import { visibilityField } from "./visibility";

export const SnippetReference: Block = {
  slug: "snippet",
  labels: { singular: "Bloc réutilisable", plural: "Blocs réutilisables" },
  fields: [
    {
      name: "snippet",
      type: "relationship",
      relationTo: "snippets",
      required: true,
      label: "Bloc à insérer",
    },
    visibilityField,
  ],
};
