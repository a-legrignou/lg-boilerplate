import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DynamicIcon } from "../widgets/dynamic-icons";
import GenericImage from "../widgets/generic-image";

/* ─── Sous-composants ────────────────────────────────────────────── */

function CardMedia({ src, alt = "", icon, sizes = "(min-width: 768px) 50vw, 100vw", aspect = "aspect-video" }) {
  if (!src) return null;
  return (
    <div className={`relative ${aspect} overflow-hidden`}>
      <GenericImage
        src={src}
        alt={alt}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale-30 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-navy/30" />
      {icon && (
        <div className="absolute bottom-4 left-6">
          <div className="w-12 h-12 border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <DynamicIcon name={icon} className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
        </div>
      )}
    </div>
  );
}

function CardIcon({ icon }) {
  if (!icon) return null;
  return (
    <div className="w-12 h-12 bg-white border border-border flex items-center justify-center mb-6 group-hover:border-navy/30 transition-colors duration-300">
      <DynamicIcon
        name={icon}
        className="w-6 h-6 text-noir group-hover:text-navy transition-colors duration-300"
        strokeWidth={1.5}
      />
    </div>
  );
}

function CardKeywords({ keywords }) {
  if (!keywords?.length) return null;
  return (
    <ul className="space-y-3 mb-8">
      {keywords.map((kw, i) => (
        <li key={i} className="flex items-center gap-3 text-[var(--card-text,theme(colors.t2))] text-sm">
          <div className="w-1 h-4 bg-navy/30 group-hover:bg-navy/60 transition-colors duration-300 shrink-0" />
          {kw}
        </li>
      ))}
    </ul>
  );
}

function CardCta({ path, label }) {
  if (!path) return null;
  return (
    <Link
      href={path}
      className="inline-flex items-center gap-2 text-[var(--card-text,theme(colors.t1))] text-sm font-medium group-hover:gap-4 transition-all duration-300">
      {label || "En savoir plus"}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </Link>
  );
}

/* ─── AreaCard ───────────────────────────────────────────────────── */

export default function AreaCard({ block }) {
  const assetBase = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "";
  const imageId = block?.image?.id ?? block?.image;
  const imgSrc = imageId ? `${assetBase}${imageId}` : null;

  return (
    <div className="group relative h-full card-surface border hover:border-gold/40 hover:shadow-lg hover:shadow-navy/5 transition-all duration-500 overflow-hidden">
      <CardMedia src={imgSrc} alt={block?.title || block?.subtitle || ""} icon={block?.icon} />

      <div className="p-10">
        {/* Icone standalone (sans image) */}
        {!imgSrc && <CardIcon icon={block?.icon} />}

        {/* Subtitle gold (KPI, label) */}
        {block?.subtitle && (
          <span className="text-xs font-medium tracking-[0.14em] uppercase text-gold block mb-3">{block.subtitle}</span>
        )}
        {/* Titre — herite la couleur du tone parent via card-surface */}
        {block?.title && (
          <h3 className="font-serif text-2xl mb-4 text-[var(--card-title,theme(colors.t0))]">{block.title}</h3>
        )}
        {block?.description && (
          <p className="text-[var(--card-text,theme(colors.t2))] leading-relaxed">{block.description}</p>
        )}
        <CardKeywords keywords={block?.keywords} />
        <CardCta path={block?.cta?.[0]?.path} label={block?.cta?.[0]?.label} />
      </div>
    </div>
  );
}
