/**
 * CaseStudyDocument.tsx
 * =====================
 * @react-pdf/renderer — Two-pager A4 "Intelligence Éditoriale"
 *
 * Palette: Deep Navy (#0B1D3A) + Gold (#C8973E)
 * Tags: SVG icon badges (Lucide-style paths) for sector & size
 */

import React from "react";
import { Document, Page, Text, View, Image, StyleSheet, Svg, Path, Circle, Rect, G } from "@react-pdf/renderer";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CaseStudyKpi {
  label: string;
  value: string;
}

export interface CaseStudyCta {
  path: string;
  label: string;
}

export interface CaseStudyData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  client_size: string;
  client_sector: string;
  kpi: CaseStudyKpi[];
  context_heading: string;
  context_description: string;
  context_takeways: string[] | null;
  challenge_heading: string;
  challenge_description: string;
  challenge_takeways: string[] | null;
  approach_heading: string;
  approach_description: string;
  approach_takeways: string[] | null;
  results_heading: string;
  results_description: string;
  results_takeways: string[] | null;
  conclusion: string;
  cta: CaseStudyCta[] | null;
}

export interface CaseStudyDocumentProps {
  data: CaseStudyData;
  imageUri?: string | null;
  brandName?: string;
  brandUrl?: string;
  accentColor?: string;
  darkColor?: string;
}

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const DEFAULT_ACCENT = "#C8973E"; // Gold
const DEFAULT_DARK = "#0B1D3A"; // Navy
const GRAY_100 = "#F7F6F4";
const GRAY_300 = "#D1D5DB";
const GRAY_500 = "#6B7280";
const GRAY_700 = "#374151";
const WHITE = "#FFFFFF";

const PAGE_H_PAD = 42;
const PAGE_V_PAD = 40;
const BANNER_HEIGHT = 200;

/* ------------------------------------------------------------------ */
/*  SVG Icons (Lucide-style, 24x24 viewBox)                           */
/* ------------------------------------------------------------------ */

/** Lucide "Shield" — defence / security */
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

/** Lucide "Scale" — regulated professions / legal */
function IconScale({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={11} height={11}>
      <Path
        d="M12 3v18M4 7l8-4 8 4M4 7v2a8 8 0 004 7M20 7v2a8 8 0 01-4 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Lucide "Building2" — enterprise / grand groupe */
function IconBuilding({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={11} height={11}>
      <Path
        d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18zM6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M10 6h4M10 10h4M10 14h4M10 18h4" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Lucide "Store" — PME / small business */
function IconStore({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={11} height={11}>
      <Path
        d="M3 9l1-4h16l1 4M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9M9 21V12h6v9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Lucide "Briefcase" — generic business */
function IconBriefcase({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={11} height={11}>
      <Path
        d="M16 20V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v16M2 7h20a1 1 0 011 1v11a2 2 0 01-2 2H3a2 2 0 01-2-2V8a1 1 0 011-1z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** Lucide "Landmark" — institution */
function IconLandmark({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={11} height={11}>
      <Path
        d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2L2 8h20L12 2z"
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
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */

const sectorIcons: Record<string, (props: { color: string }) => React.JSX.Element> = {
  defence: IconShield,
  regulated_professions: IconScale,
  finance: IconBriefcase,
  tech: IconBriefcase,
  healthcare: IconBriefcase,
  energy: IconBriefcase,
  industry: IconBuilding,
  public_sector: IconLandmark,
};

const sizeIcons: Record<string, (props: { color: string }) => React.JSX.Element> = {
  ge: IconBuilding,
  eti: IconBuilding,
  pme: IconStore,
  startup: IconStore,
  institution: IconLandmark,
};

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: GRAY_700,
    paddingBottom: 50,
    position: "relative",
  },
  page1Body: { paddingHorizontal: PAGE_H_PAD },
  page2: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: GRAY_700,
    paddingHorizontal: PAGE_H_PAD,
    paddingTop: PAGE_V_PAD,
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
    paddingBottom: 18,
    paddingTop: 20,
  },
  bannerSolid: {
    width: "100%",
    height: BANNER_HEIGHT,
    justifyContent: "flex-end",
    paddingHorizontal: PAGE_H_PAD,
    paddingBottom: 18,
  },

  /* ---- Badge tags ---- */
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
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
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 11,
  },

  /* ---- Body ---- */
  description: {
    fontSize: 9.5,
    lineHeight: 1.55,
    marginBottom: 18,
    marginTop: 16,
    maxWidth: "85%",
  },

  /* ---- KPIs ---- */
  kpiBand: {
    backgroundColor: GRAY_100,
    borderRadius: 4,
    paddingVertical: 4,
    marginBottom: 22,
  },
  kpiRow: { flexDirection: "row", gap: 0, alignItems: "center" },
  kpiCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  kpiSeparator: {
    width: 1,
    height: 44,
  },
  kpiValue: { fontFamily: "Helvetica-Bold", fontSize: 20, marginBottom: 5 },
  kpiLabel: {
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: GRAY_500,
  },

  /* ---- Section ---- */
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    lineHeight: 1.3,
    marginBottom: 8,
  },
  sectionBody: { fontSize: 9, lineHeight: 1.6, marginBottom: 10 },
  takeawayRow: { flexDirection: "row", marginBottom: 5, paddingLeft: 2 },
  takeawayBullet: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginRight: 6,
    marginTop: 0.5,
  },
  takeawayText: { fontSize: 8.5, lineHeight: 1.5, flex: 1 },

  /* ---- Divider (gold accent line) ---- */
  divider: { height: 1, backgroundColor: "#E2CFA0", marginVertical: 16 },

  /* ---- Columns ---- */
  twoCol: { flexDirection: "row", gap: 24 },
  colLeft: { flex: 1 },
  colRight: { flex: 1 },

  /* ---- Conclusion ---- */
  conclusionBox: { padding: 18, borderRadius: 3, marginTop: 14 },
  conclusionText: {
    fontSize: 9.5,
    lineHeight: 1.6,
    fontFamily: "Helvetica-Oblique",
    color: WHITE,
  },
  ctaRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  ctaLink: { fontSize: 8, fontFamily: "Helvetica-Bold", textDecoration: "underline" },

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
  footerPage: { fontSize: 7, fontFamily: "Helvetica-Bold", color: GRAY_500 },

  /* ---- Page 2 header ---- */
  headerBar: { height: 4, marginBottom: 20 },
  accentStripe: { position: "absolute", top: 0, right: 0, width: 120, height: 4 },

  /* ---- Results card ---- */
  highlightCard: {
    backgroundColor: GRAY_100,
    padding: 14,
    borderRadius: 3,
    marginBottom: 14,
    borderLeftWidth: 3,
  },
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const clientSizeLabels: Record<string, string> = {
  ge: "Grand groupe",
  eti: "ETI",
  pme: "PME",
  startup: "Startup",
  institution: "Institution",
};

const clientSectorLabels: Record<string, string> = {
  defence: "Défense & Aéronautique",
  regulated_professions: "Professions réglementées",
  finance: "Finance",
  tech: "Tech",
  healthcare: "Santé",
  energy: "Énergie",
  industry: "Industrie",
  public_sector: "Secteur public",
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function BadgeTag({
  icon: IconComponent,
  label,
  variant,
  accentColor,
}: {
  icon: (props: { color: string }) => React.JSX.Element;
  label: string;
  variant: "filled" | "outline";
  accentColor: string;
}) {
  const isFilled = variant === "filled";
  return (
    <View
      style={[
        s.badge,
        isFilled
          ? { backgroundColor: accentColor }
          : { backgroundColor: "#1E2D4A", borderWidth: 1, borderColor: accentColor },
      ]}>
      <IconComponent color={isFilled ? WHITE : accentColor} />
      <Text style={[s.badgeText, { color: isFilled ? WHITE : accentColor }]}>{label}</Text>
    </View>
  );
}

function Section({
  label,
  heading,
  body,
  takeaways,
  accentColor,
}: {
  label: string;
  heading: string;
  body: string;
  takeaways: string[] | null;
  accentColor: string;
}) {
  return (
    <View>
      <Text style={[s.sectionLabel, { color: accentColor }]}>{label}</Text>
      <Text style={s.sectionHeading}>{heading}</Text>
      <Text style={s.sectionBody}>{body}</Text>
      {takeaways &&
        takeaways.length > 0 &&
        takeaways.map((tw, i) => (
          <View key={i} style={s.takeawayRow}>
            <Text style={[s.takeawayBullet, { color: accentColor }]}>→</Text>
            <Text style={s.takeawayText}>{tw}</Text>
          </View>
        ))}
    </View>
  );
}

function FooterBar({
  pageNum,
  brandName,
  brandUrl,
  darkColor,
}: {
  pageNum: number;
  brandName: string;
  brandUrl: string;
  darkColor: string;
}) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        {brandName}
        {brandUrl ? ` — ${brandUrl}` : ""}
      </Text>
      <Text style={[s.footerPage, { color: darkColor }]}>{pageNum}/2</Text>
    </View>
  );
}

function HeroBanner({
  imageUri,
  title,
  subtitle,
  sectorLabel,
  sizeLabel,
  sectorKey,
  sizeKey,
  accentColor,
  darkColor,
}: {
  imageUri?: string | null;
  title: string;
  subtitle: string;
  sectorLabel: string;
  sizeLabel: string;
  sectorKey: string;
  sizeKey: string;
  accentColor: string;
  darkColor: string;
}) {
  const SectorIcon = sectorIcons[sectorKey] || IconBriefcase;
  const SizeIcon = sizeIcons[sizeKey] || IconBuilding;

  const badges = (
    <View style={s.badgeRow}>
      <BadgeTag icon={SectorIcon} label={sectorLabel} variant="filled" accentColor={accentColor} />
      <BadgeTag icon={SizeIcon} label={sizeLabel} variant="outline" accentColor={accentColor} />
    </View>
  );

  if (imageUri) {
    return (
      <View style={s.bannerContainer}>
        <Image src={imageUri} style={s.bannerImage} />
        <View style={[s.bannerOverlay, { backgroundColor: darkColor }]} />
        <View style={s.bannerContent}>
          {badges}
          <Text style={s.bannerTitle}>{title}</Text>
          <Text style={[s.bannerSubtitle, { color: accentColor }]}>{subtitle}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.bannerSolid, { backgroundColor: darkColor }]}>
      {badges}
      <Text style={s.bannerTitle}>{title}</Text>
      <Text style={[s.bannerSubtitle, { color: accentColor }]}>{subtitle}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Document                                                      */
/* ------------------------------------------------------------------ */

export function CaseStudyDocument({
  data,
  imageUri,
  brandName = "Confidentiel",
  brandUrl = "",
  accentColor = DEFAULT_ACCENT,
  darkColor = DEFAULT_DARK,
}: CaseStudyDocumentProps) {
  const sizeLabel = clientSizeLabels[data.client_size] || data.client_size;
  const sectorLabel = clientSectorLabels[data.client_sector] || data.client_sector;

  return (
    <Document title={data.title} author={brandName} subject={`Case Study — ${data.subtitle}`}>
      {/* ========== PAGE 1 ========== */}
      <Page size="A4" style={s.page}>
        <HeroBanner
          imageUri={imageUri}
          title={data.title}
          subtitle={data.subtitle}
          sectorLabel={sectorLabel}
          sizeLabel={sizeLabel}
          sectorKey={data.client_sector}
          sizeKey={data.client_size}
          accentColor={accentColor}
          darkColor={darkColor}
        />

        <View style={s.page1Body}>
          <Text style={s.description}>{data.description}</Text>

          {data.kpi && data.kpi.length > 0 && (
            <View style={s.kpiBand}>
              <View style={s.kpiRow}>
                {data.kpi.map((kpi, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <View style={[s.kpiSeparator, { backgroundColor: accentColor }]} />}
                    <View style={s.kpiCard}>
                      <Text style={[s.kpiValue, { color: darkColor }]}>{kpi.value}</Text>
                      <Text style={s.kpiLabel}>{kpi.label}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          <View style={s.divider} />

          <View style={s.twoCol}>
            <View style={s.colLeft}>
              <Section
                label="Contexte"
                heading={data.context_heading}
                body={data.context_description}
                takeaways={data.context_takeways}
                accentColor={accentColor}
              />
            </View>
            <View style={s.colRight}>
              <Section
                label="Défi"
                heading={data.challenge_heading}
                body={data.challenge_description}
                takeaways={data.challenge_takeways}
                accentColor={accentColor}
              />
            </View>
          </View>
        </View>

        <FooterBar pageNum={1} brandName={brandName} brandUrl={brandUrl} darkColor={darkColor} />
      </Page>

      {/* ========== PAGE 2 ========== */}
      <Page size="A4" style={s.page2}>
        <View style={[s.headerBar, { backgroundColor: darkColor }]} />
        <View style={[s.accentStripe, { backgroundColor: accentColor }]} />

        <Section
          label="Notre approche"
          heading={data.approach_heading}
          body={data.approach_description}
          takeaways={data.approach_takeways}
          accentColor={accentColor}
        />

        <View style={s.divider} />

        <View style={[s.highlightCard, { borderLeftColor: accentColor }]}>
          <Section
            label="Résultats"
            heading={data.results_heading}
            body={data.results_description}
            takeaways={data.results_takeways}
            accentColor={accentColor}
          />
        </View>

        <View style={[s.conclusionBox, { backgroundColor: darkColor }]}>
          <Text style={[s.sectionLabel, { color: accentColor, marginBottom: 8 }]}>Conclusion</Text>
          <Text style={s.conclusionText}>{data.conclusion}</Text>
          {data.cta && data.cta.length > 0 && (
            <View style={s.ctaRow}>
              {data.cta.map((link, i) => (
                <Text key={i} style={[s.ctaLink, { color: accentColor }]}>
                  {link.label}
                </Text>
              ))}
            </View>
          )}
        </View>

        <FooterBar pageNum={2} brandName={brandName} brandUrl={brandUrl} darkColor={darkColor} />
      </Page>
    </Document>
  );
}

export default CaseStudyDocument;
