import { cn } from "@/lib/utils/cn";
import { TITLE_COLOR, BODY_COLOR, BORDER_CLASS } from "@/styles/tones";
import TitleSection from "@/components/widgets/title-section";
import Markdown from "@/components/ui/markdown";

/**
 * statement — Section editoriale graphique pour message fort + liste de preuves.
 *
 * Layout : titre centre en haut, grille 7/5 avec accents graphiques.
 *
 * Directus :
 *   section.type       = "statement"
 *   section.subtitle   = eyebrow
 *   section.title      = message principal
 *   section.description = baseline (markdown)
 *   section.blocks     = mix de paragraph + list
 *   section.color_tone = tone
 */
export default function Statement({ section, tone = "light" }) {
  const isDark = tone === "dark" || tone === "navy";
  const blocks = section?.blocks?.map((b) => b?.item).filter(Boolean) ?? [];

  const paragraphs = blocks.filter((b) => b.type === "paragraph" || b.content);
  const lists = blocks.filter((b) => b.type === "list" || (b.tags?.length > 0 && !b.content));

  return (
    <section className="relative w-full px-6 py-20 lg:py-28 overflow-hidden">

      {/* ── Fond graphique ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Filets haut/bas */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />

        {/* Lignes verticales subtiles */}
        <div className="absolute top-0 left-[10%] w-px h-full bg-linear-to-b from-transparent via-gold/6 to-transparent hidden lg:block" />
        <div className="absolute top-0 right-[10%] w-px h-full bg-linear-to-b from-transparent via-gold/6 to-transparent hidden lg:block" />

        {/* Losange decoratif haut-droite */}
        <div className="absolute -top-12 -right-12 w-48 h-48 border border-gold/7 rotate-45 hidden lg:block" />
        <div className="absolute -top-8 -right-8 w-48 h-48 border border-gold/4 rotate-45 hidden lg:block" />

        {/* Cercle decoratif bas-gauche */}
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full border border-gold/5 hidden lg:block" />
      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* ── Titre centre ── */}
        <TitleSection
          subtitle={section?.subtitle}
          title={section?.title}
          description={section?.description}
          tone={tone}
          center
        />

        {/* ── Grille contenu ── */}
        {(paragraphs.length > 0 || lists.length > 0) && (
          <div className={cn(
            "grid grid-cols-1 gap-10",
            lists.length > 0 ? "lg:grid-cols-12 lg:gap-16" : "max-w-3xl mx-auto",
          )}>

            {/* Paragraphes — gauche */}
            {paragraphs.length > 0 && (
              <div className={cn("space-y-8", lists.length > 0 ? "lg:col-span-7" : "")}>
                {paragraphs.map((block, i) => (
                  <div key={i} className={cn(
                    "relative space-y-3 pl-6",
                    i === 0 && "before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-linear-to-b before:from-gold/40 before:via-gold/15 before:to-transparent",
                  )}>
                    {block.subtitle && (
                      <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-gold">
                        {block.subtitle}
                      </span>
                    )}
                    {block.title && (
                      <h3 className={cn("font-serif text-xl leading-snug", TITLE_COLOR[tone])}>
                        {block.title}
                      </h3>
                    )}
                    {block.content && (
                      <div className={cn("prose prose-sm max-w-none leading-relaxed", BODY_COLOR[tone])}>
                        <Markdown content={block.content} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Listes — droite avec filet + numerotation */}
            {lists.length > 0 && (
              <div className={cn("lg:col-span-5 lg:border-l lg:pl-10", BORDER_CLASS[tone])}>
                {lists.map((block, i) => (
                  <div key={i} className="space-y-5">
                    {block.subtitle && (
                      <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-gold">
                        {block.subtitle}
                      </span>
                    )}
                    {block.title && (
                      <p className={cn("text-[0.65rem] font-medium tracking-[0.2em] uppercase", BODY_COLOR[tone])}>
                        {block.title}
                      </p>
                    )}
                    {(block.tags ?? []).length > 0 && (
                      <ul className="space-y-4">
                        {block.tags.map((item, j) => (
                          <li key={j} className="flex items-start gap-4">
                            <span className="font-serif text-lg text-gold/25 leading-none mt-px select-none shrink-0">
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <span className={cn("text-sm leading-relaxed", BODY_COLOR[tone])}>
                              {item?.value ?? item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
