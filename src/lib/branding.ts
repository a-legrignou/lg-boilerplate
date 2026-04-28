import "server-only";
import type { Brand } from "@/payload-types";
import { getGlobal } from "./payload";

const SYSTEM_SANS =
  'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const SYSTEM_MONO =
  'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace';

const RADIUS_VALUES: Record<string, string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "14px",
  xl: "20px",
  full: "9999px",
};

const SHADOW_VALUES: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
};

const SERIF_FONTS = new Set([
  "Lora",
  "Playfair Display",
  "Merriweather",
  "Cormorant Garamond",
  "Source Serif Pro",
]);
const MONO_FONTS = new Set([
  "JetBrains Mono",
  "Geist Mono",
  "IBM Plex Mono",
  "Fira Code",
]);

const fontStack = (font: string | null | undefined): string => {
  if (!font || font === "system") return SYSTEM_SANS;
  if (MONO_FONTS.has(font)) return `"${font}", ${SYSTEM_MONO}`;
  if (SERIF_FONTS.has(font))
    return `"${font}", Georgia, "Times New Roman", serif`;
  return `"${font}", ${SYSTEM_SANS}`;
};

export async function getBrand(): Promise<Brand> {
  return getGlobal("brand");
}

export function brandFontImports(brand: Brand): string[] {
  const families = new Set<string>();
  for (const f of [brand.fontHeading, brand.fontBody, brand.fontMono]) {
    if (!f || f === "system") continue;
    families.add(f);
  }
  return Array.from(families).map(
    (f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`,
  );
}

export function brandFontImportUrl(brand: Brand): string | null {
  const params = brandFontImports(brand);
  if (params.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`;
}

const fb = (v: string | null | undefined, def: string) => v || def;

type ThemeColors = {
  background?: string | null;
  foreground?: string | null;
  card?: string | null;
  cardForeground?: string | null;
  muted?: string | null;
  mutedForeground?: string | null;
  primary?: string | null;
  primaryForeground?: string | null;
  accent?: string | null;
  accentForeground?: string | null;
  secondary?: string | null;
  border?: string | null;
  input?: string | null;
  ring?: string | null;
  success?: string | null;
  warning?: string | null;
  destructive?: string | null;
};

const themeBlock = (
  c: ThemeColors,
  defaults: Required<{ [K in keyof ThemeColors]: string }>,
): string =>
  [
    `--background: ${fb(c.background, defaults.background)};`,
    `--foreground: ${fb(c.foreground, defaults.foreground)};`,
    `--card: ${fb(c.card, defaults.card)};`,
    `--card-foreground: ${fb(c.cardForeground, defaults.cardForeground)};`,
    `--popover: ${fb(c.card, defaults.card)};`,
    `--popover-foreground: ${fb(c.cardForeground, defaults.cardForeground)};`,
    `--muted: ${fb(c.muted, defaults.muted)};`,
    `--muted-foreground: ${fb(c.mutedForeground, defaults.mutedForeground)};`,
    `--primary: ${fb(c.primary, defaults.primary)};`,
    `--primary-foreground: ${fb(c.primaryForeground, defaults.primaryForeground)};`,
    `--accent: ${fb(c.accent, defaults.accent)};`,
    `--accent-foreground: ${fb(c.accentForeground, defaults.accentForeground)};`,
    `--secondary: ${fb(c.secondary, defaults.secondary)};`,
    `--secondary-foreground: ${fb(c.foreground, defaults.foreground)};`,
    `--border: ${fb(c.border, defaults.border)};`,
    `--input: ${fb(c.input, defaults.input)};`,
    `--ring: ${fb(c.ring, defaults.ring)};`,
    `--success: ${fb(c.success, defaults.success)};`,
    `--warning: ${fb(c.warning, defaults.warning)};`,
    `--destructive: ${fb(c.destructive, defaults.destructive)};`,
    `--destructive-foreground: ${fb(c.foreground, defaults.foreground)};`,
  ].join("\n  ");

const LIGHT_DEFAULTS = {
  background: "#ffffff",
  foreground: "#0a0a0a",
  card: "#ffffff",
  cardForeground: "#0a0a0a",
  muted: "#f5f5f5",
  mutedForeground: "#737373",
  primary: "#6366f1",
  primaryForeground: "#ffffff",
  accent: "#22d3ee",
  accentForeground: "#0a0a0a",
  secondary: "#a855f7",
  border: "#e5e5e5",
  input: "#e5e5e5",
  ring: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  destructive: "#ef4444",
};

const DARK_DEFAULTS = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  card: "#0f0f0f",
  cardForeground: "#fafafa",
  muted: "#1a1a1a",
  mutedForeground: "#a3a3a3",
  primary: "#818cf8",
  primaryForeground: "#0a0a0a",
  accent: "#67e8f9",
  accentForeground: "#0a0a0a",
  secondary: "#c084fc",
  border: "#262626",
  input: "#262626",
  ring: "#818cf8",
  success: "#34d399",
  warning: "#fbbf24",
  destructive: "#f87171",
};

export function brandToCss(brand: Brand): string {
  const radius = RADIUS_VALUES[brand.radius || "md"] ?? RADIUS_VALUES.md;
  const shadow = SHADOW_VALUES[brand.shadow || "sm"] ?? SHADOW_VALUES.sm;
  const fontHeading = fontStack(brand.fontHeading);
  const fontBody = fontStack(brand.fontBody);
  const fontMono = fontStack(brand.fontMono);
  const buttonStyle = brand.buttonStyle || "fill";

  const lightVars = themeBlock(brand as unknown as ThemeColors, LIGHT_DEFAULTS);
  const darkVars = themeBlock((brand.dark ?? {}) as ThemeColors, DARK_DEFAULTS);

  const tokens = `
:root {
  ${lightVars}
  --radius: ${radius};
  --shadow-card: ${shadow};
  --font-heading: ${fontHeading};
  --font-body: ${fontBody};
  --font-mono: ${fontMono};
  --brand-button-style: ${buttonStyle};
  /* Aliases legacy (compatibilité ancien code Folio) */
  --brand-primary: var(--primary);
  --brand-accent: var(--accent);
  --brand-secondary: var(--secondary);
  --brand-background: var(--background);
  --brand-foreground: var(--foreground);
  --brand-success: var(--success);
  --brand-warning: var(--warning);
  --brand-danger: var(--destructive);
  --brand-font: var(--font-body);
  --brand-font-heading: var(--font-heading);
  --brand-font-mono: var(--font-mono);
  --brand-radius: var(--radius);
}
.dark, [data-theme="dark"] {
  ${darkVars}
}
`.trim();

  const custom = brand.customCss?.trim();
  return custom ? `${tokens}\n${custom}` : tokens;
}
