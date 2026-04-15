/**
 * route.ts
 * ========
 * Next.js 16+ App Router — Route Handler
 *
 * Path:  app/api/case-study/[slug]/pdf/route.ts
 *
 * GET /api/case-study/aeronautic_safety/pdf
 *   → streams back the two-pager PDF with hero banner image
 *
 * Query params (optional):
 *   ?brand=MonCabinet       — brand name in footer
 *   ?url=www.moncabinet.com — URL in footer
 *   ?accent=#E85D2A         — accent color
 *   ?dark=#0B1D3A           — dark color
 */

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import React, { type ReactElement } from "react";
import { CaseStudyDocument, type CaseStudyData } from "@/components/pdf/case-study-report";

/* ------------------------------------------------------------------ */
/*  Env                                                                */
/* ------------------------------------------------------------------ */

const DIRECTUS_URL = (process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(/\/$/, "");
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || "";

/* ------------------------------------------------------------------ */
/*  Directus helpers                                                   */
/* ------------------------------------------------------------------ */

async function fetchCaseStudy(slug: string): Promise<CaseStudyData | null> {
  const url = new URL(`${DIRECTUS_URL}/items/case_studies`);
  url.searchParams.set("filter[slug][_eq]", slug);
  url.searchParams.set("filter[status][_eq]", "published");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return (json?.data?.[0] as CaseStudyData) ?? null;
}

/**
 * Pre-fetch the banner image from Directus assets and return as
 * base64 data URI. Returns null if image is missing or fetch fails.
 *
 * Uses `?width=1200&quality=80&format=jpeg` to get a reasonably
 * sized image — no need to embed a 6000px original in a PDF.
 */
async function fetchImageAsDataUri(imageId: string | null): Promise<string | null> {
  if (!imageId) return null;

  try {
    const imgUrl = new URL(`${DIRECTUS_URL}/assets/${imageId}`);
    imgUrl.searchParams.set("width", "1200");
    imgUrl.searchParams.set("quality", "80");
    imgUrl.searchParams.set("format", "jpeg");

    const res = await fetch(imgUrl.toString(), {
      headers: {
        ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
      },
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    console.warn(`[pdf] Failed to fetch image ${imageId}`);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Route Handler                                                      */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  // 1. Fetch case study data
  const data = await fetchCaseStudy(slug);
  if (!data) {
    return NextResponse.json({ error: "Case study not found" }, { status: 404 });
  }

  // 2. Pre-fetch banner image (parallel-safe, fails gracefully)
  const imageUri = await fetchImageAsDataUri(data.image);

  // 3. Optional customization
  const brandName = searchParams.get("brand") || undefined;
  const brandUrl = searchParams.get("url") || undefined;
  const accentColor = searchParams.get("accent") || undefined;
  const darkColor = searchParams.get("dark") || undefined;

  // 4. Render PDF
  const buffer = await renderToBuffer(
    React.createElement(CaseStudyDocument, {
      data,
      imageUri,
      brandName,
      brandUrl,
      accentColor,
      darkColor,
    }) as ReactElement<DocumentProps>,
  );

  // 5. Return response
  const filename = `case-study_${slug}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}
