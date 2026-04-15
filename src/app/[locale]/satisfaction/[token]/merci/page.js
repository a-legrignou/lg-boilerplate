import { getCachedSiteSettings } from "@/lib/models";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function SatisfactionMerciPage() {
  const settings = await getCachedSiteSettings();
  const siteName = settings?.site_name ?? "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── En-tête ── */}
      <div className="border-b border-border px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-serif text-lg text-t0">{siteName}</span>
          <span className="text-[0.65rem] uppercase tracking-widest text-t2">Évaluation confidentielle</span>
        </div>
      </div>

      {/* ── Message de confirmation ── */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <CheckCircle size={48} className="mx-auto text-green-500" strokeWidth={1.2} />

          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-t0">Merci pour votre retour</h1>
            <p className="text-sm text-t2 leading-relaxed">
              Votre évaluation a bien été enregistrée. Elle nous aidera à améliorer la qualité
              de nos missions et de notre accompagnement.
            </p>
          </div>

          <div className="w-8 h-px bg-gold mx-auto" />

          <p className="text-xs text-t2">
            Vous avez une question ou souhaitez nous contacter ?
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm text-t1 border border-border px-5 py-2.5 hover:border-navy hover:text-navy transition-colors duration-200">
            Nous contacter
          </Link>
        </div>
      </main>

      {/* ── Pied ── */}
      <footer className="border-t border-border px-6 py-5">
        <div className="max-w-2xl mx-auto text-xs text-t2 text-center">
          © {new Date().getFullYear()} {siteName} — Vos réponses sont traitées de manière confidentielle
        </div>
      </footer>
    </div>
  );
}
