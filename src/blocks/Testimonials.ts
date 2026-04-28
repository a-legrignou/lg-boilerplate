import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const Testimonials: Block = {
  slug: "testimonials",
  labels: { singular: "Témoignages", plural: "Témoignages" },
  fields: [
    { name: "heading", type: "text", localized: true },
    {
      name: "columns",
      type: "select",
      defaultValue: "3",
      options: [
        { label: "1 (full width)", value: "1" },
        { label: "2 columns", value: "2" },
        { label: "3 columns", value: "3" },
      ],
    },
    {
      name: "items",
      type: "array",
      minRows: 1,
      localized: true,
      fields: [
        { name: "quote", type: "textarea", required: true },
        { name: "authorName", type: "text", required: true },
        { name: "authorRole", type: "text" },
        { name: "avatar", type: "upload", relationTo: "media" },
      ],
    },
    appearanceField,
    visibilityField,
  ],
};
