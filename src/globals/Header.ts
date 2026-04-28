import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../lib/revalidate";
import { isAdminOrEditor } from "../lib/access";

export const Header: GlobalConfig = {
  slug: "header",
  label: "En-tête",
  admin: {
    group: "Configuration",
    description:
      "Liens du menu principal et bouton d'action (CTA) affichés en haut de toutes les pages.",
  },
  hooks: { afterChange: [revalidateGlobal] },
  access: { read: () => true, update: isAdminOrEditor },
  fields: [
    {
      name: "nav",
      type: "array",
      localized: true,
      label: "Navigation",
      labels: { singular: "Lien", plural: "Liens" },
      fields: [
        { name: "label", type: "text", required: true, label: "Libellé" },
        { name: "href", type: "text", required: true, label: "URL" },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "Bouton d'action",
      fields: [
        { name: "label", type: "text", localized: true, label: "Libellé" },
        { name: "href", type: "text", label: "URL" },
      ],
    },
  ],
};
