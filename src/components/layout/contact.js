"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Home, MapPin, Star, Building2 } from "lucide-react";
import ContactForm from "@/components/forms/contact";
import BadgeIcon from "@/components/widgets/badge-icon";
import Link from "next/link";

/* ─── Leaflet chargé côté client uniquement ─────────────────── */
const FranceMap = dynamic(() => import("@/components/widgets/france-map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-cd" />,
});

/* ─── Agences ─────────────────────────────────────────────────── */
const AGENCIES = [
  {
    id: "vannes",
    city: "Vannes",
    label: "Siège social",
    address: "8 place des Lices, 56000 Vannes",
    badge: { label: "Siège social", icon: Star, variant: "gold" },
  },
  {
    id: "lyon",
    city: "Lyon",
    label: "Agence de Lyon",
    address: "12 rue de la République, 69001 Lyon",
    badge: { label: "Agence", icon: Building2, variant: "sage" },
  },
];

/* ─── ContactSection ─────────────────────────────────────────── */
export default function ContactSection({ section }) {
  const [active, setActive] = useState("vannes");
  const searchParams = useSearchParams();
  const initialEmail = searchParams?.get("email") ?? "";

  return (
    <section id={section?.slug ?? "contact"} className="w-full min-h-screen">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* ── Colonne gauche : form ── */}
        <div className="w-full lg:w-1/2 px-6 sm:px-10 xl:px-16 py-16 flex flex-col gap-6">
          <Link
            href="/"
            className=" text-t0 hover:text-t0 transition-colors duration-200 flex items-center gap-2 border border-foreground rounded-none px-3 py-2 text-sm w-max">
            <Home size={16} />
            Retour à l&apos;accueil
          </Link>
          {/* Header */}
          <div>
            <h1 className="font-serif text-4xl text-t0 mt-3 leading-tight">
              {section?.title ?? "Parlons de votre projet"}
            </h1>
            {section?.description && (
              <p className="text-t2 mt-4 text-sm leading-relaxed max-w-md">{section.description}</p>
            )}
          </div>

          {/* Sélection agence */}
          <div>
            <p className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-t2 mb-3">Nos bureaux</p>
            <div className="grid grid-cols-2 gap-3">
              {AGENCIES.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setActive(a.id)}
                  className={[
                    "text-left p-4 border transition-all duration-200",
                    active === a.id ? "border-navy bg-navy/5" : "border-border hover:border-navy/40",
                  ].join(" ")}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-medium ${active === a.id ? "text-navy" : "text-t0"}`}>{a.city}</p>
                    <BadgeIcon label={a.badge.label} icon={a.badge.icon} variant={a.badge.variant} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-t2">
                    <MapPin size={10} className="shrink-0" />
                    {a.address}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Carte mobile */}
          <div className="lg:hidden w-full aspect-video border border-border overflow-hidden">
            <FranceMap activeAgency={active} />
          </div>

          {/* Formulaire */}
          <div className="p-4 bg-muted border">
            <p className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-t2 mb-5">Envoyer un message</p>
            <ContactForm initialEmail={initialEmail} />
          </div>
        </div>

        {/* ── Colonne droite : carte desktop (sticky) ── */}
        <div className="hidden lg:block lg:w-1/2 sticky top-0 h-screen">
          <FranceMap activeAgency={active} />
        </div>
      </div>
    </section>
  );
}
