import SmartLink from "@/components/ui/smart-link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * cta — Bloc call-to-action inline.
 *
 * Champs Directus :
 *   title    string        — accroche (optionnel)
 *   content  string        — texte secondaire (optionnel)
 *   cta      { label, path }[]  — boutons
 */
export default function Cta({ block, tone = "light" }) {
  const isDark = tone === "dark" || tone === "navy";
  const ctas = block?.cta ?? [];
  if (ctas.length === 0) return null;

  return (
    <div className={cn(
      "py-8 mt-4 border-t",
      isDark ? "border-tw/10" : "border-border",
    )}>
      {block?.title && (
        <h3 className={cn("font-serif text-xl mb-2", isDark ? "text-tw" : "text-t0")}>
          {block.title}
        </h3>
      )}
      {block?.content && (
        <p className={cn("text-sm mb-6", isDark ? "text-tw/50" : "text-t2")}>
          {block.content}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        {ctas.map((cta, i) => (
          <SmartLink
            key={i}
            href={cta.path}
            className={cn(
              "group inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-medium tracking-wide transition-all duration-300",
              i === 0
                ? "bg-gold text-noir hover:bg-gold/85"
                : isDark
                  ? "border border-tw/15 text-tw/70 hover:border-gold/40 hover:text-gold"
                  : "border border-border text-t1 hover:border-navy hover:text-navy",
            )}>
            {cta.label}
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </SmartLink>
        ))}
      </div>
    </div>
  );
}
