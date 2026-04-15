/**
 * route.ts
 * ========
 * GET /api/proposal/[slug]/pdf
 * → Génère et retourne la fiche offre PDF via ProposalDocument
 */

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import React, { type ReactElement } from "react";
import { ProposalDocument, type ProposalData } from "@/components/pdf/proposal-report";
import { getModuleBySlug } from "@/lib/models/products";

const DIRECTUS_URL   = (process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(/\/$/, "");
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || "";
const SITE_URL       = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/^https?:\/\//, "");

const PERSONA_LABEL: Record<string, string> = {
  dirigeants:    "Dirigeants",
  leaders:       "Dirigeants",
  investisseurs: "Investisseurs",
  investors:     "Investisseurs",
};

const AXE_LABEL: Record<string, string> = {
  growth:     "Développement",
  resilience: "Sécurité économique",
};

async function fetchImageAsDataUri(imageId: string | null): Promise<string | null> {
  if (!imageId) return null;
  try {
    const imgUrl = new URL(`${DIRECTUS_URL}/assets/${imageId}`);
    imgUrl.searchParams.set("width", "1200");
    imgUrl.searchParams.set("quality", "80");
    imgUrl.searchParams.set("format", "jpeg");

    const res = await fetch(imgUrl.toString(), {
      headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
    });

    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const module = await getModuleBySlug(slug);
  if (!module) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  const imageId  = (module as any).image?.id ?? null;
  const imageUri = await fetchImageAsDataUri(imageId);

  // Normalize personas
  const personaRaw: string[] = Array.isArray(module.persona)
    ? module.persona
    : (module.persona as string | undefined)?.split(",") ?? [];
  const personas = personaRaw
    .map((p: string) => PERSONA_LABEL[p.trim()] ?? p.trim())
    .filter(Boolean);

  // Normalize benefits
  const benefits: string[] = Array.isArray((module as any).benefits)
    ? (module as any).benefits.filter(Boolean).map(String)
    : [];

  const data: ProposalData = {
    slug:        module.slug ?? "",
    title:       module.title,
    description: (module as any).description ?? "",
    excerpt:     (module as any).excerpt ?? "",
    axe:         (module as any).axe ? (AXE_LABEL[(module as any).axe] ?? (module as any).axe) : "",
    personas,
    duration:    (module as any).duration   ?? undefined,
    deliverable: (module as any).deliverable ?? undefined,
    format:      (module as any).format      ?? undefined,
    budget:      (module as any).budget      ?? undefined,
    why:         (module as any).why ?? "",
    how:         (module as any).how ?? "",
    benefits,
  };

  const buffer = await renderToBuffer(
    React.createElement(ProposalDocument, {
      data,
      imageUri,
      brandName: "Votre Société",
      brandUrl: SITE_URL || "votre-domaine.fr",
    }) as ReactElement<DocumentProps>,
  );

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="offre_${slug}.pdf"`,
      "Cache-Control":       "public, max-age=60, s-maxage=300",
    },
  });
}
