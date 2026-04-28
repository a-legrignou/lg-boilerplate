import type { Block } from "payload";
import { appearanceField } from "./appearance";
import { visibilityField } from "./visibility";

export const CTA: Block = {
  slug: "cta",
  labels: { singular: "Bouton d'action", plural: "Boutons d'action" },
  fields: [
    {
      name: "variant",
      type: "select",
      defaultValue: "centered",
      label: "Variante",
      options: [
        { label: "Centré (texte + bouton centrés)", value: "centered" },
        { label: "Bandeau (titre à gauche, bouton à droite)", value: "banner" },
        { label: "Carte mise en avant (background coloré)", value: "card" },
      ],
    },
    {
      name: "textAlign",
      type: "select",
      defaultValue: "center",
      label: "Alignement (mode centré)",
      options: [
        { label: "Gauche", value: "left" },
        { label: "Centre", value: "center" },
        { label: "Droite", value: "right" },
      ],
    },
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
    },
    {
      name: "buttons",
      type: "array",
      maxRows: 2,
      localized: true,
      label: "Boutons",
      labels: { singular: "Bouton", plural: "Boutons" },
      fields: [
        { name: "label", type: "text", required: true, label: "Libellé" },
        { name: "href", type: "text", required: true, label: "Lien" },
        {
          name: "variant",
          type: "select",
          defaultValue: "default",
          label: "Style",
          options: [
            { label: "Primaire", value: "default" },
            { label: "Secondaire", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
      ],
    },
    appearanceField,
    visibilityField,
  ],
};
