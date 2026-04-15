import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * TitlePage — en-tête de page (hors hero).
 * subtitle    → lettres capitales gold
 * title       → h1 serif
 * description → paragraphe
 * actions     → [{ label, href, variant? }] — CTA buttons
 */
export default function TitlePage({ subtitle, title, description, actions = [], className }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {subtitle && (
        <span className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-gold">
          {subtitle}
        </span>
      )}
      {title && (
        <h1 className="font-serif text-4xl sm:text-5xl text-t0 font-normal leading-tight max-w-2xl">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-t1 text-sm leading-relaxed max-w-lg">{description}</p>
      )}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-1">
          {actions.map((action, i) => (
            <Link
              key={i}
              href={action.href ?? "#"}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                (action.variant === "filled" || i > 0)
                  ? "bg-navy text-white hover:bg-navy/80"
                  : "border border-navy text-navy hover:bg-navy hover:text-white",
              )}>
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
