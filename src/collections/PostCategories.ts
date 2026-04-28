import type { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from "../lib/access";
import { slugField, coverField, seoOverrideFields } from "../lib/fields";

export const PostCategories: CollectionConfig = {
  slug: "post-categories",
  labels: { singular: "Catégorie", plural: "Catégories" },
  admin: {
    group: "Contenu",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description:
      "Taxonomie des articles de blog. Chaque article appartient à une catégorie.",
  },
  access: {
    read: readPublishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    slugField({ source: "title" }),
    coverField(),
    ...seoOverrideFields(),
    {
      type: "tabs",
      tabs: [
        {
          label: "Contenu",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
              label: "Titre",
            },
            {
              name: "description",
              type: "textarea",
              localized: true,
              label: "Description",
              admin: {
                description: "Affichée en haut de la page de la catégorie.",
              },
            },
          ],
        },
      ],
    },
  ],
};
