import { getCachedCaseBySlug, getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import { assetUrl } from "@/lib/utils/assets";
import { notFound } from "next/navigation";
import HeaderLayout from "@/components/layout/header";
import TopMenu from "@/components/menus/top-menu";
import Footer from "@/components/layout/footer";
import PdfDownloadButton from "@/components/widgets/pdf-download-button";
import Markdown from "@/components/ui/markdown";
import BadgeIcon from "@/components/widgets/badge-icon";
import { sectorLabel, sizeLabel } from "@/lib/utils/case-labels";
import { BarChart2, ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { generateBreadcrumbJsonLd } from "@/lib/seo/jsonld-utils";
import { generateCaseStudySeo } from "@/lib/seo/seo-utils";
import TitleSection from "@/components/widgets/title-section";
import Breadcrumb from "@/components/widgets/breadcrumb";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const [settings, study] = await Promise.all([getCachedSiteSettings(), getCachedCaseBySlug(slug)]);
  if (!study) return {};
  return generateCaseStudySeo({ study, settings, locale });
}

/* ─── Bloc d'analyse ──────────────────────────────────────────────── */
function AnalysisBlock({ label, heading, description, takeways }) {
  if (!description && !takeways?.length) return null;
  return (
    <section className="space-y-5">
      <TitleSection subtitle={label} title={heading} />
      {description && (
        <div className="prose prose-neutral max-w-none text-t1">
          <Markdown content={description} />
        </div>
      )}
      {takeways?.length > 0 && (
        <ul className="space-y-3">
          {takeways.map((t, i) => (
            <li key={i} className=" text-t1 pl-4 border-l-3 border-gold">
              {t}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ─── KPI bar ────────────────────────────────────────────────────── */
function KpiBar({ kpis }) {
  if (!kpis?.length) return null;
  return (
    <div className="flex flex-wrap gap-0 border border-border divide-x divide-border">
      {kpis.map((k, i) => (
        <div key={i} className="flex-1 min-w-30 px-6 py-5 text-center bg-cl">
          <div className="font-serif text-3xl font-light text-navy">{k.value ?? k.title}</div>
          <div className="text-[0.65rem] uppercase tracking-[0.14em] text-t2 mt-1 leading-relaxed">
            {k.label ?? k.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default async function CaseStudyPage({ params }) {
  const { locale, slug } = await params;
  const [settings, topmenu, study] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getCachedCaseBySlug(slug),
  ]);

  if (!study) notFound();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      { name: "Accueil", path: `/${locale}` },
      { name: "Références", path: `/${locale}/references` },
      { name: study.title, path: `/${locale}/references/${slug}` },
    ],
    settings,
  );

  const heroImage = study.image ? assetUrl(study.image?.id ?? study.image) : null;
  const sector = sectorLabel(study.client_sector);
  const size = sizeLabel(study.client_size);

  const goFurther = study.sections?.find((s) => s.key === "go_further");
  const cta = study.sections?.find((s) => s.key === "cta");

  return (
    <main>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />

      <HeaderLayout
        title={study.title}
        subtitle={study.subtitle}
        description={study.description}
        image={heroImage}
        home={false}
      />

      <Breadcrumb
        items={[
          { name: "Accueil",    path: `/${locale}` },
          { name: "Références", path: `/${locale}/references` },
          { name: study.title },
        ]}
      />

      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 xl:px-0 py-14 space-y-12">
        {/* Retour + Export */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/references`}
            className="inline-flex items-center gap-2 text-sm text-t2 hover:text-t0 transition-colors duration-200">
            <ArrowLeft size={14} />
            Retour aux études de cas
          </Link>
          <PdfDownloadButton slug={slug} />
        </div>

        {/* Bandeau méta */}
        <div className="flex flex-wrap items-center gap-3">
          {sector && <BadgeIcon label={sector} icon={Layers} variant="navy" />}
          {size && <BadgeIcon label={size} icon={BarChart2} variant="sage" />}
          {study.tags?.map((tag, i) => (
            <BadgeIcon key={i} label={tag} variant="sage" />
          ))}
        </div>

        {/* KPIs */}
        <KpiBar kpis={study.kpi} />

        {/* Analyse */}
        <AnalysisBlock
          label="Contexte"
          heading={study.context_heading}
          description={study.context_description}
          takeways={study.context_takeways}
        />
        <AnalysisBlock
          label="Challenge"
          heading={study.challenge_heading}
          description={study.challenge_description}
          takeways={study.challenge_takeways}
        />
        <AnalysisBlock
          label="Solution"
          heading={study.approach_heading}
          description={study.approach_description}
          takeways={study.approach_takeways}
        />
        <AnalysisBlock
          label="Résultats"
          heading={study.results_heading}
          description={study.results_description}
          takeways={study.results_takeways}
        />

        {/* Conclusion */}
        {study.conclusion && (
          <blockquote className="border border-navy bg-navy/5 p-6">
            <p className="font-serif text-t0 leading-relaxed italic">{study.conclusion}</p>
          </blockquote>
        )}

        {/* Aller plus loin */}
        {goFurther && (
          <AnalysisBlock
            label="Aller plus loin"
            heading={goFurther.heading}
            description={goFurther.description}
            takeways={goFurther.takeways}
          />
        )}

        {/* CTA */}
        {cta?.heading && (
          <div className="border border-border bg-cl p-8 space-y-4">
            <h3 className="font-serif text-2xl text-t0">{cta.heading}</h3>
            {cta.description && <p className="text-sm text-t2 leading-relaxed">{cta.description}</p>}
            {cta.url && (
              <a
                href={cta.url}
                className="inline-flex items-center gap-2 text-sm font-medium text-navy border border-navy px-5 py-2.5 hover:bg-navy hover:text-white transition-colors duration-200">
                Nous contacter →
              </a>
            )}
          </div>
        )}
      </div>

      <Footer locale={locale} />

      <Script
        id="reference-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
