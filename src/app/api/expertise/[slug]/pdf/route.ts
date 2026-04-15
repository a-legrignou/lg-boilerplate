/**
 * route.ts
 * ========
 * GET /api/expertise/[slug]/pdf
 * → Génère et retourne la fiche offre PDF en réutilisant CaseStudyDocument
 */

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import React, { type ReactElement } from "react";
import { CaseStudyDocument, type CaseStudyData } from "@/components/pdf/case-study-report";
import { getModuleBySlug } from "@/lib/models/products";

const DIRECTUS_URL   = (process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(/\/$/, "");
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || "";

const PERSONA_DESC: Record<string, string> = {
  dirigeants:    "Dirigeants d'entreprise cherchant à développer leur présence ou sécuriser leurs intérêts stratégiques.",
  leaders:       "Dirigeants d'entreprise cherchant à développer leur présence ou sécuriser leurs intérêts stratégiques.",
  investisseurs: "Investisseurs et fonds souhaitant qualifier leurs cibles ou sécuriser leurs opérations.",
  investors:     "Investisseurs et fonds souhaitant qualifier leurs cibles ou sécuriser leurs opérations.",
};

async function fetchImageAsDataUri(imageId: string | null): Promise<string | null> {
  if (!imageId) return null;
  try {
    const imgUrl = new URL(`${DIRECTUS_URL}/assets/${imageId}`);
    imgUrl.searchParams.set("width", "1200");
    imgUrl.searchParams.set("quality", "80");
    imgUrl.searchParams.set("format", "jpeg");

    const res = await fetch(imgUrl.toString(), {
      headers: { ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}) },
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

  // Reuse the proven SDK model
  const module = await getModuleBySlug(slug);
  if (!module) {
    return NextResponse.json({ error: "Expertise not found" }, { status: 404 });
  }

  const imageId  = (module as any).image?.id ?? null;
  const imageUri = await fetchImageAsDataUri(imageId);

  // Normalize persona
  const personaRaw: string[] = Array.isArray(module.persona)
    ? module.persona
    : (module.persona as string | undefined)?.split(",") ?? [];
  const personas = personaRaw.map((p: string) => p.trim()).filter(Boolean);
  const personaLabel = personas.map((p: string) => {
    if (p === "dirigeants" || p === "leaders") return "Dirigeants";
    if (p === "investisseurs" || p === "investors") return "Investisseurs";
    return p;
  }).join(" & ");

  const personaDesc = personas
    .map((p: string) => PERSONA_DESC[p] ?? p)
    .join(" — ");

  const benefits: string[] = Array.isArray(module.benefits)
    ? (module.benefits as unknown[]).filter(Boolean).map(String)
    : [];

  // Map to CaseStudyData — same component, different content
  const data: CaseStudyData = {
    slug:                 module.slug ?? "",
    title:                module.title,
    subtitle:             personaLabel,
    description:          (module as any).description ?? "",
    image:                imageId,

    client_size:          "",
    client_sector:        "",

    kpi:                  [],

    context_heading:      "Le défi",
    context_description:  (module as any).why ?? "",
    context_takeways:     null,

    challenge_heading:    personaLabel || "Pour qui",
    challenge_description: personaDesc,
    challenge_takeways:   null,

    approach_heading:     "Notre approche",
    approach_description: (module as any).how ?? "",
    approach_takeways:    null,

    results_heading:      "Ce que vous en retirez",
    results_description:  "",
    results_takeways:     benefits.length > 0 ? benefits : null,

    conclusion:           (module as any).budget ?? "Accompagnement sur mesure — contactez-nous pour un devis adapté à votre situation.",
    cta:                  [{ path: "/contact", label: `Nous contacter — ${(process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/^https?:\/\//, "")}` }],
  };

  const buffer = await renderToBuffer(
    React.createElement(CaseStudyDocument, { data, imageUri }) as ReactElement<DocumentProps>,
  );

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="expertise_${slug}.pdf"`,
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}
