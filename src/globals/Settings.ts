import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../lib/revalidate";
import { isAdminOrEditor } from "../lib/access";

export const Settings: GlobalConfig = {
  slug: "settings",
  label: "Paramètres",
  admin: {
    group: "Configuration",
    description:
      "Informations générales du site (nom, description courte, contact, mentions légales).",
  },
  hooks: { afterChange: [revalidateGlobal] },
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Site",
          fields: [
            {
              name: "siteName",
              type: "text",
              required: true,
              localized: true,
              label: "Nom du site",
            },
            {
              name: "siteDescription",
              type: "textarea",
              localized: true,
              label: "Description courte",
              admin: {
                description:
                  "Phrase d'accroche utilisée comme description par défaut (SEO + RSS).",
              },
            },
            {
              name: "siteTagline",
              type: "text",
              localized: true,
              label: "Tagline",
              admin: {
                description:
                  "Optionnel — slogan court affichable dans le header.",
              },
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            {
              name: "contact",
              type: "group",
              label: "Coordonnées",
              fields: [
                { name: "email", type: "email", label: "Email" },
                { name: "phone", type: "text", label: "Téléphone" },
                {
                  name: "address",
                  type: "textarea",
                  label: "Adresse postale",
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: "Légal",
          fields: [
            {
              name: "legal",
              type: "group",
              label: "Mentions légales",
              fields: [
                { name: "entityName", type: "text", label: "Raison sociale" },
                {
                  name: "registrationNumber",
                  type: "text",
                  label: "SIRET / RCS",
                },
                {
                  name: "vatNumber",
                  type: "text",
                  label: "TVA intracommunautaire",
                },
                { name: "capital", type: "text", label: "Capital social" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
