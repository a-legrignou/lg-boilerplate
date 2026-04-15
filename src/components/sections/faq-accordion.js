"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FaqAccordion({ blocks }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-0 border-t border-border">
      {blocks.map((block, index) => {
        const isOpen = openIndex === index;
        const question = block?.item?.title;
        const answer   = block?.item?.content;
        if (!question) return null;

        return (
          <div key={index} className="border-b border-border">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              className="w-full flex items-start justify-between gap-6 py-7 text-left group"
            >
              <span className={`text-base font-normal leading-snug transition-colors duration-300 ${isOpen ? "text-foreground" : "text-t0 group-hover:text-foreground"}`}>
                {question}
              </span>
              <span
                aria-hidden="true"
                className={`mt-0.5 shrink-0 w-7 h-7 border flex items-center justify-center transition-all duration-300 ${isOpen ? "border-navy bg-navy text-tw" : "border-border text-t2 group-hover:border-navy/40"}`}
              >
                {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </span>
            </button>

            {/* Toujours dans le DOM — grid-rows trick (SEO-safe) */}
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-btn-${index}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="text-t2 pb-7">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
