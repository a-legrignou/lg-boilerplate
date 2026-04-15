import SmartLink from "@/components/ui/smart-link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import GenericImage from "@/components/widgets/generic-image";
import TitleSection from "@/components/widgets/title-section";
import { assetUrl } from "@/lib/utils/assets";
import Markdown from "@/components/ui/markdown";

/**
 * spotlight — Mise en avant premium d'un produit phare.
 *
 * Donnees pilotees par le produit (via section.blocks).
 * La section ne sert qu'a pointer vers le produit et configurer le tone.
 *
 * Directus :
 *   section.type       = "spotlight"
 *   section.color_tone = "navy" (optionnel)
 *   section.subtitle   = eyebrow (optionnel, ex: "Produit phare")
 *   section.blocks     = [{ collection: "products", item: <product_id> }]
 *
 * Schema.org : itemtype Service pour le referencement.
 */
export default function Spotlight({ section, tone = "navy" }) {
  const isDark = tone === "dark" || tone === "navy";
  const product = section?.blocks?.map((b) => b?.item)?.find((item) => item?.slug);
  if (!product) return null;

  const imgSrc = assetUrl(product.image?.id ?? product.image, null);
  const benefits = Array.isArray(product.benefits) ? product.benefits.filter(Boolean) : [];

  return (
    <section
      className="relative w-full overflow-hidden"
      itemScope
      itemType="https://schema.org/Service">
      <meta itemProp="name" content={product.title} />
      {product.description && <meta itemProp="description" content={product.description} />}

      <div className="max-w-7xl mx-auto px-6 py-24 sm:py-28 lg:py-36">
        <div className={cn("grid grid-cols-1 gap-16 lg:gap-20", imgSrc ? "lg:grid-cols-2 items-stretch" : "max-w-3xl")}>
          {/* ── Image (gauche desktop — s'etire sur toute la hauteur du contenu) ── */}
          {imgSrc && (
            <div className="relative" itemProp="image">
              <div className="absolute -inset-6 rounded-2xl bg-gold/4 blur-3xl pointer-events-none" aria-hidden />
              <div
                className="absolute -right-px top-8 bottom-8 w-px bg-linear-to-b from-transparent via-gold/30 to-transparent hidden lg:block"
                aria-hidden
              />
              <div className="relative h-full min-h-80 overflow-hidden ring-1 ring-white/6">
                <GenericImage
                  src={imgSrc}
                  alt={product.title ?? ""}
                  className="object-cover absolute inset-0 w-full h-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0 bg-linear-to-t from-navy/25 via-transparent to-transparent pointer-events-none"
                  aria-hidden
                />
              </div>
            </div>
          )}

          {/* ── Contenu ── */}
          <div className="flex flex-col">
            <TitleSection
              subtitle={section?.subtitle}
              title={product.title}
              description={product.description}
              tone={tone}
            />

            {/* Excerpt */}
            {product.excerpt && (
              <div className={cn("text-sm leading-relaxed max-w-xl pb-6", !isDark ? "text-t1" : "text-tw/90")}>
                <Markdown content={product.excerpt} />
              </div>
            )}

            {/* Benefits — 2-col micro-grid */}
            {benefits.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mb-10" role="list" aria-label="Benefices">
                {benefits.slice(0, 4).map((b, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className={cn(" pl-4 border-l border-gold ", isDark ? "text-tw/50" : "text-t1")}>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTA duo */}
            <div className="flex flex-wrap items-center gap-4">
              <SmartLink
                href="/fr/contact"
                className={cn(
                  "group inline-flex items-center gap-2.5 px-8 py-3.5",
                  "bg-gold text-noir text-sm font-medium tracking-wide",
                  "hover:bg-gold/85 active:scale-[0.98]",
                  "transition-all duration-300",
                )}>
                Être contacté
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </SmartLink>
              <SmartLink
                href={`/fr/proposal/${product.slug}`}
                className={cn(
                  "group inline-flex items-center gap-2.5 px-8 py-3.5",
                  "text-sm font-medium tracking-wide",
                  "transition-all duration-300",
                  isDark
                    ? "border border-tw/15 text-tw/70 hover:border-gold/40 hover:text-gold"
                    : "border border-border text-t1 hover:border-navy hover:text-navy",
                )}>
                En savoir plus
                <ArrowRight
                  size={14}
                  className="-translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                  aria-hidden
                />
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
