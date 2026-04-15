import {
  getCachedModuleBySlug,
  getCachedSiteSettings,
  getCachedTopMenu,
  getCachedAllModules,
  getCachedBlogContent,
} from "@/lib/models";
import { assetUrl } from "@/lib/utils/assets";
import { notFound } from "next/navigation";
import HeaderLayout from "@/components/layout/header";
import TopMenu from "@/components/menus/top-menu";
import Footer from "@/components/layout/footer";
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo/jsonld-utils";
import { generateModuleSeo } from "@/lib/seo/seo-utils";
import ModuleCard from "@/components/cards/product-card";
import BlogCard from "@/components/cards/blog-card";
import SmartLink from "@/components/ui/smart-link";
import Script from "next/script";
import { ArrowRight, CheckCircle, Briefcase, TrendingUp } from "lucide-react";
import Markdown from "@/components/ui/markdown";
import Breadcrumb from "@/components/widgets/breadcrumb";
import TitleSection from "../../../../components/widgets/title-section";
import PdfDownloadButton from "@/components/widgets/pdf-download-button";
import BadgeIcon from "@/components/widgets/badge-icon";
import { Title } from "@radix-ui/react-dialog";

/* ─── Config ──────────────────────────────────────────────────── */

const AXE_CONFIG = {
  growth: { label: "Développement" },
  resilience: { label: "Sécurité économique" },
};

const PERSONA_LABEL = {
  dirigeants: "Dirigeants",
  leaders: "Dirigeants",
  investisseurs: "Investisseurs",
  investors: "Investisseurs",
};

const PERSONA_CONFIG = {
  Dirigeants: { icon: Briefcase, variant: "navy" },
  Investisseurs: { icon: TrendingUp, variant: "navy" },
};

/* ─── Metadata ───────────────────────────────────────────────── */

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const [settings, module] = await Promise.all([getCachedSiteSettings(), getCachedModuleBySlug(slug)]);
  if (!module) return {};
  return generateModuleSeo({ module, settings, locale });
}

/* ─── Page ───────────────────────────────────────────────────── */

export default async function ProposalDetailPage({ params }) {
  const { locale, slug } = await params;

  const [settings, topmenu, module, allModules, posts] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
    getCachedModuleBySlug(slug),
    getCachedAllModules(),
    getCachedBlogContent(),
  ]);

  if (!module) notFound();

  const axe = module.axe ? AXE_CONFIG[module.axe] : null;
  const heroImage = module.image?.id ? assetUrl(module.image.id) : null;
  const relatedModules = (allModules ?? []).filter((m) => m.slug !== slug).slice(0, 3);
  const recentPosts = (posts ?? []).slice(0, 3);

  const personaRaw = Array.isArray(module.persona) ? module.persona : (module.persona?.split(",") ?? []);
  const personas = personaRaw.map((p) => PERSONA_LABEL[p.trim()] ?? p.trim()).filter(Boolean);

  const benefits = Array.isArray(module.benefits) ? module.benefits.filter(Boolean) : [];

  const specs = [
    module.duration && { label: "Durée", value: module.duration },
    module.deliverable && { label: "Livrable", value: module.deliverable },
    module.format && { label: "Format", value: module.format },
  ].filter(Boolean);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      { name: "Accueil", path: `/${locale}` },
      { name: "Nos offres", path: `/${locale}/proposal` },
      { name: module.title, path: `/${locale}/proposal/${slug}` },
    ],
    settings,
  );
  const serviceJsonLd = generateServiceJsonLd({ module, settings, locale, slug });

  return (
    <main>
      <TopMenu
        items={topmenu}
        logo={settings?.logo}
        name={settings?.site_name}
        linkedinUrl={settings?.linkedin_url}
        className="print:hidden"
      />

      {/* ── Hero ── */}
      <HeaderLayout
        title={module.title}
        subtitle={axe?.label}
        description={module.description}
        image={heroImage}
        home={false}
      />

      {/* ── Breadcrumb + PDF ── */}
      <div className="w-full bg-background  px-6 py-3 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Breadcrumb
            items={[
              { name: "Accueil", path: `/${locale}` },
              { name: "Nos offres", path: `/${locale}/proposal` },
              { name: module.title },
            ]}
            className="max-w-none"
          />
          <PdfDownloadButton slug={slug} endpoint={`/api/proposal/${slug}/pdf`} filename={`offre_${slug}.pdf`} />
        </div>
      </div>

      {/* ── One-pager : narratif + fiche specs ── */}
      <section className="w-full px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-start">
          {/* ── Colonne gauche : narratif ── */}
          <div className="space-y-14">
            {/* Accroche */}
            {module.excerpt && (
              <div className="space-y-5">
                {personas.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="h-px w-6 bg-gold shrink-0" />
                    {personas.map((p, i) => (
                      <span key={p} className="text-[0.6rem] tracking-widest uppercase text-gold">
                        {i > 0 && <span className="mx-2 opacity-40">·</span>}
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                <p className="font-serif text-3xl sm:text-4xl text-t0 leading-snug text-balance">{module.excerpt}</p>
              </div>
            )}

            {/* Séparateur */}
            {module.excerpt && (module.why || module.how || benefits.length > 0) && (
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <div className="w-1.5 h-1.5 bg-gold rotate-45 shrink-0" />
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            {/* Enjeux — 01 */}
            {module.why && (
              <div className="space-y-6">
                <TitleSection title="Vos enjeux" subtitle="Vous êtes concerné si…" />

                <div className="text-t1 leading-relaxed pl-0">
                  <Markdown content={module.why} />
                </div>
              </div>
            )}

            {/* Séparateur inter-sections */}
            {module.why && module.how && (
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            {/* Approche — 02 */}
            {module.how && (
              <div className="space-y-6">
                <TitleSection title="Ce que nous faisons" subtitle="Méthodologie" />
                <div className="text-t1 leading-relaxed">
                  <Markdown content={module.how} />
                </div>
              </div>
            )}

            {/* Séparateur inter-sections */}
            {module.how && benefits.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <div className="w-1.5 h-1.5 bg-gold rotate-45 shrink-0" />
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            {/* Bénéfices — 03 */}
            {benefits.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <span
                    className="font-serif text-5xl leading-none text-gold/15 select-none shrink-0 -mt-1"
                    aria-hidden>
                    03
                  </span>
                  <div>
                    <span className="text-[0.6rem] tracking-widest uppercase text-gold block mb-2">Bénéfices</span>
                    <h2 className="font-serif text-2xl text-t0 leading-tight">Ce que vous en retirez</h2>
                  </div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 border-l-2 border-gold/40 pl-4 py-2 bg-cd">
                      <span className="text-t1 text-sm leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Colonne droite : fiche specs (sticky) ── */}
          <aside className="lg:sticky lg:top-24 space-y-0 border border-border divide-y divide-border">
            {/* Axe */}
            {axe && (
              <div className="px-6 py-4 bg-navy">
                <span className="text-[0.6rem] tracking-widest uppercase text-gold/70 block mb-1">Axe</span>
                <p className="font-medium text-tw text-sm">{axe.label}</p>
              </div>
            )}

            {/* Personas */}
            {personas.length > 0 && (
              <div className="px-6 py-4">
                <span className="text-sm font-sans font-medium tracking-widest uppercase text-gold block mb-2">
                  Conçu pour
                </span>
                <div className="flex flex-col gap-2">
                  {personas.map((p) => (
                    <BadgeIcon
                      key={p}
                      label={p}
                      icon={PERSONA_CONFIG[p]?.icon}
                      variant={PERSONA_CONFIG[p]?.variant ?? "default"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Specs */}
            {specs.map(({ label, value }) => (
              <div key={label} className="px-6 py-4">
                <span className="text-sm font-sans font-medium tracking-widest uppercase text-gold block mb-2">
                  {label}
                </span>
                <p className="font-serif text-lg text-t0 leading-tight">{value}</p>
              </div>
            ))}

            {/* Budget */}
            {module.budget && (
              <div className="px-6 py-4">
                <span className="text-[0.6rem] tracking-widest uppercase text-t2 block mb-1">Budget indicatif</span>
                <p className="font-serif text-lg text-t0 leading-tight">{module.budget}</p>
              </div>
            )}

            {/* CTA */}
            <div className="px-6 py-5 print:hidden">
              <SmartLink
                href={`/${locale}/contact`}
                className="w-full flex items-center justify-center gap-2 bg-gold text-noir px-6 py-3.5 text-sm font-medium tracking-wide hover:bg-gold/90 transition-colors duration-300">
                Être contacté <ArrowRight size={14} aria-hidden />
              </SmartLink>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Produits complémentaires ── */}
      {relatedModules.length > 0 && (
        <section className="w-full px-6 py-20 bg-cd print:hidden" data-tone="muted">
          <div className="max-w-6xl mx-auto space-y-12">
            <TitleSection title="Approches complémentaires" subtitle="À explorer" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedModules.map((m) => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </div>
            <SmartLink
              href={`/${locale}/proposal`}
              className="inline-flex items-center gap-2 text-sm text-t2 hover:text-t0 transition-colors">
              Voir toutes nos offres <ArrowRight size={14} aria-hidden />
            </SmartLink>
          </div>
        </section>
      )}

      {/* ── Articles récents ── */}
      {recentPosts.length > 0 && (
        <section className="w-full px-6 py-20 bg-navy print:hidden" data-tone="navy">
          <div className="max-w-6xl mx-auto space-y-12">
            <TitleSection title="Ressources associées" subtitle="Insights" tone="navy" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <SmartLink
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm text-tw/60 hover:text-tw transition-colors">
              Voir tous les articles <ArrowRight size={14} aria-hidden />
            </SmartLink>
          </div>
        </section>
      )}

      <Footer locale={locale} className="print:hidden" />

      <Script
        id="proposal-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="proposal-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </main>
  );
}
