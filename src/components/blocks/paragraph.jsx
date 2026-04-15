import Markdown from "@/components/ui/markdown";

/**
 * paragraph — corps de texte riche (Markdown).
 *
 * Champs Directus :
 *   content     text (markdown)  — contenu principal
 *   title       string           — titre optionnel
 *   subtitle    string           — étiquette gold au-dessus (optionnel)
 *
 * Dans le markdown, le **gras** est rendu en gold via la config Markdown.
 */
export default function Paragraph({ block }) {
  const { title, subtitle, content } = block ?? {};

  return (
    <div className="py-4 space-y-4 max-w-3xl">
      {subtitle && (
        <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-gold">{subtitle}</span>
      )}
      {title && <h3 className="font-serif text-xl text-t0 leading-snug">{title}</h3>}
      {content && (
        <div className="prose prose-neutral max-w-none text-t1 leading-relaxed">
          <Markdown content={content} />
        </div>
      )}
    </div>
  );
}
