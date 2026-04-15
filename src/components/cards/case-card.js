import CardBase from "./card-base";
import { sectorLabel, sizeLabel } from "@/lib/utils/case-labels";

/* ─── CaseCard ──────────────────────────────────────────────────────
 * Normalise les données d'une référence (case_study) et délègue
 * le rendu visuel à CardBase.
 *
 * Modes :
 *   - Navigation  : block.slug présent → href = /references/slug
 *   - Dialog/CTA  : onClick fourni → carte entièrement cliquable
 * ──────────────────────────────────────────────────────────────── */

export default function CaseCard({ block, onClick, imageBadge }) {
  const href = !onClick && (block?.href ?? (block?.slug ? `/references/${block.slug}` : null));
  const eyebrow = sectorLabel(block?.client_sector) ?? block?.eyebrow ?? null;
  const footerLabel = sizeLabel(block?.client_size) ?? null;
  const ctaLabel = block?.cta_label ?? (onClick ? "Découvrir" : "Lire");
  const tags = block?.tags ?? block?.keywords ?? null;

  return (
    <CardBase
      image={block?.image}
      href={href}
      title={block?.title}
      description={block?.description}
      eyebrow={eyebrow}
      footerLabel={footerLabel}
      ctaLabel={ctaLabel}
      imageBadge={imageBadge}
      tags={tags}
      onClick={onClick}
    />
  );
}
