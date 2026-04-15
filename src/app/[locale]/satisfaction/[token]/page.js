import { getSatisfactionToken } from "@/lib/models/satisfaction";
import { getCachedSiteSettings } from "@/lib/models";
import SatisfactionForm from "@/components/forms/satisfaction";
import { ShieldX } from "lucide-react";

/* Non indexé — page accessible uniquement par lien direct */
export const metadata = {
  robots: { index: false, follow: false },
};

export default async function SatisfactionPage({ params }) {
  const { token } = await params;
  const [settings, record] = await Promise.all([
    getCachedSiteSettings(),
    getSatisfactionToken(token),
  ]);

  const siteName = settings?.site_name ?? "";

  /* ── Token invalide / expiré / déjà utilisé ── */
  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="max-w-md text-center space-y-4">
          <ShieldX size={40} className="mx-auto text-t2" strokeWidth={1.2} />
          <h1 className="font-serif text-2xl text-t0">Lien invalide</h1>
          <p className="text-sm text-t2 leading-relaxed">
            Ce lien de satisfaction est introuvable, déjà utilisé ou a expiré.<br />
            Contactez-nous si vous pensez qu'il s'agit d'une erreur.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── En-tête ── */}
      <div className="border-b border-border px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-serif text-lg text-t0">{siteName}</span>
          <span className="text-[0.65rem] uppercase tracking-widest text-t2">Évaluation confidentielle</span>
        </div>
      </div>

      {/* ── Contenu ── */}
      <main className="max-w-2xl mx-auto px-6 py-14 space-y-10">

        <div className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold font-medium">
            {record.label ?? "Évaluation de mission"}
          </p>
          <h1 className="font-serif text-3xl text-t0 leading-tight">
            Votre retour nous est précieux
          </h1>
          <p className="text-sm text-t2 leading-relaxed max-w-lg">
            Ce questionnaire est strictement confidentiel et anonyme. Il nous permet d&apos;améliorer continuellement
            la qualité de nos missions. Comptez environ 2 minutes.
          </p>
        </div>

        <div className="w-8 h-px bg-gold" />

        <SatisfactionForm token={token} label={record.label} />

      </main>

      {/* ── Pied ── */}
      <footer className="border-t border-border px-6 py-5 mt-10">
        <div className="max-w-2xl mx-auto text-xs text-t2 text-center">
          © {new Date().getFullYear()} {siteName} — Vos réponses sont traitées de manière confidentielle
        </div>
      </footer>
    </div>
  );
}
