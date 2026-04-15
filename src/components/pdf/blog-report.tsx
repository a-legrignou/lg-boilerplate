/**
 * blog-report.tsx
 * ===============
 * @react-pdf/renderer — Single-page A4 blog article PDF
 *
 * Same graphic charter as case-study-report.tsx:
 *   - Deep Navy (#1C2A39) + Gold (#C6A75C) + Sage (#7A8F85)
 *   - Helvetica family only (built-in react-pdf fonts)
 *   - No rgba() — solid hex colors + opacity on View
 */

import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BlogPostData {
  id: string | number;
  slug?: string | null;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  date_created?: string | null;
  readtime?: number | null;
  tier?: string | null;
  image?: string | null;
  category?: { title?: string } | string | null;
  authors?: Array<{ post_authors_id?: { name?: string; role?: string } }> | null;
  blocks?: Array<{
    type: string;
    content?: string;
    title?: string;
    caption?: string;
    image?: string;
  }> | null;
  sources?: Array<{
    organisation?: string;
    reference?: string;
    path?: string;
    date?: string;
  }> | null;
}

export interface BlogDocumentProps {
  data: BlogPostData;
  imageUri?: string | null;
  brandName?: string;
  brandUrl?: string;
  accentColor?: string;
  darkColor?: string;
}

/* ------------------------------------------------------------------ */
/*  Palette                                                            */
/* ------------------------------------------------------------------ */

const NAVY = "#1C2A39";
const GOLD = "#C6A75C";
const SAGE = "#7A8F85";
const CREAM = "#F2EDE4";
const WHITE = "#FFFFFF";
const MUTED = "#8A8078";
const BORDER = "#E2DDD7";

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  // ── Page ─────────────────────────────────────────────────────────────
  page: {
    position: "relative",
    fontFamily: "Helvetica",
    backgroundColor: WHITE,
    paddingBottom: 52,
    paddingHorizontal: 28,
    paddingTop: 28,
  },

  // ── Bandeau ──────────────────────────────────────────────────────────
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
    backgroundColor: NAVY,
  },
  bannerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    objectFit: "cover",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: NAVY,
    opacity: 0.6,
  },
  bannerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "20px 28px",
  },
  bannerMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bannerCategory: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  bannerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: SAGE,
    marginHorizontal: 6,
  },
  bannerDate: {
    fontSize: 8,
    color: CREAM,
    opacity: 0.8,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    lineHeight: 1.25,
  },
  bannerSubtitle: {
    fontSize: 10,
    color: CREAM,
    opacity: 0.85,
    marginTop: 6,
    lineHeight: 1.4,
  },

  // ── (unused cover styles kept for compat) ────────────────────────────
  coverBrandUrl: {
    fontSize: 8,
    color: GOLD,
  },

  // ── Article body ─────────────────────────────────────────────────────
  body: {
    padding: 28,
    paddingTop: 240,
  },

  // ── Author row ──────────────────────────────────────────────────────
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginBottom: 18,
  },
  authorName: {
    fontSize: 9,
    color: MUTED,
  },
  authorNameBold: {
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  readtime: {
    fontSize: 9,
    color: MUTED,
  },

  // ── Excerpt ─────────────────────────────────────────────────────────
  excerpt: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#4A4540",
    borderLeftWidth: 2,
    borderLeftColor: GOLD,
    paddingLeft: 10,
    marginBottom: 20,
    fontFamily: "Helvetica-Oblique",
  },

  // ── Section heading ─────────────────────────────────────────────────
  sectionHeading: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 6,
    marginTop: 16,
  },

  // ── Body text ───────────────────────────────────────────────────────
  bodyText: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: "#4A4540",
    marginBottom: 8,
  },

  // ── Block text title ────────────────────────────────────────────────
  blockTextTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 4,
    marginTop: 12,
  },

  // ── Sources ─────────────────────────────────────────────────────────
  sourcesSection: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  sourcesLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sourceRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 5,
  },
  sourceIndex: {
    fontSize: 8,
    color: GOLD,
    width: 12,
    textAlign: "right",
  },
  sourceOrg: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginRight: 4,
  },
  sourceRef: {
    fontSize: 8,
    color: "#4A4540",
    flexShrink: 1,
  },
  sourceDate: {
    fontSize: 7,
    color: MUTED,
    marginLeft: 4,
  },

  // ── Blockquote ──────────────────────────────────────────────────────
  blockquote: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Oblique",
    color: MUTED,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },

  // ── Exemple ─────────────────────────────────────────────────────────
  exempleWrapper: {
    borderLeftWidth: 2,
    borderLeftColor: BORDER,
    paddingLeft: 10,
    marginVertical: 8,
  },
  exempleLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  exempleText: {
    fontSize: 9,
    fontFamily: "Helvetica-Oblique",
    color: MUTED,
    lineHeight: 1.55,
  },

  // ── Footer ──────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: NAVY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
  },
  footerBrand: {
    fontSize: 8,
    color: CREAM,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  footerUrl: {
    fontSize: 8,
    color: GOLD,
  },
  footerRight: {
    fontSize: 7,
    color: CREAM,
    opacity: 0.55,
  },
});

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "• ")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
    .replace(/^>\s+/gm, "")
    .trim();
}

function BlockText({ text }: { text: string }) {
  return <Text style={s.bodyText}>{stripMarkdown(text)}</Text>;
}

/* ------------------------------------------------------------------ */
/*  Main document                                                      */
/* ------------------------------------------------------------------ */

export function BlogDocument({
  data,
  imageUri,
  brandName = "",
  brandUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "") ?? "",
  accentColor = GOLD,
  darkColor = NAVY,
}: BlogDocumentProps) {
  const categoryTitle = typeof data.category === "object" ? data.category?.title : data.category;

  const authorName = Array.isArray(data.authors) && data.authors.length > 0
    ? data.authors.map(a => a.post_authors_id?.name).filter(Boolean).join(" | ")
    : null;

  const formattedDate = data.date_created
    ? new Date(data.date_created).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Document
      title={data.title}
      author={brandName}
      subject={data.excerpt ?? data.subtitle ?? ""}
      creator={brandName}
      producer={brandName}>
      <Page size="A4" style={s.page}>
        {/* ── Bandeau ──────────────────────────────────────────── */}
        <View style={s.banner}>
          {imageUri && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={imageUri} style={s.bannerImage} />
          )}
          <View style={s.bannerOverlay} />
          <View style={s.bannerContent}>
            <View style={s.bannerMeta}>
              {categoryTitle && <Text style={s.bannerCategory}>{categoryTitle}</Text>}
              {categoryTitle && formattedDate && <View style={s.bannerDot} />}
              {formattedDate && <Text style={s.bannerDate}>{formattedDate}</Text>}
              {authorName && (
                <>
                  <View style={s.bannerDot} />
                  <Text style={s.bannerDate}>{authorName}</Text>
                </>
              )}
            </View>
            <Text style={s.bannerTitle}>{data.title}</Text>
            {data.subtitle && <Text style={s.bannerSubtitle}>{data.subtitle}</Text>}
          </View>
        </View>

        {/* ── Corps ────────────────────────────────────────────── */}
        <View style={s.body}>
          {/* Auteur + temps de lecture */}
          <View style={s.authorRow}>
            <Text style={s.authorName}>
              {authorName ? (
                <>
                  <Text>Par </Text>
                  <Text style={s.authorNameBold}>{authorName}</Text>
                </>
              ) : (
                <Text>{brandName}</Text>
              )}
            </Text>
            {data.readtime && <Text style={s.readtime}>{data.readtime} min de lecture</Text>}
          </View>

          {/* Excerpt */}
          {data.excerpt && <Text style={s.excerpt}>{data.excerpt}</Text>}

          {/* Blocs de contenu */}
          {data.blocks?.map((block, i) => {
            switch (block.type) {
              case "heading":
                return (
                  <View key={i} minPresenceAhead={60}>
                    <Text style={s.sectionHeading}>{block.title || block.content}</Text>
                  </View>
                );
              case "text":
                return (
                  <View key={i}>
                    {block.title ? (
                      <View minPresenceAhead={40}>
                        <Text style={s.blockTextTitle}>{block.title}</Text>
                      </View>
                    ) : null}
                    {block.content ? <BlockText text={block.content} /> : null}
                  </View>
                );
              case "quote":
                return block.caption ? (
                  <View key={i} wrap={false}>
                    <Text style={s.blockquote}>« {block.caption} »</Text>
                  </View>
                ) : null;
              case "exemple":
                return (
                  <View key={i} style={s.exempleWrapper} wrap={false}>
                    {block.title ? <Text style={s.exempleLabel}>{block.title}</Text> : null}
                    {block.content ? <Text style={s.exempleText}>{stripMarkdown(block.content)}</Text> : null}
                  </View>
                );
              default:
                return null;
            }
          })}

          {/* Sources */}
          {Array.isArray(data.sources) && data.sources.length > 0 && (
            <View style={s.sourcesSection} wrap={false}>
              <Text style={s.sourcesLabel}>Sources</Text>
              {data.sources.map((src, i) => (
                <View key={i} style={s.sourceRow} wrap={false}>
                  <Text style={s.sourceIndex}>{i + 1}.</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", flexShrink: 1, alignItems: "baseline" }}>
                    {src.organisation ? <Text style={s.sourceOrg}>{src.organisation} </Text> : null}
                    <Text style={s.sourceRef}>{src.reference ?? ""}</Text>
                    {src.date ? <Text style={s.sourceDate}> — {src.date}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Pied de page fixe ────────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerBrand}>{brandName.toUpperCase()}</Text>
          <Text style={s.footerUrl}>{brandUrl}</Text>
          <Text style={s.footerRight}>
            {formattedDate ?? ""}
            {data.readtime ? ` · ${data.readtime} min` : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
