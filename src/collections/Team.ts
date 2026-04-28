import type { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from "../lib/access";
import { slugField, coverField, seoOverrideFields } from "../lib/fields";

export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Membre", plural: "Équipe" },
  admin: {
    group: "Contenu",
    useAsTitle: "name",
    defaultColumns: ["name", "role", "memberType", "_status", "updatedAt"],
    description:
      "Membres publics de l'équipe — affichés sur la page « Équipe » du site.",
  },
  access: {
    read: readPublishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: { drafts: { autosave: { interval: 2500 } } },
  fields: [
    slugField({ source: "name" }),
    coverField({ name: "avatar", label: "Photo" }),
    ...seoOverrideFields(),
    {
      type: "tabs",
      tabs: [
        {
          label: "Identité",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              label: "Nom complet",
              admin: { description: "Ex: « Alice Dupont »" },
            },
            {
              name: "role",
              type: "text",
              localized: true,
              label: "Rôle",
              admin: { description: "Ex: « CTO », « Senior consultant »" },
            },
            {
              name: "memberType",
              type: "select",
              defaultValue: "employee",
              label: "Type",
              options: [
                { label: "Associé", value: "associate" },
                { label: "Collaborateur", value: "employee" },
                { label: "Advisor", value: "advisor" },
                { label: "Expert externe", value: "expert" },
              ],
            },
          ],
        },
        {
          label: "Bio",
          fields: [
            {
              name: "shortBio",
              type: "textarea",
              localized: true,
              label: "Bio courte",
              admin: {
                description:
                  "Phrase d'accroche pour la card équipe (max ~150 chars).",
              },
            },
            {
              name: "bio",
              type: "richText",
              localized: true,
              label: "Bio longue",
              admin: {
                description: "Affichée sur la page personnelle du membre.",
              },
            },
          ],
        },
        {
          label: "Contact (public)",
          fields: [
            { name: "email", type: "email", label: "Email public" },
            {
              name: "socials",
              type: "group",
              label: "Réseaux sociaux",
              fields: [
                {
                  name: "linkedin",
                  type: "text",
                  label: "LinkedIn (handle ou URL)",
                },
                {
                  name: "twitter",
                  type: "text",
                  label: "Twitter / X (handle)",
                },
                { name: "github", type: "text", label: "GitHub (handle)" },
                { name: "website", type: "text", label: "Site personnel" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
