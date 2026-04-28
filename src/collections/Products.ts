import type { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from "../lib/access";
import {
  slugField,
  coverField,
  excerptField,
  seoOverrideFields,
} from "../lib/fields";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Offre", plural: "Offres" },
  admin: {
    group: "Contenu",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "category", "_status", "updatedAt"],
    description:
      "Offres / services / produits commercialisés. Chaque offre a sa page dédiée.",
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
    ...seoOverrideFields(),
    {
      type: "tabs",
      tabs: [
        {
          label: "Présentation",
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
                  "Présentation détaillée de l'offre. Affichée sur la page dédiée.",
              },
            },
          ],
        },
        {
          label: "Détails",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "category",
                  type: "select",
                  label: "Catégorie",
                  admin: {
                    description: "Sert à filtrer / regrouper sur le site.",
                  },
                  options: [
                    { label: "— Aucune", value: "none" },
                    { label: "Conseil", value: "consulting" },
                    { label: "Formation", value: "training" },
                    { label: "Audit", value: "audit" },
                    { label: "Implémentation", value: "implementation" },
                    { label: "Support", value: "support" },
                  ],
                },
                {
                  name: "duration",
                  type: "text",
                  localized: true,
                  label: "Durée",
                  admin: { description: "Ex: « 2-3 mois », « 1 jour »" },
                },
                {
                  name: "pricing",
                  type: "text",
                  localized: true,
                  label: "Tarif indicatif",
                  admin: {
                    description: "Ex: « À partir de 5 k€ », « Sur devis »",
                  },
                },
              ],
            },
            {
              name: "audience",
              type: "select",
              hasMany: true,
              label: "Cible",
              admin: {
                description: "Personae visés (peut en sélectionner plusieurs).",
              },
              options: [
                { label: "Dirigeants", value: "leaders" },
                { label: "Équipes tech", value: "tech" },
                { label: "Équipes produit", value: "product" },
                { label: "Équipes marketing", value: "marketing" },
                { label: "Investisseurs", value: "investors" },
              ],
            },
            {
              name: "benefits",
              type: "array",
              localized: true,
              label: "Bénéfices clés",
              labels: { singular: "Bénéfice", plural: "Bénéfices" },
              admin: { description: "3-5 puces qui résument la valeur." },
              fields: [{ name: "value", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Méthodologie",
          description: "Optionnel — explique pourquoi et comment.",
          fields: [
            {
              name: "why",
              type: "textarea",
              localized: true,
              label: "Pourquoi (le besoin client)",
            },
            {
              name: "how",
              type: "richText",
              localized: true,
              label: "Comment (notre approche)",
            },
          ],
        },
      ],
    },
  ],
};
