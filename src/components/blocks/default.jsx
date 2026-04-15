import Markdown from "@/components/ui/markdown";

/**
 * default — rendu générique pour les blocs sans type spécifique.
 * Affiche : titre, sous-titre, description (Markdown).
 */
export default function Default({ block }) {
  return (
    <div className="py-4 space-y-3">
      {block?.subtitle && (
        <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-gold">
          {block.subtitle}
        </span>
      )}
      {block?.title && (
        <h3 className="font-serif text-xl text-t0 leading-snug">{block.title}</h3>
      )}
      {block?.description && (
        <div className="prose prose-neutral max-w-none text-t1 text-sm">
          <Markdown content={block.description} />
        </div>
      )}
    </div>
  );
}
