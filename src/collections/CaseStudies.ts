import type { CollectionConfig, Field } from "payload";
import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from "../lib/access";
import {
  slugField,
  coverField,
  excerptField,
  publishedAtField,
  seoOverrideFields,
} from "../lib/fields";

/**
 * Bloc "section narrative" réutilisé 4 fois (contexte / challenge / approche / résultats).
 * Chaque section : un sous-titre court + un paragraphe + des puces clés.
 * Garde la structure forte d'une étude de cas (storytelling), sans surcharger l'admin.
 */
const sectionFields = (key: string, defaultHeading: string): Field => ({
  name: key,
  type: "group",
  label: defaultHeading,
  fields: [
    {
      name: "heading",
      type: "text",
      localized: true,
      label: "Sous-titre",
      admin: { description: `Optionnel — par défaut : « ${defaultHeading} »` },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      label: "Paragraphe",
    },
    {
      name: "takeaways",
      type: "array",
      localized: true,
      label: "Puces clés",
      labels: { singular: "Point", plural: "Points" },
      admin: { description: "3-5 puces synthétiques." },
      fields: [{ name: "value", type: "text", required: true }],
    },
  ],
});

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Étude de cas", plural: "Études de cas" },
  admin: {
    group: "Contenu",
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "slug",
      "clientSector",
      "clientSize",
      "_status",
      "updatedAt",
    ],
    description:
      "Histoire d'un projet client : contexte → challenge → approche → résultats. Format imposé pour la cohérence éditoriale.",
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
    publishedAtField(),
    coverField(),
    ...seoOverrideFields(),
    {
      type: "tabs",
      tabs: [
        {
          label: "Identité",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
              label: "Titre",
            },
            {
              name: "subtitle",
              type: "text",
              localized: true,
              label: "Sous-titre",
            },
            excerptField(),
            {
              type: "row",
              fields: [
                {
                  name: "clientSize",
                  type: "select",
                  label: "Taille du client",
                  options: [
                    { label: "TPE / Startup", value: "startup" },
                    { label: "PME / PMI", value: "sme" },
                    { label: "ETI", value: "eti" },
                    { label: "Grand groupe", value: "enterprise" },
                    { label: "Secteur public", value: "public" },
                  ],
                },
                {
                  name: "clientSector",
                  type: "select",
                  label: "Secteur",
                  options: [
                    { label: "Industrie", value: "industry" },
                    { label: "Services", value: "services" },
                    { label: "Tech / SaaS", value: "tech" },
                    { label: "Finance", value: "finance" },
                    { label: "Santé", value: "health" },
                    { label: "Public", value: "public" },
                    { label: "Défense / Sécurité", value: "defense" },
                    { label: "Autre", value: "other" },
                  ],
                },
              ],
            },
            {
              name: "kpis",
              type: "array",
              localized: true,
              label: "KPIs (chiffres clés)",
              labels: { singular: "KPI", plural: "KPIs" },
              admin: {
                description:
                  'Affichés en haut de la page sous forme de "stats" — ex : 3 lignes "x2", "30 j", "+45%".',
              },
              maxRows: 6,
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "value",
                      type: "text",
                      required: true,
                      label: "Valeur",
                      admin: { description: "Ex: « +45 % », « 30 j »" },
                    },
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      label: "Libellé",
                      admin: {
                        description:
                          "Ex: « de conversion », « time-to-market »",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Cas",
          description:
            "4 sections imposées. Chacune : sous-titre (optionnel) + paragraphe + 3-5 puces clés.",
          fields: [
            sectionFields("context", "Contexte"),
            sectionFields("challenge", "Challenge"),
            sectionFields("approach", "Approche"),
            sectionFields("results", "Résultats"),
            {
              name: "conclusion",
              type: "textarea",
              localized: true,
              label: "Conclusion",
            },
          ],
        },
      ],
    },
  ],
};
