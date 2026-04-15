"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import TitleSection from "@/components/widgets/title-section";

/**
 * pillars — Accordeon graphique compact, ferre a gauche.
 *
 * Directus :
 *   section.type       = "pillars"
 *   section.blocks[]   = { item: { title, subtitle, content } }
 *
 * title    = titre principal (gras)
 * subtitle = label de domaine (gold, uppercase)
 * content  = detail deploye au clic
 */
export default function Strengths({ section, tone = "muted" }) {
  const [openIndex, setOpenIndex] = useState(null);
  const blocks = section?.blocks ?? [];

  return (
    <section className="relative px-6 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto">
        <TitleSection
          title={section?.title}
          subtitle={section?.subtitle}
          description={section?.description}
          tone={tone}
        />

        <div className="border-t border-border">
          {blocks.map((block, i) => {
            const isOpen = openIndex === i;
            const title = block?.item?.title;
            const subtitle = block?.item?.subtitle;
            const content = block?.item?.content;
            if (!title) return null;

            return (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center gap-6 py-5 text-left group transition-all duration-300 ${!isOpen ? "hover:bg-cd/60 hover:pl-2" : ""}`}>
                  {/* Numero */}
                  <span
                    className={`font-serif text-2xl leading-none select-none shrink-0 w-8 transition-all duration-300 ${isOpen ? "text-gold scale-110" : "text-gold/40 group-hover:text-gold"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Barre gold animee */}
                  <span
                    className={`self-stretch shrink-0 transition-all duration-300 ${isOpen ? "w-1 bg-gold" : "w-px bg-border group-hover:w-1 group-hover:bg-gold"}`}
                    aria-hidden
                  />

                  {/* Titre + subtitle */}
                  <div className="flex-1 min-w-0">
                    {subtitle && (
                      <span
                        className={`block text-[0.8rem] font-semibold tracking-[0.2em] uppercase mb-1 transition-colors duration-300 ${isOpen ? "text-gold" : "text-gold/50 group-hover:text-gold"}`}>
                        {subtitle}
                      </span>
                    )}
                    <span
                      className={`block font-medium leading-snug transition-colors duration-300 ${isOpen ? "text-t0" : "text-t2 group-hover:text-t0"}`}>
                      {title}
                    </span>
                  </div>

                  {/* Toggle */}
                  <span
                    aria-hidden
                    className={`shrink-0 w-7 h-7 flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-gold text-noir" : "text-t2/50 group-hover:bg-gold group-hover:text-noir"}`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {/* Contenu deploye */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="text-sm text-t2 leading-relaxed pl-[3.75rem] pb-6 max-w-2xl">{content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
