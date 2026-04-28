import type { Block } from "payload";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { CTA } from "./CTA";
import { RichTextBlock } from "./RichTextBlock";
import { LogoCloud } from "./LogoCloud";
import { Pricing } from "./Pricing";
import { Testimonials } from "./Testimonials";
import { FAQ } from "./FAQ";
import { Stats } from "./Stats";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const Group: Block = {
  slug: "group",
  labels: { singular: "Mise en colonnes", plural: "Mises en colonnes" },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "columns",
          type: "select",
          defaultValue: "2",
          label: "Colonnes",
          options: [
            { label: "1 (empilé)", value: "1" },
            { label: "2 colonnes", value: "2" },
            { label: "3 colonnes", value: "3" },
            { label: "4 colonnes", value: "4" },
          ],
        },
        {
          name: "gap",
          type: "select",
          defaultValue: "md",
          label: "Espacement",
          options: [
            { label: "Serré", value: "sm" },
            { label: "Normal", value: "md" },
            { label: "Aéré", value: "lg" },
          ],
        },
        {
          name: "align",
          type: "select",
          defaultValue: "stretch",
          label: "Alignement vertical",
          options: [
            { label: "Haut", value: "start" },
            { label: "Centre", value: "center" },
            { label: "Étirer", value: "stretch" },
          ],
        },
      ],
    },
    {
      name: "children",
      type: "blocks",
      label: "Blocks enfants",
      required: true,
      minRows: 1,
      blocks: [
        Hero,
        Features,
        CTA,
        RichTextBlock,
        LogoCloud,
        Pricing,
        Testimonials,
        FAQ,
        Stats,
      ],
      localized: true,
    },
    appearanceField,
    visibilityField,
  ],
};
