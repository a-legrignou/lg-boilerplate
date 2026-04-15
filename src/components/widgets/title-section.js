import { cn } from "@/lib/utils/cn";
import { TITLE_COLOR, BODY_COLOR } from "@/styles/tones";
import Markdown from "@/components/ui/markdown";

/**
 * TitleSection — eyebrow doré + h2 + corps optionnel.
 * Props obligatoires : eyebrow, title.
 */

export default function TitleSection({ subtitle, title, description, tone = "light", center = false, className }) {
  return (
    <div className={cn("mb-12", center && "text-center", className)}>
      {subtitle && (
        <div
          className={cn(
            "inline-flex items-center gap-2.25 mb-4",
            "font-sans text-sm font-medium tracking-wider uppercase text-gold",
          )}>
          {!center && <span className="w-4 h-px bg-gold shrink-0" aria-hidden />}
          {subtitle}
        </div>
      )}
      <h2 className={cn("mb-4", TITLE_COLOR[tone], !center && "max-w-180")}>{title}</h2>
      {description && (
        <div className={cn("max-w-none [&_p]:leading-relaxed", BODY_COLOR[tone], !center && "max-w-160")}>
          <Markdown content={description} />
        </div>
      )}
    </div>
  );
}
