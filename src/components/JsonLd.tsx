import type { JsonLd as JsonLdType } from "@/lib/structured-data";

/**
 * Émet un (ou plusieurs) <script type="application/ld+json"> server-rendered.
 *
 * Note: React 19 affiche un warning dev-mode "Encountered a script tag" pour ce pattern.
 * C'est un faux positif — JSON-LD est de la donnée, pas du code à exécuter ; Google le lit
 * dans le HTML initial et le warning n'apparaît pas en build prod. Voir CLAUDE.md.
 */
export function JsonLd({ data }: { data: JsonLdType | JsonLdType[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
