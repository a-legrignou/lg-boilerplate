/**
 * ExpertiseDocument.tsx
 * =====================
 * @react-pdf/renderer — Fiche offre A4 (2 pages)
 *
 * Palette : Deep Navy (#0B1D3A) + Gold (#C8973E) + Sage (#7a8f85)
 *
 * Constraints (CLAUDE.md):
 * - NO rgba() — only hex + opacity on separate View
 * - Fonts: Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique only
 * - Bullets: View bars, NOT unicode characters
 * - Images: base64 data URI via imageUri prop
 */

import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, Svg, Path } from "@react-pdf/renderer";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ExpertiseData {
  slug: string;
  title: string;
  description?: string | null;
  why?: string | null;
  how?: string | null;
  benefits?: string[] | null;
  budget?: string | null;
  axe?: string | null;
  persona?: string[] | string | null;
  image?: { id: string } | string | null;
}

export interface ExpertiseDocumentProps {
  data: ExpertiseData;
  imageUri?: string | null;
  brandName?: string;
  brandUrl?: string;
}

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const ACCENT = "#C8973E"; // Gold
const DARK = "#0B1D3A"; // Navy
const SAGE = "#7a8f85";
const GRAY_100 = "#F7F6F4";
const GRAY_500 = "#6B7280";
const GRAY_700 = "#374151";
const WHITE = "#FFFFFF";

// Slightly lighter navy for badge outline bg
const DARK_LIGHT = "#1E2D4A";

const PAGE_H_PAD = 42;
const PAGE_V_PAD = 36;
const BANNER_HEIGHT = 190;

/* ------------------------------------------------------------------ */
/*  Lookup tables                                                      */
/* ------------------------------------------------------------------ */

const AXE_LABEL: Record<string, string> = {
  growth: "Développement",
  resilience: "Sécurité économique",
};

const PERSONA_LABEL: Record<string, string> = {
  dirigeants: "Dirigeants",
  leaders: "Dirigeants",
  investisseurs: "Investisseurs",
  investors: "Investisseurs",
};

/* ------------------------------------------------------------------ */
/*  SVG icons                                                          */
/* ------------------------------------------------------------------ */

function IconTrending({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={11} height={11}>
      <Path
        d="M22 7l-8.5 8.5-5-5L2 17"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M16 7h6v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function IconShield({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={11} height={11}>
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function IconUser({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={11} height={11}>
      <Path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M12 11a4 4 0 100-8 4 4 0 000 8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** CheckCircle-style SVG — outer circle + check path */
function IconCheckCircle({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={12} height={12}>
      <Path
        d="M22 11.08V12a10 10 0 11-5.93-9.14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M22 4L12 14.01l-3-3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function IconMail({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={10} height={10}>
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  /* ---- Pages ---- */
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: GRAY_700,
    paddingBottom: 50,
    position: "relative",
  },
  page1Body: { paddingHorizontal: PAGE_H_PAD, paddingTop: PAGE_V_PAD },
  page2: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: GRAY_700,
    paddingHorizontal: PAGE_H_PAD,
    paddingTop: 0,
    paddingBottom: 50,
    position: "relative",
  },

  /* ---- Banner ---- */
  bannerContainer: { position: "relative", width: "100%", height: BANNER_HEIGHT },
  bannerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: BANNER_HEIGHT,
    objectFit: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: BANNER_HEIGHT,
    opacity: 0.8,
  },
  bannerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: PAGE_H_PAD,
    paddingBottom: 20,
    paddingTop: 20,
  },
  bannerSolid: {
    width: "100%",
    height: BANNER_HEIGHT,
    justifyContent: "flex-end",
    paddingHorizontal: PAGE_H_PAD,
    paddingBottom: 20,
  },

  /* ---- Badges ---- */
  badgeRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  /* ---- Banner text ---- */
  bannerTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    lineHeight: 1.2,
    color: WHITE,
    marginBottom: 5,
  },
  bannerSubtitle: { fontFamily: "Helvetica-Oblique", fontSize: 11 },

  /* ---- Body - description ---- */
  description: {
    fontSize: 9.5,
    lineHeight: 1.6,
    marginBottom: 22,
    borderLeftWidth: 3,
    borderLeftColor: DARK,
    paddingLeft: 12,
    color: GRAY_700,
  },

  /* ---- 2-column layout ---- */
  twoCol: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },

  /* ---- Section header ---- */
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    lineHeight: 1.3,
    marginBottom: 8,
    color: GRAY_700,
  },
  sectionBody: { fontSize: 9, lineHeight: 1.65 },

  /* ---- Column left border accent ---- */
  colAccentLeft: {
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    paddingLeft: 10,
  },
  colAccentDark: {
    borderLeftWidth: 3,
    borderLeftColor: DARK,
    paddingLeft: 10,
  },

  /* ---- Divider ---- */
  divider: { height: 1, backgroundColor: "#E2CFA0", marginVertical: 18 },

  /* ---- Benefits checklist ---- */
  benefitRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 7 },
  benefitText: { fontSize: 8.5, lineHeight: 1.55, flex: 1, color: GRAY_700 },

  /* ---- Personas card ---- */
  personaCard: {
    backgroundColor: GRAY_100,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    padding: 14,
    borderRadius: 3,
    marginBottom: 14,
  },
  personaTagRow: { flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" },
  personaTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    backgroundColor: DARK_LIGHT,
    borderWidth: 1,
    borderColor: ACCENT,
  },
  personaTagText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: ACCENT,
  },

  /* ---- Budget box ---- */
  budgetBox: {
    backgroundColor: GRAY_100,
    padding: 14,
    borderRadius: 3,
    marginBottom: 16,
  },
  budgetLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.3,
    textTransform: "uppercase",
    color: GRAY_500,
    marginBottom: 5,
  },
  budgetText: { fontSize: 9, lineHeight: 1.55, color: GRAY_700 },

  /* ---- CTA block (dark) ---- */
  ctaBox: {
    backgroundColor: DARK,
    padding: 20,
    borderRadius: 3,
    marginBottom: 14,
  },
  ctaHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: WHITE,
    marginBottom: 6,
  },
  ctaSubtext: {
    fontSize: 8.5,
    lineHeight: 1.6,
    color: WHITE,
    marginBottom: 14,
    fontFamily: "Helvetica-Oblique",
  },
  ctaAccentBar: {
    height: 2,
    backgroundColor: ACCENT,
    width: 40,
    marginBottom: 12,
  },
  ctaContactRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 },
  ctaContactText: { fontSize: 8.5, color: WHITE },
  ctaContactBold: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: ACCENT },

  /* ---- Page 2 header ---- */
  headerBar: { height: 5, backgroundColor: DARK, marginBottom: 28 },
  accentStripe: { position: "absolute", top: 0, right: 0, width: 120, height: 5 },

  /* ---- Footer ---- */
  footer: {
    position: "absolute",
    bottom: 20,
    left: PAGE_H_PAD,
    right: PAGE_H_PAD,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 7, color: GRAY_500 },
  footerRight: { flexDirection: "row", gap: 12, alignItems: "center" },
  footerPage: { fontSize: 7, fontFamily: "Helvetica-Bold", color: GRAY_500 },
  footerConfidentiel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: GRAY_500 },
});

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FooterBar({
  pageNum,
  totalPages,
  brandName,
  brandUrl,
  confidentiel = true,
}: {
  pageNum: number;
  totalPages: number;
  brandName: string;
  brandUrl?: string;
  confidentiel?: boolean;
}) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        {brandName}
        {brandUrl ? ` — ${brandUrl}` : ""}
      </Text>
      <View style={s.footerRight}>
        {confidentiel && <Text style={s.footerConfidentiel}>Confidentiel</Text>}
        <Text style={s.footerPage}>
          {pageNum}/{totalPages}
        </Text>
      </View>
    </View>
  );
}

function HeroBanner({
  imageUri,
  title,
  axeLabel,
  axeColor,
  AxeIcon,
  personas,
}: {
  imageUri?: string | null;
  title: string;
  axeLabel: string | null;
  axeColor: string;
  AxeIcon: (props: { color: string }) => React.JSX.Element;
  personas: string[];
}) {
  const badges = (
    <View style={s.badgeRow}>
      {axeLabel && (
        <View style={[s.badge, { backgroundColor: axeColor }]}>
          <AxeIcon color={WHITE} />
          <Text style={[s.badgeText, { color: WHITE }]}>{axeLabel}</Text>
        </View>
      )}
      {personas.map((p, i) => (
        <View key={i} style={[s.badge, { backgroundColor: DARK_LIGHT, borderWidth: 1, borderColor: ACCENT }]}>
          <IconUser color={ACCENT} />
          <Text style={[s.badgeText, { color: ACCENT }]}>{PERSONA_LABEL[p] ?? p}</Text>
        </View>
      ))}
    </View>
  );

  if (imageUri) {
    return (
      <View style={s.bannerContainer}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image src={imageUri} style={s.bannerImage} />
        <View style={[s.bannerOverlay, { backgroundColor: DARK }]} />
        <View style={s.bannerContent}>
          {badges}
          <Text style={s.bannerTitle}>{title}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.bannerSolid, { backgroundColor: DARK }]}>
      {badges}
      <Text style={s.bannerTitle}>{title}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Document                                                      */
/* ------------------------------------------------------------------ */

export function ExpertiseDocument({
  data,
  imageUri,
  brandName = "",
  brandUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") ?? "",
}: ExpertiseDocumentProps) {
  const axeLabel = data.axe ? (AXE_LABEL[data.axe] ?? data.axe) : null;
  const axeColor = data.axe === "resilience" ? ACCENT : SAGE;
  const AxeIcon = data.axe === "resilience" ? IconShield : IconTrending;

  const personaRaw = Array.isArray(data.persona)
    ? data.persona
    : ((data.persona as string | null)?.split(",") ?? []);
  const personas = personaRaw.map((p: string) => p.trim()).filter(Boolean);

  const benefits = Array.isArray(data.benefits) ? data.benefits.filter(Boolean) : [];

  return (
    <Document title={data.title} author={brandName} subject={`Fiche offre — ${brandName}`}>

      {/* ========================================================== */}
      {/*  PAGE 1 — Banner + Description + 2-col Why/How             */}
      {/* ========================================================== */}
      <Page size="A4" style={s.page}>

        {/* ─── Banner ─── */}
        <HeroBanner
          imageUri={imageUri}
          title={data.title}
          axeLabel={axeLabel}
          axeColor={axeColor}
          AxeIcon={AxeIcon}
          personas={personas}
        />

        {/* ─── Body ─── */}
        <View style={s.page1Body}>

          {/* Description with left border */}
          {data.description && (
            <Text style={s.description}>{data.description}</Text>
          )}

          {/* 2-column: Le défi (gold) + Notre approche (navy) */}
          {(data.why || data.how) && (
            <View style={s.twoCol}>
              {data.why && (
                <View style={[s.col, s.colAccentLeft]}>
                  <Text style={[s.sectionLabel, { color: ACCENT }]}>Contexte</Text>
                  <Text style={s.sectionHeading}>Le défi</Text>
                  <Text style={s.sectionBody}>{data.why}</Text>
                </View>
              )}
              {data.how && (
                <View style={[s.col, s.colAccentDark]}>
                  <Text style={[s.sectionLabel, { color: DARK }]}>Méthodologie</Text>
                  <Text style={s.sectionHeading}>Notre approche</Text>
                  <Text style={s.sectionBody}>{data.how}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* ─── Footer P1 ─── */}
        <FooterBar pageNum={1} totalPages={2} brandName={brandName} brandUrl={brandUrl} />
      </Page>

      {/* ========================================================== */}
      {/*  PAGE 2 — Benefits, Personas, Budget, CTA                  */}
      {/* ========================================================== */}
      <Page size="A4" style={s.page2}>

        {/* ─── Page 2 header bar (navy + gold accent stripe) ─── */}
        <View style={[s.headerBar, { backgroundColor: DARK }]} />
        <View style={[s.accentStripe, { backgroundColor: ACCENT }]} />

        {/* ─── Benefits checklist ─── */}
        {benefits.length > 0 && (
          <>
            <Text style={[s.sectionLabel, { color: SAGE, marginBottom: 5 }]}>Bénéfices</Text>
            <Text style={[s.sectionHeading, { marginBottom: 14 }]}>Ce que vous en retirez</Text>
            {benefits.map((b: string, i: number) => (
              <View key={i} style={s.benefitRow}>
                {/* CheckCircle SVG icon (sage) */}
                <IconCheckCircle color={SAGE} />
                {/* Bullet bar (View) as visual separator */}
                <View
                  style={{
                    width: 2,
                    height: 11,
                    backgroundColor: SAGE,
                    marginTop: 0.5,
                    opacity: 0.35,
                  }}
                />
                <Text style={s.benefitText}>{b}</Text>
              </View>
            ))}
            <View style={s.divider} />
          </>
        )}

        {/* ─── Personas block (styled card, gold left border) ─── */}
        {personas.length > 0 && (
          <View style={s.personaCard}>
            <Text style={[s.sectionLabel, { color: ACCENT, marginBottom: 2 }]}>Cible</Text>
            <Text style={[s.sectionHeading, { marginBottom: 2 }]}>{"À qui s'adresse cette offre ?"}</Text>
            <View style={s.personaTagRow}>
              {personas.map((p: string, i: number) => (
                <View key={i} style={s.personaTag}>
                  <IconUser color={ACCENT} />
                  <Text style={s.personaTagText}>{PERSONA_LABEL[p] ?? p}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ─── Budget box ─── */}
        <View style={s.budgetBox}>
          <Text style={s.budgetLabel}>Budget</Text>
          <Text style={s.budgetText}>
            {data.budget ??
              "Accompagnement sur mesure — nous contacter pour un devis adapté à votre situation."}
          </Text>
        </View>

        {/* ─── Dark CTA block ─── */}
        <View style={s.ctaBox}>
          <Text style={s.ctaHeading}>Intéressé par cette offre ?</Text>
          <View style={s.ctaAccentBar} />
          <Text style={s.ctaSubtext}>
            Nos équipes vous accompagnent à chaque étape. Prenez contact pour échanger sur votre
            situation et découvrir comment nous pouvons vous aider.
          </Text>
          <View style={s.ctaContactRow}>
            <IconMail color={ACCENT} />
            <Text style={s.ctaContactText}>Contact : </Text>
            <Text style={s.ctaContactBold}>contact@{brandUrl}</Text>
          </View>
          <View style={s.ctaContactRow}>
            <Text style={[s.ctaContactText, { marginLeft: 16 }]}>
              {brandUrl}
            </Text>
          </View>
        </View>

        {/* ─── Footer P2 ─── */}
        <FooterBar pageNum={2} totalPages={2} brandName={brandName} brandUrl={brandUrl} />
      </Page>

    </Document>
  );
}

export default ExpertiseDocument;
