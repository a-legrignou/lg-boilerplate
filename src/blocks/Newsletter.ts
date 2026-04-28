import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const Newsletter: Block = {
  slug: "newsletter",
  labels: {
    singular: "Inscription newsletter",
    plural: "Inscriptions newsletter",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      defaultValue: "Reste informé",
    },
    { name: "subtitle", type: "textarea", localized: true },
    {
      name: "placeholder",
      type: "text",
      localized: true,
      defaultValue: "ton@email.com",
    },
    {
      name: "submitLabel",
      type: "text",
      localized: true,
      defaultValue: "S'abonner",
    },
    {
      name: "successMessage",
      type: "text",
      localized: true,
      defaultValue: "Merci, à bientôt !",
    },
    appearanceField,
    visibilityField,
  ],
};
