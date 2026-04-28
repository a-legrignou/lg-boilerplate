import type { Field } from "payload";
import type { Locale } from "../lib/i18n";

export type Visibility = {
  mobileHidden?: boolean | null;
  showIfLocale?: ("any" | Locale) | null;
  showFrom?: string | null;
  showUntil?: string | null;
};

export const visibilityField: Field = {
  name: "visibility",
  type: "group",
  label: "Visibilité",
  admin: {
    description: "Conditions d'affichage. Vide = visible partout.",
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "mobileHidden", type: "checkbox", label: "Cacher sur mobile" },
        {
          name: "showIfLocale",
          type: "select",
          defaultValue: "any",
          label: "Langue",
          options: [
            { label: "Toutes", value: "any" },
            { label: "FR uniquement", value: "fr" },
            { label: "EN uniquement", value: "en" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "showFrom", type: "date", label: "Visible à partir de" },
        { name: "showUntil", type: "date", label: "Visible jusqu'au" },
      ],
    },
  ],
};

export function isVisible(
  visibility: Visibility | null | undefined,
  locale: Locale,
  now: Date = new Date(),
): boolean {
  if (!visibility) return true;
  if (
    visibility.showIfLocale &&
    visibility.showIfLocale !== "any" &&
    visibility.showIfLocale !== locale
  )
    return false;
  if (visibility.showFrom && new Date(visibility.showFrom) > now) return false;
  if (visibility.showUntil && new Date(visibility.showUntil) < now)
    return false;
  return true;
}
