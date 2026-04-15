/**
 * route.ts
 * ========
 * GET /api/blog/[id]/pdf
 *
 * Generates a PDF for a blog article.
 * Premium articles require a valid session with premium tier.
 *
 * Query params (optional):
 *   ?brand=MonCabinet
 *   ?url=www.moncabinet.com
 *   ?accent=#C6A75C
 *   ?dark=#1C2A39
 */

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import React, { type ReactElement } from "react";
import { BlogDocument, type BlogPostData } from "@/components/pdf/blog-report";
import { getSession, getUserTier, canAccessPost } from "@/lib/utils/auth";
import { getPostContent } from "@/lib/models/blog";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DIRECTUS_ASSETS = (process.env.NEXT_PUBLIC_DIRECTUS_ASSETS || process.env.DIRECTUS_URL || "").replace(/\/$/, "");
const DIRECTUS_TOKEN  = process.env.DIRECTUS_STATIC_TOKEN || "";

async function fetchImageAsDataUri(imageId: string | null | undefined): Promise<string | null> {
  if (!imageId) return null;
  const base = (process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(/\/$/, "");
  try {
    const imgUrl = `${base}/assets/${imageId}?width=1200&quality=80&format=jpeg`;
    const res = await fetch(imgUrl, {
      headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
    });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Route Handler                                                      */
/* ------------------------------------------------------------------ */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  // 1. Fetch post — même logique que la page (slug → id fallback)
  const data = await getPostContent(id) as BlogPostData | null;
  if (!data) {
    return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
  }

  // 2. Auth check — premium posts require premium tier
  if (data.tier) {
    const user = await getSession();
    const userTier = getUserTier(user);

    if (!canAccessPost(userTier, data.tier)) {
      return NextResponse.json(
        { error: "Accès réservé aux membres Premium." },
        { status: 403 },
      );
    }
  }

  // 3. Pre-fetch cover image as base64
  const imageUri = await fetchImageAsDataUri(data.image);

  // 4. Optional customization
  const brandName  = searchParams.get("brand")  || undefined;
  const brandUrl   = searchParams.get("url")    || undefined;
  const accentColor = searchParams.get("accent") || undefined;
  const darkColor  = searchParams.get("dark")   || undefined;

  // 5. Render PDF
  const buffer = await renderToBuffer(
    React.createElement(BlogDocument, {
      data,
      imageUri,
      brandName,
      brandUrl,
      accentColor,
      darkColor,
    }) as ReactElement<DocumentProps>,
  );

  // 6. Return PDF
  const postSlug = data.slug || id;
  const filename = `article_${postSlug}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
