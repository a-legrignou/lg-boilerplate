"use client";
import { useCookieConsent } from "@/lib/hooks/cookie-consent";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const { consent, accept, refuse } = useCookieConsent();

  if (consent !== null) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 sm:bottom-10 sm:left-auto sm:right-10 sm:max-w-sm z-50 animate-slide-up"
      role="alertdialog"
      aria-label="Gestion des cookies"
      aria-describedby="cookie-banner-desc">
      <div className="border-t border-foreground/10 bg-background/95 backdrop-blur-md shadow-2xl">
        <div className="px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-4">
          {/* Icône + texte */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Cookie size={20} className="text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">Cookies & confidentialité</p>
              <p id="cookie-banner-desc" className="text-xs text-foreground/70 leading-relaxed">
                Nous utilisons des cookies analytiques (Google Analytics) pour mesurer l&apos;audience de notre site.
                Votre accord est requis conformément au{" "}
                <abbr title="Règlement Général sur la Protection des Données" className="no-underline">
                  RGPD
                </abbr>
                .
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex items-center gap-3 self-end">
            <button
              onClick={refuse}
              className="px-4 py-1.5 text-xs font-medium border border-foreground/40 text-foreground/70 hover:border-foreground hover:text-foreground transition-colors duration-300 cursor-pointer">
              Refuser
            </button>
            <button
              onClick={accept}
              className="px-5 py-1.5 text-xs font-semibold bg-secondary text-white hover:bg-sky-900 transition-colors duration-300 cursor-pointer">
              Tout accepter
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}
