import Link from "next/link";
import { getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import TopMenu from "@/components/menus/top-menu";
import Footer from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  const [settings, topmenu] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
  ]);

  return (
    <>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />

      <main className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center gap-10">
        <div className="space-y-4">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-gold">Erreur 404</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">Page introuvable</h1>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
            Cette page n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/fr"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-navy text-navy text-sm font-medium hover:bg-navy hover:text-white transition-colors">
            <ArrowLeft size={14} aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/fr/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-border text-t2 text-sm font-medium hover:border-navy hover:text-navy transition-colors">
            Consulter nos analyses
          </Link>
          <Link
            href="/fr/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-border text-t2 text-sm font-medium hover:border-navy hover:text-navy transition-colors">
            Nous contacter
          </Link>
        </div>
      </main>

      <Footer locale="fr" />
    </>
  );
}
