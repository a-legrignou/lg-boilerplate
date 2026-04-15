/**
 * styles.ts
 * =========
 * Tokens de design partagés entre tous les rapports PDF (@react-pdf/renderer).
 *
 * IMPORTANT — contraintes @react-pdf :
 *  - Pas de rgba() → hex opaques uniquement + opacity sur un View séparé
 *  - Polices supportées : Helvetica, Helvetica-Bold, Helvetica-Oblique,
 *    Helvetica-BoldOblique, Times-Roman, Times-Bold, Courier
 *  - Pas de Helvetica-Semibold ni Helvetica-Medium (crash)
 */

// ─── Palette ──────────────────────────────────────────────────────────────────

export const COLORS = {
  navy:    "#0B1D3A",  // Couleur sombre principale
  gold:    "#C8973E",  // Accentuation
  cream:   "#F7F6F4",  // Fond clair
  white:   "#FFFFFF",
  gray300: "#D1D5DB",
  gray500: "#6B7280",
  gray700: "#374151",
} as const;

// ─── Typographie ──────────────────────────────────────────────────────────────

export const FONTS = {
  regular:      "Helvetica",
  bold:         "Helvetica-Bold",
  italic:       "Helvetica-Oblique",
  boldItalic:   "Helvetica-BoldOblique",
  serifRegular: "Times-Roman",
  serifBold:    "Times-Bold",
  mono:         "Courier",
} as const;

export const FONT_SIZES = {
  xs:   7,
  sm:   8,
  base: 10,
  md:   11,
  lg:   13,
  xl:   16,
  h2:   18,
  h1:   24,
} as const;

// ─── Espacements ──────────────────────────────────────────────────────────────

export const SPACING = {
  page_h:      42,   // Padding horizontal de la page
  page_v:      40,   // Padding vertical du body
  banner_h:    200,  // Hauteur du bandeau hero
  section_gap: 20,   // Espace entre sections
  block_gap:   12,   // Espace entre blocs d'une section
  bullet_bar:  2,    // Épaisseur barre verticale bullet (pas de char unicode)
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Retourne les styles de base communs à toutes les pages PDF.
 * À utiliser comme point de départ dans les StyleSheet.create() des rapports.
 */
export function basePageStyle() {
  return {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray700,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.page_h,
    paddingVertical: SPACING.page_v,
  } as const;
}

/**
 * Style d'une barre verticale servant de bullet point.
 * @react-pdf ne rendu pas les caractères unicode de manière fiable.
 */
export function bulletBarStyle(color = COLORS.gold) {
  return {
    width: SPACING.bullet_bar,
    height: 11,
    backgroundColor: color,
    marginRight: 8,
    marginTop: 2,
    flexShrink: 0,
  } as const;
}
