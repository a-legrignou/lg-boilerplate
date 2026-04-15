import SmartLink from "@/components/ui/smart-link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import TitleSection from "../widgets/title-section";

/**
 * final_cta — Call-to-action de fin de page.
 * Le fond est géré par le renderer (color_tone).
 * Le prop `tone` permet d'adapter les couleurs du texte et des boutons.
 */
export default function FinalCta({ section, tone = "dark" }) {
  const isDark = tone === "dark" || tone === "navy";
  const ctas = section?.cta ?? [];

  return (
    <section className="w-full py-24 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
        <TitleSection
          subtitle={section?.subtitle}
          title={section?.title}
          description={section?.description}
          center={true}
          isDark={isDark}
          tone=""
        />

        {ctas.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            {ctas.map((cta, i) => (
              <SmartLink
                key={i}
                href={cta.path}
                className={cn(
                  "inline-flex items-center gap-2 px-7 py-3 font-medium text-sm transition-all duration-300",
                  i === 0
                    ? "bg-gold text-noir hover:bg-gold/90"
                    : isDark
                      ? "border border-tw/30 text-tw hover:border-tw hover:bg-tw/5"
                      : "border border-border-dk text-t0 hover:border-navy hover:bg-navy/5",
                )}>
                {cta.label}
                {i === 0 && <ArrowRight size={15} aria-hidden />}
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
