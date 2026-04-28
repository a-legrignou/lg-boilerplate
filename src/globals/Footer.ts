import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../lib/revalidate";
import { isAdminOrEditor } from "../lib/access";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Pied de page",
  admin: {
    group: "Configuration",
    description:
      "Colonnes de liens, tagline et mention de copyright affichés en pied de toutes les pages.",
  },
  hooks: { afterChange: [revalidateGlobal] },
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    { name: "tagline", type: "textarea", localized: true, label: "Tagline" },
    {
      name: "columns",
      type: "array",
      localized: true,
      label: "Colonnes",
      labels: { singular: "Colonne", plural: "Colonnes" },
      fields: [
        { name: "heading", type: "text", required: true, label: "Titre" },
        {
          name: "links",
          type: "array",
          label: "Liens",
          labels: { singular: "Lien", plural: "Liens" },
          fields: [
            { name: "label", type: "text", required: true, label: "Libellé" },
            { name: "href", type: "text", required: true, label: "URL" },
          ],
        },
      ],
    },
    {
      name: "copyright",
      type: "text",
      localized: true,
      label: "Mention de copyright",
    },
  ],
};
