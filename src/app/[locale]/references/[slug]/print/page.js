import { getCachedCaseBySlug, getCachedSiteSettings } from "@/lib/models";
import { notFound } from "next/navigation";
import GenericImage from "@/components/widgets/generic-image";
import Markdown from "@/components/ui/markdown";
import { sectorLabel, sizeLabel } from "@/lib/utils/case-labels";

const assetBase = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "";

/* ─── Styles minimaux — uniquement ce que Tailwind ne peut pas faire ── */
const PRINT_STYLES = `
  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    @page { size: A4 portrait; margin: 0; }
  }
  /* Prose markdown dans les cartes (pseudo-elements, héritage forcé) */
  .pc, .pc p, .pc li { font-size: 12.5px; line-height: 1.7; color: var(--color-t1); font-family: var(--font-sans); margin: 0; }
  .pc p { margin-bottom: 5px; }
  .pc p:last-child { margin-bottom: 0; }
  .pc ul, .pc ol { padding: 0; margin: 5px 0; list-style: none; }
  .pc li { position: relative; padding-left: 16px; margin-bottom: 3px; }
  .pc li::before { content: ''; position: absolute; left: 2px; top: 8px; width: 4px; height: 4px; background: var(--color-gold); border-radius: 50%; }
  .pc h2, .pc h3 { font-family: var(--font-serif); font-size: 15px; line-height: 1.35; font-weight: 500; color: var(--color-navy); margin: 8px 0 4px; }
  .pc strong { font-weight: 600; color: var(--color-navy); }
`;

export default async function CasePrintPage({ params }) {
  const { slug } = await params;
  const [settings, study] = await Promise.all([getCachedSiteSettings(), getCachedCaseBySlug(slug)]);

  if (!study) notFound();

  const imageId = study.image?.id ?? study.image;
  const imgSrc = imageId ? `${assetBase}${imageId}` : null;
  const siteName = settings?.site_name ?? "";
  const sector = sectorLabel(study.client_sector);
  const size = sizeLabel(study.client_size);
  const meta = [sector, size].filter(Boolean).join(" · ");

  const goFurther = study.sections?.find((s) => s.key === "go_further");
  const hasPage2 = !!(study.conclusion || goFurther);
  const totalPages = hasPage2 ? 2 : 1;

  const sections = [
    {
      key: "context",
      label: "Contexte",
      heading: study.context_heading,
      description: study.context_description,
      takeways: study.context_takeways,
    },
    {
      key: "challenge",
      label: "Challenge",
      heading: study.challenge_heading,
      description: study.challenge_description,
      takeways: study.challenge_takeways,
    },
    {
      key: "approach",
      label: "Approche",
      heading: study.approach_heading,
      description: study.approach_description,
      takeways: study.approach_takeways,
    },
    {
      key: "results",
      label: "Résultats",
      heading: study.results_heading,
      description: study.results_description,
      takeways: study.results_takeways,
    },
  ];

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <script
        dangerouslySetInnerHTML={{
          __html: "document.fonts.ready.then(function(){ setTimeout(function(){ window.print(); }, 200); });",
        }}
      />

      {/* ══════════ PAGE 1 ══════════ */}
      <div className="w-310 h-438.5 overflow-hidden flex flex-col bg-muteds">
        {/* ── Couverture ── */}
        <header className="shrink-0 h-110 relative overflow-hidden bg-navy">
          {imgSrc && (
            <div className="absolute inset-0 opacity-[0.08]">
              <GenericImage src={imgSrc} alt={study.title} className="object-cover w-full h-full" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-br from-navy to-[#243548]" />
          <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-linear-to-r from-gold via-gold/30 to-transparent" />
          {/* Ligne verticale déco */}
          <div className="absolute top-0 left-20 bottom-0 w-px bg-gold/10" />

          <div className="relative z-10 h-full px-20 py-11 flex flex-col justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3.5">
              <span className="font-sans font-semibold text-[10px] tracking-[0.32em] uppercase text-gold">
                {siteName}
              </span>
              <span className="inline-block w-7.5 h-px bg-gold/20" />
              <span className="font-sans text-[9.5px] tracking-[0.2em] uppercase text-white/30">Étude de cas</span>
            </div>

            {/* Titre principal */}
            <div className="flex flex-col gap-2.5 max-w-180">
              {meta && (
                <span className="font-sans font-medium text-[10px] tracking-[0.22em] uppercase text-gold/85">
                  {meta}
                </span>
              )}
              <h1 className="font-serif font-medium text-[48px] leading-[1.08] text-white tracking-[-0.01em]">
                {study.title}
              </h1>
              <div className="w-9 h-px bg-gold" />
            </div>

            {/* Tags */}
            {study.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {study.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="py-1 px-3.5 border border-gold/25 font-sans text-[9px] tracking-[0.16em] uppercase text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── KPI strip ── */}
        {study.kpi?.length > 0 && (
          <div className="shrink-0 flex gap-10 h-19.5 border border-border mx-20 my-4">
            {study.kpi.map((k, i) => (
              <div
                key={i}
                className={`flex-1 flex flex-col justify-center items-start px-8 gap-2 ${i > 0 ? " border-l border-border" : ""}`}>
                <span className="font-serif font-medium text-[28px] leading-none text-gold">{k.value ?? k.title}</span>
                <span className="font-sans  text-[8px] leading-none tracking-[0.22em] uppercase text-t2">
                  {k.label ?? k.subtitle}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Grille 2×2 - cartes ── */}
        <div className="flex-1 grid grid-cols-2  gap-8 py-6 px-20 overflow-hidden">
          {sections.map((s) => (
            <article key={s.key} className="flex flex-col gap-2  border border-border p-6">
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-block w-5.5 h-px bg-gold shrink-0" />
                <span className="font-sans font-semibold text-[8.5px] tracking-[0.24em] uppercase text-gold">
                  {s.label}
                </span>
              </div>
              {s.heading && (
                <h3 className="font-serif font-medium leading-[1.3] text-navy shrink-0 mb-2">{s.heading}</h3>
              )}
              {s.description && (
                <div className="pc flex-1">
                  <Markdown content={s.description} />
                </div>
              )}
              {s.takeways?.length > 0 && (
                <ul className="list-none overflow-hidden flex-1 mt-6">
                  {s.takeways.map((t, i) => (
                    <li key={i} className="text-[12px] leading-[1.65] text-t1 pl-3 border-l-2 border-gold mb-2">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="shrink-0 h-9.5 px-20 flex items-center justify-between border-t border-border font-sans text-[9px] leading-none tracking-[0.12em] uppercase text-t2">
          <span>{siteName} · Confidentiel</span>
          <span>1 / {totalPages}</span>
        </footer>
      </div>

      {/* ══════════ PAGE 2 (optionnelle) ══════════ */}
      {hasPage2 && (
        <div className="w-310 h-438.5 overflow-hidden flex flex-col bg-white">
          {/* Header */}
          <div className="shrink-0 h-14 px-20 flex items-center gap-3.5 border-b border-border">
            <span className="font-sans font-semibold text-[10px] tracking-[0.32em] uppercase text-gold">
              {siteName}
            </span>
            <span className="inline-block w-7.5 h-px bg-gold/20" />
            <span className="font-serif italic text-[13px] leading-none text-t2">{study.title}</span>
          </div>

          {/* Contenu */}
          <div className="flex-1 px-20 py-14 flex flex-col gap-12 overflow-hidden">
            {study.conclusion && (
              <blockquote className="shrink-0 py-8 px-11 border-l-[3px] border-gold bg-[#f9fafb]">
                <p className="font-serif italic text-[21px] leading-[1.65] text-navy">{study.conclusion}</p>
              </blockquote>
            )}
            {goFurther && (
              <section className="flex flex-col gap-3 overflow-hidden flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-5.5 h-px bg-gold shrink-0" />
                  <span className="font-sans font-semibold text-[8.5px] tracking-[0.24em] uppercase text-gold">
                    Aller plus loin
                  </span>
                </div>
                {goFurther.heading && (
                  <p className="font-serif font-medium text-[22px] leading-[1.3] text-navy">{goFurther.heading}</p>
                )}
                {goFurther.description && (
                  <div className="pc overflow-hidden flex-1">
                    <Markdown content={goFurther.description} />
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Footer */}
          <footer className="shrink-0 h-9.5 px-20 flex items-center justify-between border-t border-border font-sans text-[9px] leading-none tracking-[0.12em] uppercase text-t2">
            <span>{siteName} · Confidentiel</span>
            <span>2 / {totalPages}</span>
          </footer>
        </div>
      )}
    </div>
  );
}
