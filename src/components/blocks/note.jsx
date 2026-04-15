import Markdown from "@/components/ui/markdown";

/**
 * note — paragraphe secondaire avec séparateur au-dessus.
 * Typiquement : bio, mention légale, source, aparté.
 *
 * Champs Directus :
 *   content     text (markdown)  — texte de la note
 *   title       string           — titre optionnel (rare)
 */
export default function Note({ block }) {
  const { title, content } = block ?? {};

  return (
    <div className="pt-10 mt-6 border-t border-border max-w-2xl">
      {title && <p className="text-[0.65rem] font-medium tracking-[0.2em] uppercase text-t2 mb-3">{title}</p>}
      {content && (
        <div className="prose prose-neutral max-w-none text-sm text-t2 leading-relaxed font-light">
          <Markdown content={content} />
        </div>
      )}
    </div>
  );
}
