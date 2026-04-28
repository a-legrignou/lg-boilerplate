import type { CollectionConfig } from "payload";
import {
  Hero,
  Features,
  CTA,
  RichTextBlock,
  Group,
  LogoCloud,
  Pricing,
  Testimonials,
  FAQ,
  Stats,
  Newsletter,
} from "../blocks";
import { isAdmin, isAdminOrEditor } from "../lib/access";

export const Snippets: CollectionConfig = {
  slug: "snippets",
  labels: { singular: "Bloc réutilisable", plural: "Blocs réutilisables" },
  admin: {
    group: "Contenu",
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"],
    description:
      "Compositions de blocks réutilisables. Édite une fois, propage partout.",
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nom interne",
      admin: {
        description: 'Ex: "Pricing 3 paliers", "Bandeau footer"',
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Contenu",
          fields: [
            {
              name: "layout",
              type: "blocks",
              label: "Blocks",
              required: true,
              blocks: [
                Hero,
                Features,
                CTA,
                RichTextBlock,
                Group,
                LogoCloud,
                Pricing,
                Testimonials,
                FAQ,
                Stats,
                Newsletter,
              ],
              localized: true,
            },
          ],
        },
      ],
    },
  ],
};
