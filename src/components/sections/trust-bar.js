import Kpi from "@/components/blocks/kpi";

/**
 * trust_bar — ligne de KPIs centrés, sans titre de section.
 * Utilise les blocs de la section (type kpi attendu).
 */
export default function TrustBar({ section }) {
  const blocks = section?.blocks ?? [];
  if (!blocks.length) return null;

  return (
    <section
     
      aria-label={section?.title ?? "Indicateurs clés"}
      className="max-w-7xl mx-auto w-full px-6 py-16">
      <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
        {blocks.map((block, i) => (
          <div key={block?.id ?? i} className="flex flex-col items-center text-center min-w-32">
            <Kpi block={block} />
          </div>
        ))}
      </div>
    </section>
  );
}
