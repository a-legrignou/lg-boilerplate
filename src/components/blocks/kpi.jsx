/**
 * kpi — indicateur chiffré.
 *
 * Champs Directus :
 *   title       string   — valeur principale (ex: "98%", "+40")
 *   subtitle    string   — étiquette dorée au-dessus (optionnel)
 *   description string   — texte explicatif sous la valeur (optionnel)
 */
export default function Kpi({ block }) {
  const { title, subtitle, description } = block.item ?? {};

  return (
    <div className="py-6 flex flex-col gap-2">
      {title && <span className="font-serif text-5xl font-medium text-gold leading-none">{block.item.title}</span>}
      {subtitle && <span className=" text-sm  uppercase text-tw">{block.item.subtitle}</span>}
      {description && <p className="text-sm text-t2 leading-relaxed mt-1">{block.item.description}</p>}
    </div>
  );
}
