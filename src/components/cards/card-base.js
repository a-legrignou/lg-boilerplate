import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GenericImage from "../widgets/generic-image";

const assetBase = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "";

/* ─── Sous-composants ─────────────────────────────────────────────── */

function CardMedia({ src, alt = "" }) {
  if (!src) return null;
  return (
    <div className="relative aspect-video overflow-hidden">
      <GenericImage
        src={src}
        alt={alt}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale-20 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-linear-to-t from-noir/60 to-transparent" />
    </div>
  );
}

function CardTags({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="text-[0.6rem] tracking-widest uppercase px-2 py-0.5 bg-sage-14 text-sage border border-sage/20">
          {tag}
        </span>
      ))}
    </div>
  );
}

/* ─── CardBase ──────────────────────────────────────────────────────
 * Template visuel partagé entre CaseCard et ModuleCard.
 * Props :
 *   image       — UUID string ou objet { id }
 *   href        — URL de navigation (optionnel)
 *   title       — Titre de la carte
 *   description — Texte court (2 lignes max)
 *   eyebrow     — Label au-dessus du titre (ex: secteur)
 *   footerLabel — Label pied de carte gauche (ex: taille client, axe)
 *   ctaLabel    — Texte du bouton CTA (défaut : "Lire")
 *   imageBadge  — Nœud React affiché en bas de l'image
 *   tags        — Tableau de strings affiché sous la description
 *   onClick     — Handler pour le mode dialog (désactive href)
 * ──────────────────────────────────────────────────────────────── */

export default function CardBase({ image, href, title, description, eyebrow, footerLabel, ctaLabel = "Lire", imageBadge, tags, onClick }) {
  const imageId = image?.id ?? image;
  const imgSrc = imageId ? `${assetBase}${imageId}` : null;

  const rootProps = onClick
    ? {
        onClick,
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        },
      }
    : {};

  return (
    <div
      {...rootProps}
      className={`group h-full flex flex-col card-surface border hover:shadow-lg hover:shadow-navy/5 transition-all duration-500 overflow-hidden${onClick ? " cursor-pointer" : ""}`}>
      {/* Image */}
      <div className="relative">
        {href ? (
          <Link href={href} tabIndex={-1} aria-hidden="true">
            <CardMedia src={imgSrc} alt={title ?? ""} />
          </Link>
        ) : (
          <CardMedia src={imgSrc} alt={title ?? ""} />
        )}
        {imageBadge && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">{imageBadge}</div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Eyebrow */}
        {eyebrow && <span className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-gold">{eyebrow}</span>}

        {/* Titre */}
        {href ? (
          <Link href={href}>
            <h3 className="font-serif text-xl text-t0 leading-snug transition-colors duration-300">
              {title}
            </h3>
          </Link>
        ) : (
          <h3 className="font-serif text-xl text-t0 leading-snug transition-colors duration-300">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && <p className="text-sm text-t2 leading-relaxed line-clamp-2">{description}</p>}

        <CardTags tags={tags} />

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs text-t2 uppercase tracking-wide">
            {footerLabel}
          </span>
          <div className="flex items-center gap-3">
            {href ? (
              <Link
                href={href}
                className="card-cta inline-flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {ctaLabel}
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            ) : (
              <span className="card-cta inline-flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {ctaLabel}
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
