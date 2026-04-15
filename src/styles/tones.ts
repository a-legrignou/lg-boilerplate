export type Tone = "light" | "muted" | "dark" | "navy" | "sage" | "gold";
export type Align = "left" | "center";
export type BadgeColor = "navy" | "gold" | "sage";
export type BadgeBg = "light" | "muted" | "dark";

/** Couleur du titre (h2/h3) selon le fond */
export const TITLE_COLOR: Record<Tone, string> = {
  light: "text-t0",
  muted: "text-t0",
  dark:  "text-tw",
  navy:  "text-tw",
  sage:  "text-tw",
  gold:  "text-tw",
};

/** Couleur du corps de texte selon le fond */
export const BODY_COLOR: Record<Tone, string> = {
  light: "text-t1",
  muted: "text-t1",
  dark:  "text-tw2",
  navy:  "text-tw2",
  sage:  "text-tw2",
  gold:  "text-tw2",
};

/** Classe de fond de section selon le ton */
export const BG_CLASS: Record<Tone, string> = {
  light: "bg-cl",
  muted: "bg-cd",
  dark:  "bg-noir",
  navy:  "bg-navy",
  sage:  "bg-sage",
  gold:  "bg-gold",
};

/** Classe de bordure selon le ton */
export const BORDER_CLASS: Record<Tone, string> = {
  light: "border-border",
  muted: "border-border",
  dark:  "border-border-dk",
  navy:  "border-border-dk",
  sage:  "border-border-dk",
  gold:  "border-border-dk",
};

/** Classe de diviseur selon le ton */
export const DIVIDE_CLASS: Record<Tone, string> = {
  light: "divide-border",
  muted: "divide-border",
  dark:  "divide-border-dk",
  navy:  "divide-border-dk",
  sage:  "divide-border-dk",
  gold:  "divide-border-dk",
};
