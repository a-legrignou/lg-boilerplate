import { cn } from "@/lib/utils/cn";
import { TITLE_COLOR, BODY_COLOR, BORDER_CLASS } from "@/styles/tones";

export default function Step({ block, number, tone = "muted" }) {
  const tags = block?.tags ?? [];

  return (
    <div className={cn("grid md:grid-cols-[80px_1fr_1fr] gap-8 py-10 border-t", BORDER_CLASS[tone])}>
      {/* Numéro */}
      <div className="font-serif text-5xl font-light leading-none text-navy/15 select-none">
        {number ?? block?.number}
      </div>

      {/* Titre + durée + corps */}
      <div className="flex flex-col gap-3">
        <h3 className={cn("font-serif text-xl leading-snug", TITLE_COLOR[tone])}>{block?.title}</h3>
        {block?.duration && (
          <p className="text-xs text-t2 tracking-wide uppercase">{block.duration}</p>
        )}
        {block?.description && (
          <p className={cn("text-sm leading-relaxed", BODY_COLOR[tone])}>{block.description}</p>
        )}
      </div>

      {/* Livrables depuis tags */}
      {tags.length > 0 && (
        <div className={cn("border-l pl-8", BORDER_CLASS[tone])}>
          <p className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-gold mb-2">Livrable</p>
          <ul className="flex flex-col gap-1.5">
            {tags.map((tag, i) => (
              <li key={i} className={cn("text-sm leading-relaxed", BODY_COLOR[tone])}>{tag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
