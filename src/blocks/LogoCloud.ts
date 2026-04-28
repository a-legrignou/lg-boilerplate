import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const LogoCloud: Block = {
  slug: "logoCloud",
  labels: { singular: "Bandeau logos", plural: "Bandeaux logos" },
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      admin: { description: "Optional small heading above the logos" },
    },
    {
      name: "logos",
      type: "array",
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: "logo", type: "upload", relationTo: "media", required: true },
        {
          name: "name",
          type: "text",
          required: true,
          admin: { description: "Used as alt text + tooltip" },
        },
        {
          name: "href",
          type: "text",
          admin: { description: "Optional link URL" },
        },
      ],
    },
    appearanceField,
    visibilityField,
  ],
};
