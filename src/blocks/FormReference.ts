import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const FormReference: Block = {
  slug: "form",
  labels: {
    singular: "Insertion formulaire",
    plural: "Insertions formulaires",
  },
  fields: [
    {
      name: "form",
      type: "relationship",
      relationTo: "forms",
      required: true,
      label: "Formulaire",
    },
    { name: "heading", type: "text", localized: true, label: "Titre" },
    {
      name: "description",
      type: "textarea",
      localized: true,
      label: "Description",
    },
    appearanceField,
    visibilityField,
  ],
};
