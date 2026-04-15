/**
 * ProposalDocument.tsx
 * ====================
 * @react-pdf/renderer — Fiche offre A4
 *
 * Layout :
 *   Page 1 — Banner · Accroche · [Enjeux (gauche) | Fiche specs (droite)]
 *   Page 2 — Approche · Bénéfices · CTA
 *
 * Palette: Deep Navy (#0B1D3A) + Gold (#C8973E)
 */

import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, Svg, Path } from "@react-pdf/renderer";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ProposalData {
  slug:        string;
  title:       string;
  description: string;
  excerpt:     string;
  axe:         string;       // ex. "Développement" | "Sécurité économique"
  personas:    string[];     // ex. ["Dirigeants", "Investisseurs"]
  duration?:   string;
  deliverable?: string;
  format?:     string;
  budget?:     string;
  why:         string;
  how:         string;
  benefits:    string[];
}

export interface ProposalDocumentProps {
  data:         ProposalData;
  imageUri?:    string | null;
  brandName?:   string;
  brandUrl?:    string;
  accentColor?: string;
  darkColor?:   string;
}

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const ACCENT      = "#C8973E";  // Gold
const DARK        = "#0B1D3A";  // Navy
const WHITE       = "#FFFFFF";
const GRAY_100    = "#F7F6F4";
const GRAY_400    = "#9CA3AF";
const GRAY_700    = "#374151";
const ACCENT_PALE = "#E2CFA0";

const H_PAD         = 42;
const V_PAD         = 36;
const BANNER_HEIGHT = 170;
const SPECS_WIDTH   = 155;
const FOOTER_H      = 50;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  /* Pages */
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: GRAY_700,
    paddingBottom: FOOTER_H,
    position: "relative",
  },
  pageBody: {
    paddingHorizontal: H_PAD,
  },

  /* ---- Banner ---- */
  banner: { position: "relative", width: "100%", height: BANNER_HEIGHT },
  bannerImg: {
    position: "absolute", top: 0, left: 0,
    width: "100%", height: BANNER_HEIGHT,
    objectFit: "cover",
  },
  bannerOverlay: {
    position: "absolute", top: 0, left: 0,
    width: "100%", height: BANNER_HEIGHT,
    backgroundColor: DARK, opacity: 0.75,
  },
  bannerContent: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: H_PAD, paddingBottom: 16,
  },
  bannerAxe: {
    fontSize: 7, fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4, textTransform: "uppercase",
    color: ACCENT, marginBottom: 6,
  },
  bannerTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 21, lineHeight: 1.2, color: WHITE,
    marginBottom: 6,
  },
  bannerPersonaRow: { flexDirection: "row" },
  bannerPersona: {
    fontSize: 7.5, color: WHITE,
    paddingHorizontal: 7, paddingVertical: 3,
    marginRight: 6,
    borderWidth: 1, borderColor: ACCENT,
  },

  /* ---- Excerpt ---- */
  excerptRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 18, marginBottom: 18,
  },
  excerptBar: {
    width: 2, backgroundColor: ACCENT,
    marginRight: 14, marginTop: 2,
    height: "100%",
  },
  excerptText: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 12, lineHeight: 1.55,
    color: DARK, flex: 1,
  },

  /* ---- Two-column layout ---- */
  twoCol: { flexDirection: "row" },
  mainCol: { flex: 1, paddingRight: 20 },
  specsCard: {
    width: SPECS_WIDTH,
    borderWidth: 1, borderColor: ACCENT_PALE,
  },

  /* ---- Section ---- */
  sectionLabel: {
    fontSize: 7, fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4, textTransform: "uppercase",
    marginBottom: 5,
  },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13, lineHeight: 1.3,
    color: DARK, marginBottom: 8,
  },
  sectionBody: { fontSize: 8.5, lineHeight: 1.65, color: GRAY_700 },

  /* ---- Divider ---- */
  divider: { height: 1, backgroundColor: ACCENT_PALE, marginVertical: 14 },

  /* ---- Specs card rows ---- */
  specsHeader: {
    backgroundColor: DARK, paddingHorizontal: 12, paddingVertical: 10,
  },
  specsHeaderLabel: {
    fontSize: 7, fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2, textTransform: "uppercase",
    color: ACCENT, marginBottom: 2,
  },
  specsHeaderValue: {
    fontSize: 9, fontFamily: "Helvetica-Bold",
    color: WHITE,
  },
  specsRow: { paddingHorizontal: 12, paddingVertical: 9, borderTopWidth: 1, borderTopColor: ACCENT_PALE },
  specsRowLabel: {
    fontSize: 6.5, fontFamily: "Helvetica-Bold",
    letterSpacing: 1.1, textTransform: "uppercase",
    color: GRAY_400, marginBottom: 3,
  },
  specsRowValue: { fontSize: 9, lineHeight: 1.4, color: DARK },

  /* ---- Personas in specs ---- */
  personaChips: { flexDirection: "row", flexWrap: "wrap" },
  personaChip: {
    fontSize: 7.5, color: DARK,
    backgroundColor: GRAY_100,
    paddingHorizontal: 6, paddingVertical: 3,
    marginRight: 4, marginBottom: 4,
  },

  /* CTA in specs card */
  specsCtaBox: {
    backgroundColor: ACCENT,
    paddingHorizontal: 12, paddingVertical: 10,
    marginTop: "auto",
  },
  specsCtaText: {
    fontSize: 8, fontFamily: "Helvetica-Bold",
    color: DARK, textAlign: "center",
    letterSpacing: 0.5,
  },
  specsCtaUrl: {
    fontSize: 7, color: DARK,
    textAlign: "center", marginTop: 3,
    textDecoration: "underline",
  },

  /* ---- Benefits ---- */
  benefitRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 7 },
  benefitBullet: {
    fontFamily: "Helvetica-Bold", fontSize: 9,
    color: ACCENT, marginRight: 7, marginTop: 0.5,
  },
  benefitText: { fontSize: 8.5, lineHeight: 1.55, flex: 1 },

  /* ---- CTA box ---- */
  ctaBox: {
    backgroundColor: DARK,
    padding: 18, marginTop: 18,
  },
  ctaBoxLabel: {
    fontSize: 7, fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4, textTransform: "uppercase",
    color: ACCENT, marginBottom: 8,
  },
  ctaBoxText: {
    fontSize: 9.5, lineHeight: 1.6,
    fontFamily: "Helvetica-Oblique", color: WHITE,
    marginBottom: 10,
  },
  ctaBoxLink: {
    fontSize: 8, fontFamily: "Helvetica-Bold",
    color: ACCENT, textDecoration: "underline",
  },

  /* ---- Page 2 header ---- */
  page2Header: { flexDirection: "row", marginBottom: 20 },
  page2HeaderBar: { flex: 1, height: 4, backgroundColor: DARK },
  page2HeaderAccent: { width: 100, height: 4, backgroundColor: ACCENT },

  /* ---- Footer ---- */
  footer: {
    position: "absolute",
    bottom: 18, left: H_PAD, right: H_PAD,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  footerText: { fontSize: 7, color: GRAY_400 },
  footerPage: { fontSize: 7, fontFamily: "Helvetica-Bold", color: GRAY_400 },
});

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function CheckIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={9} height={9}>
      <Path
        d="M20 6L9 17l-5-5"
        stroke={ACCENT}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function Section({ label, heading, body, accent }: { label: string; heading: string; body: string; accent: string }) {
  if (!body && !heading) return null;
  return (
    <View>
      <Text style={[s.sectionLabel, { color: accent }]}>{label}</Text>
      {heading ? <Text style={s.sectionHeading}>{heading}</Text> : null}
      {body     ? <Text style={s.sectionBody}>{body}</Text>     : null}
    </View>
  );
}

function Footer({ page, total, brandName, brandUrl }: { page: number; total: number; brandName: string; brandUrl: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{brandName}{brandUrl ? ` — ${brandUrl}` : ""}</Text>
      <Text style={s.footerPage}>{page}/{total}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Main document                                                      */
/* ------------------------------------------------------------------ */

export function ProposalDocument({
  data,
  imageUri,
  brandName   = "Coreo Group",
  brandUrl    = "coreo-group.fr",
  accentColor = ACCENT,
  darkColor   = DARK,
}: ProposalDocumentProps) {
  const hasPage2 = data.benefits.length > 0;
  const totalPages = hasPage2 ? 2 : 1;

  const specsRows = [
    data.duration    && { label: "Durée",    value: data.duration },
    data.deliverable && { label: "Livrable", value: data.deliverable },
    data.format      && { label: "Format",   value: data.format },
    data.budget      && { label: "Budget",   value: data.budget },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Document title={data.title} author={brandName} subject={`Fiche offre — ${data.title}`}>

      {/* ══════════ PAGE 1 ══════════ */}
      <Page size="A4" style={s.page}>

        {/* Banner */}
        <View style={s.banner}>
          {imageUri
            ? <Image src={imageUri} style={s.bannerImg} />
            : null}
          <View style={s.bannerOverlay} />
          <View style={s.bannerContent}>
            {data.axe ? <Text style={s.bannerAxe}>{data.axe}</Text> : null}
            <Text style={s.bannerTitle}>{data.title}</Text>
            {data.personas.length > 0 && (
              <View style={s.bannerPersonaRow}>
                {data.personas.map((p) => (
                  <Text key={p} style={s.bannerPersona}>{p}</Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Body */}
        <View style={s.pageBody}>

          {/* Excerpt */}
          {data.excerpt ? (
            <View style={s.excerptRow}>
              <View style={s.excerptBar} />
              <Text style={s.excerptText}>{data.excerpt}</Text>
            </View>
          ) : null}

          <View style={s.divider} />

          {/* Two-column: enjeux + approche | specs */}
          <View style={s.twoCol}>

            {/* Left — Enjeux puis Approche */}
            <View style={s.mainCol}>
              {data.why ? (
                <Section
                  label="Vos enjeux"
                  heading="Vous êtes concerné si…"
                  body={data.why}
                  accent={accentColor}
                />
              ) : null}
              {data.why && data.how ? <View style={[s.divider, { marginVertical: 12 }]} /> : null}
              {data.how ? (
                <Section
                  label="Méthodologie"
                  heading="Ce que nous faisons"
                  body={data.how}
                  accent={accentColor}
                />
              ) : null}
            </View>

            {/* Right — Specs card */}
            <View style={s.specsCard}>
              {/* Axe header */}
              {data.axe ? (
                <View style={s.specsHeader}>
                  <Text style={s.specsHeaderLabel}>Axe</Text>
                  <Text style={s.specsHeaderValue}>{data.axe}</Text>
                </View>
              ) : null}

              {/* Personas */}
              {data.personas.length > 0 && (
                <View style={s.specsRow}>
                  <Text style={s.specsRowLabel}>Pour</Text>
                  <View style={s.personaChips}>
                    {data.personas.map((p) => (
                      <Text key={p} style={s.personaChip}>{p}</Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Spec rows */}
              {specsRows.map(({ label, value }) => (
                <View key={label} style={s.specsRow}>
                  <Text style={s.specsRowLabel}>{label}</Text>
                  <Text style={s.specsRowValue}>{value}</Text>
                </View>
              ))}

              {/* CTA */}
              <View style={s.specsCtaBox}>
                <Text style={s.specsCtaText}>Être contacté</Text>
                <Text style={s.specsCtaUrl}>{brandUrl}</Text>
              </View>
            </View>
          </View>
        </View>

        <Footer page={1} total={totalPages} brandName={brandName} brandUrl={brandUrl} />
      </Page>

      {/* ══════════ PAGE 2 (conditionnel) ══════════ */}
      {hasPage2 && (
        <Page size="A4" style={s.page}>
          <View style={[s.pageBody, { paddingTop: V_PAD }]}>

            {/* Header bar */}
            <View style={s.page2Header}>
              <View style={s.page2HeaderBar} />
              <View style={s.page2HeaderAccent} />
            </View>

            {/* Bénéfices */}
            {data.benefits.length > 0 && (
              <View>
                <Text style={[s.sectionLabel, { color: accentColor, marginBottom: 10 }]}>
                  Bénéfices
                </Text>
                <Text style={[s.sectionHeading, { marginBottom: 12 }]}>
                  Ce que vous en retirez
                </Text>
                {data.benefits.map((b, i) => (
                  <View key={i} style={s.benefitRow}>
                    <View style={{ marginRight: 7, marginTop: 1 }}>
                      <CheckIcon />
                    </View>
                    <Text style={s.benefitText}>{b}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* CTA box */}
            <View style={s.ctaBox}>
              <Text style={s.ctaBoxLabel}>Passage à l'action</Text>
              <Text style={s.ctaBoxText}>
                {data.description || "Engagez cette démarche avec nos experts."}
              </Text>
              <Text style={s.ctaBoxLink}>{brandUrl}</Text>
            </View>
          </View>

          <Footer page={2} total={totalPages} brandName={brandName} brandUrl={brandUrl} />
        </Page>
      )}
    </Document>
  );
}

export default ProposalDocument;
