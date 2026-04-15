import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * list — Threat-assessment style cards.
 *
 * Champs Directus :
 *   title       string     — titre
 *   subtitle    string     — eyebrow gold (optionnel)
 *   tags        string[]   — elements
 */

const COLS = { 2: "md:grid-cols-2", 3: "md:grid-cols-3" };

function getCols(n) {
  if (n >= 4) return "md:grid-cols-2 lg:grid-cols-3";
  return COLS[n] ?? "";
}

export default function List({ block }) {
  const { title, subtitle, tags: items } = block ?? {};
  const list = items ?? [];

  return (
    <div className="py-6 space-y-6">
      {subtitle && (
        <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-gold">{subtitle}</span>
      )}
      {title && (
        <p className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-t2 mb-3">{title}</p>
      )}

      {list.length > 0 && (
        <ul className={cn("grid grid-cols-1 gap-5", getCols(list.length))}>
          {list.map((item, i) => (
            <li
              key={i}
              className="group relative bg-cd dark:bg-white/3 overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(198,169,92,0.12)] hover:-translate-y-0.5"
            >
              {/* Top severity bar */}
              <div className="h-0.5 bg-linear-to-r from-gold/40 via-gold/20 to-transparent group-hover:from-gold group-hover:via-gold/60 group-hover:to-gold/20 transition-all duration-500" aria-hidden />

              {/* Scan line on hover */}
              <div className="absolute inset-0 bg-linear-to-r from-gold/0 via-gold/5 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" aria-hidden />

              <div className="relative px-7 pt-7 pb-8">
                {/* Header: number + indicator */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-serif text-5xl font-light text-navy/10 dark:text-white/8 leading-none select-none tracking-tight group-hover:text-gold/25 transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/30 group-hover:bg-gold group-hover:shadow-[0_0_8px_rgba(198,169,92,0.6)] transition-all duration-500" aria-hidden />
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-t1 leading-relaxed group-hover:text-t0 transition-colors duration-300">
                  {item?.value ?? item}
                </p>

                {/* Footer action hint */}
                <div className="mt-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-[0.6rem] font-medium tracking-[0.15em] uppercase text-gold/60">Voir</span>
                  <ChevronRight size={12} className="text-gold/40" strokeWidth={2} aria-hidden />
                </div>
              </div>

              {/* Left accent */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gold/10 group-hover:bg-gold/30 transition-colors duration-500" aria-hidden />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
