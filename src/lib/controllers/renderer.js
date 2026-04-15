import { createElement } from "react";
import SmartLink from "@/components/ui/smart-link";
import { ArrowRight } from "lucide-react";
import * as Sections from "@/components/sections";
import TitleSection from "@/components/widgets/title-section";
import CaseCard from "@/components/cards/case-card";
import TeamCard from "@/components/cards/team-card";
import ModuleCard from "@/components/cards/product-card";

/* ─── SectionCta ──────────────────────────────────────────────────── */
function SectionCta({ ctas, tone = "light" }) {
  const isDark = tone === "dark" || tone === "navy";
  return (
    <div className="flex flex-wrap items-center gap-4 mt-10">
      {ctas.map((cta, i) => (
        <SmartLink
          key={i}
          href={cta.path}
          className={[
            "group inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300",
            i === 0
              ? "bg-gold text-noir hover:bg-gold/85"
              : isDark
                ? "border border-tw/15 text-tw/70 hover:border-gold/40 hover:text-gold"
                : "border border-border text-t1 hover:border-navy hover:text-navy",
          ].join(" ")}>
          {cta.label}
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </SmartLink>
      ))}
    </div>
  );
}

/* ─── BlockRenderer ──────────────────────────────────────────────── *
 * M2A : block.collection + block.item
 *   collection = "blocks"        → route par item.type
 *   collection = "case_studies"  → CaseCard
 *   collection = "team_members"  → TeamCard
 *   collection = "products"      → ModuleCard
 *
 * item.span (integer) → col-span-{n} dans une grille
 */
const BLOCK_REGISTRY = {
  default:     () => import("@/components/blocks/default"),
  paragraph:   () => import("@/components/blocks/paragraph"),
  list:        () => import("@/components/blocks/list"),
  image:       () => import("@/components/blocks/image"),
  kpi:         () => import("@/components/blocks/kpi"),
  note:        () => import("@/components/blocks/note"),
  cta:         () => import("@/components/blocks/cta"),
  "area-card":    () => import("@/components/blocks/card"),
  "step":         () => import("@/components/blocks/step"),
};

async function BlockRenderer({ block }) {
  const { collection, item } = block ?? {};
  if (!collection || !item) return null;

  const span = item?.span > 1 ? `md:col-span-${item.span}` : "";
  const wrapper = (children) => <div className={`h-full${span ? ` ${span}` : ""}`}>{children}</div>;

  if (collection === "case_studies") return wrapper(<CaseCard block={item} />);

  if (collection === "team_members") {
    const normalized = {
      ...item,
      title:    [item.first_name, item.last_name].filter(Boolean).join(" ") || item.title,
      subtitle: item.role ?? item.subtitle,
    };
    return wrapper(<TeamCard block={normalized} />);
  }

  if (collection === "products") return wrapper(<ModuleCard module={item} line={null} />);

  // collection === "blocks" → route par item.type
  const type = item?.type ?? "default";
  const loader = BLOCK_REGISTRY[type] ?? BLOCK_REGISTRY.default;
  const { default: Component } = await loader();
  return wrapper(<Component block={item} />);
}

/* ─── Résoudre le slug depuis section.type ────────────────────────── */
function resolveSlug(type) {
  if (!type) return null;
  if (typeof type === "object") return type.slug?.replace(/-/g, "_") ?? null;
  return String(type).replace(/-/g, "_");
}

/* ─── Layout flexible depuis section.type + section.cols ─────────── */
const GRID_COLS = {
  1: "grid grid-cols-1 gap-8",
  2: "grid grid-cols-1 md:grid-cols-2 gap-8",
  3: "grid grid-cols-1 md:grid-cols-3 gap-8",
  4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
};

function resolveLayoutClass(slug, cols) {
  if (!slug) return null;
  if (slug === "col")  return "flex flex-col gap-4";
  if (slug === "row")  return "flex flex-row flex-wrap gap-8";
  if (slug === "grid") return GRID_COLS[cols ?? 3] ?? GRID_COLS[3];
  return null;
}

/* ─── Mapping color_tone → classes Tailwind ──────────────────────── */
const TONE = {
  light: { bg: "bg-cl",   text: "text-t0" },
  muted: { bg: "bg-cd",   text: "text-t0" },
  dark:  { bg: "bg-noir", text: "text-tw" },
  navy:  { bg: "bg-navy", text: "text-tw" },
  sage:  { bg: "bg-sage", text: "text-tw" },
  gold:  { bg: "bg-gold", text: "text-tw" },
};

/* ─── SectionRenderer ────────────────────────────────────────────── *
 * Routing via section.type :
 *   slug connu dans Sections[]   → section component nommée
 *   col / row / grid             → layout flexible :
 *     section.blocks[]           → BlockRenderer (mode blocs, contrôle fin)
 *     section.case_studies[]     → CollectionRenderer (mode collection, rapide)
 *     section.team_members[]     → CollectionRenderer
 *     section.products[]         → CollectionRenderer
 *
 * section.cols (integer, défaut 3) : colonnes pour type "grid"
 * section.container (boolean, défaut true) :
 *   true  → max-w-6xl mx-auto px-6 py-20
 *   false → pleine largeur
 */
export default async function SectionRenderer({ section }) {
  if (!section) return null;

  const slug            = resolveSlug(section.type);
  const tone            = TONE[section.color_tone] ?? TONE.light;
  const layoutClass     = resolveLayoutClass(slug, section.cols);
  const SectionComponent = slug ? Sections[slug] : null;

  const isContainer  = section.container !== false;
  const containerCls = isContainer ? "max-w-6xl mx-auto w-full px-6 py-20" : "w-full";
  const outerCls     = `relative w-full m-0 p-0 ${tone.bg} ${tone.text}`;
  const toneName     = section.color_tone ?? "light";

  // ── Section nommée ──────────────────────────────────────────────
  if (SectionComponent) {
    return (
      <div id={section.slug ?? undefined} className={outerCls} data-tone={toneName} itemScope itemType="https://schema.org/CreativeWork" itemProp="mainEntityOfPage">
        <div className="relative z-10">
          {createElement(SectionComponent, {
            section,
            tone: section.color_tone ?? "light",
          })}
        </div>
      </div>
    );
  }

  // ── Layout flexible ─────────────────────────────────────────────
  if (layoutClass) {
    if (!section.blocks?.length) return null;

    return (
      <div className={outerCls} data-tone={toneName} itemScope itemType="https://schema.org/CreativeWork" itemProp="mainEntityOfPage">
        <div className="relative z-10">
          <section
            id={section.slug ?? undefined}
            aria-label={section.title ?? undefined}
            className={containerCls}>
            {(section.title || section.subtitle || section.description) && (
              <TitleSection
                title={section.title}
                subtitle={section.subtitle}
                description={section.description}
                tone={section.color_tone ?? "light"}
              />
            )}
            <div className={layoutClass}>
              {section.blocks.map((block, i) => (
                <BlockRenderer key={block?.id ?? i} block={block} />
              ))}
            </div>
            {section.cta?.length > 0 && (
              <SectionCta ctas={section.cta} tone={section.color_tone ?? "light"} />
            )}
          </section>
        </div>
      </div>
    );
  }

  return null;
}
