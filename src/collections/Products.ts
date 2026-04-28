import type { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from "../lib/access";
import {
  slugField,
  coverField,
  excerptField,
  tagsField,
  seoOverrideFields,
} from "../lib/fields";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Produit", plural: "Produits" },
  admin: {
    group: "Contenu",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    description:
      "Produits / offres / services commercialisés. Une page par produit. Métadonnées légères, contenu libre dans la description.",
  },
  access: {
    read: readPublishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: { drafts: { autosave: { interval: 2500 } } },
  fields: [
    slugField({ source: "title" }),
    coverField(),
    {
      name: "pricing",
      type: "text",
      localized: true,
      label: "Tarif indicatif",
      admin: {
        position: "sidebar",
        description: "Ex: « À partir de 5 k€ », « Sur devis »",
      },
    },
    {
      name: "duration",
      type: "text",
      localized: true,
      label: "Durée",
      admin: {
        position: "sidebar",
        description: "Ex: « 2-3 mois », « 1 jour »",
      },
    },
    tagsField({
      sidebar: true,
      description:
        "Sert de catégorie (« audit », « formation », « dirigeants »…). Filtrage et regroupement sur le site.",
    }),
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
            excerptField(),
            {
              name: "description",
              type: "richText",
              localized: true,
              label: "Description",
              admin: {
                description:
                  "Contenu libre. Structure-le comme tu veux : « Pour qui », « Pourquoi », « Comment », bénéfices, FAQ, etc.",
              },
            },
          ],
        },
      ],
    },
  ],
};
