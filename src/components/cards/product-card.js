import { Users, User } from "lucide-react";
import CardBase from "./card-base";

const AXE_LABEL = { business_growth: "Stratégie & développement", business_resilience: "Sécurité économique" };
const PERSONA_LABEL = {
  dirigeants: "Dirigeants",
  leaders: "Dirigeants",
  investisseurs: "Investisseurs",
  investors: "Investisseurs",
};

/* ─── ModuleCard ────────────────────────────────────────────────────
 * Normalise les données d'un module produit et délègue
 * le rendu visuel à CardBase.
 * ──────────────────────────────────────────────────────────────── */

export default function ModuleCard({ module }) {
  const personaRaw = Array.isArray(module?.persona) ? module.persona : (module?.persona?.split(",") ?? []);
  const personas = personaRaw.map((p) => PERSONA_LABEL[p.trim()] ?? p.trim());
  const personaLabel = personas.length > 1 ? personas.join(" & ") : personas[0];
  const PersonaIcon = personas.length > 1 ? Users : User;

  const imageBadge = personaLabel && (
    <span className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-widest uppercase px-2 py-0.5 bg-noir/60 text-tw border border-tw/20 backdrop-blur-sm">
      <PersonaIcon size={10} strokeWidth={1.5} />
      {personaLabel}
    </span>
  );

  return (
    <CardBase
      image={module?.image}
      href={module?.slug ? `/proposal/${module.slug}` : null}
      title={module?.title}
      description={module?.description}
      footerLabel={module?.axe ? AXE_LABEL[module.axe] : null}
      ctaLabel="Découvrir"
      imageBadge={imageBadge}
    />
  );
}
