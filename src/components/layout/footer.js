import Link from "next/link";
import Image from "next/image";
import { getCachedSiteSettings } from "@/lib/models";
import { assetUrl } from "@/lib/utils/assets";

function FooterNavCol({ title, links, locale }) {
  if (!links?.length) return null;
  return (
    <div>
      <p className="text-[0.6rem] font-medium tracking-[0.18em] uppercase text-gold mb-6">{title}</p>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={`/${locale}${link.href}`}
              className="text-sm text-tw/50 hover:text-tw transition-colors duration-300 hover:translate-x-0.5 inline-block">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */
const FOOTER_RESSOURCES = [
  { label: "Nos offres", href: "/proposal" },
  { label: "Analyses & Veille", href: "/blog" },
  { label: "Références clients", href: "/references" },
  { label: "L'équipe", href: "/team" },
];

const FOOTER_CONTACT = [
  { label: "Nous contacter", href: "/contact" },
  { label: "Espace membre", href: "/account" },
];

export default async function Footer({ locale = "fr" }) {
  const settings = await getCachedSiteSettings();
  const logoSrc = assetUrl(settings?.logo, "/logo.png");

  return (
    <footer className="bg-noir">
      {/* ── Ligne décorative gold ── */}
      <div className="h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

      {/* ── Corps ── */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Colonne marque */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 group" aria-label="Accueil">
              <div className="relative h-9 w-9 shrink-0">
                <Image src={logoSrc} alt={settings?.site_name ?? "Logo"} fill className="object-contain" unoptimized />
              </div>
              <span className="font-serif text-2xl text-tw tracking-wide">{settings?.site_name ?? ""}</span>
            </Link>

            {settings?.site_tagline && (
              <p className="text-tw/40 text-sm leading-relaxed max-w-sm font-light">
                {settings.site_tagline}
              </p>
            )}

            <div className="flex items-center gap-6">
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn ${settings.site_name ?? ""}`}
                  className="inline-flex items-center justify-center w-9 h-9 border border-tw/15 text-tw/40 hover:border-gold hover:text-gold transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
              {settings?.offices && (
                <span className="text-xs text-tw/20 tracking-widest uppercase">
                  {Array.isArray(settings.offices) ? settings.offices.join(" · ") : settings.offices}
                </span>
              )}
            </div>
          </div>

          {/* Colonnes nav */}
          <FooterNavCol title="Ressources" links={FOOTER_RESSOURCES} locale={locale} />
          <FooterNavCol title="Contact & Accès" links={FOOTER_CONTACT} locale={locale} />
        </div>
      </div>

      {/* ── Barre légale ── */}
      <div className="border-t border-tw/8 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-tw/20 tracking-wide">
            © {new Date().getFullYear()} {settings?.legal_name ?? settings?.site_name ?? ""} — Tous droits réservés
          </span>
          <nav className="flex items-center gap-6">
            {[
              { label: "Mentions légales", href: `/${locale}/legal` },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-tw/20 hover:text-tw/50 transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
