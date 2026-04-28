import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const Features: Block = {
  slug: "features",
  labels: {
    singular: "Liste de fonctionnalités",
    plural: "Listes de fonctionnalités",
  },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "grid",
      label: "Variante",
      options: [
        { label: "Grille (3 colonnes)", value: "grid" },
        { label: "Grille compacte (4 colonnes)", value: "grid-4" },
        { label: "Liste verticale avec icônes", value: "list" },
        { label: "Cartes en colonnes", value: "cards" },
      ],
    },
    { name: "heading", type: "text", localized: true, label: "Titre" },
    { name: "intro", type: "textarea", localized: true, label: "Introduction" },
    {
      name: "items",
      type: "array",
      minRows: 1,
      localized: true,
      label: "Items",
      labels: { singular: "Item", plural: "Items" },
      fields: [
        {
          name: "icon",
          type: "text",
          label: "Icône",
          admin: { description: 'Nom d\'icône lucide-react (ex: "Zap")' },
        },
        { name: "title", type: "text", required: true, label: "Titre" },
        { name: "description", type: "textarea", label: "Description" },
      ],
    },
    appearanceField,
    visibilityField,
  ],
};
