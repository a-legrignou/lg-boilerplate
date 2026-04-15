"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Menu, Linkedin as LinkedIn, ChevronDown } from "lucide-react";
import { useDarkMode } from "@/lib/hooks/dark-mode";
import { useLocale } from "@/lib/hooks/use-locale";
import { usePathname, useRouter } from "next/navigation";
import { assetUrl } from "@/lib/utils/assets";

/* ----------------------------------------
   LanguageSwitcher
---------------------------------------- */
const SUPPORTED_LOCALES = ["fr", "en"];

function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const locale = useMemo(() => {
    const seg = pathname.split("/")[1];
    return SUPPORTED_LOCALES.includes(seg) ? seg : "fr";
  }, [pathname]);

  const changeLocale = (newLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return;
    const segments = pathname.split("/");
    if (SUPPORTED_LOCALES.includes(segments[1])) segments[1] = newLocale;
    else segments.splice(1, 0, newLocale);
    router.push(segments.join("/") || "/");
  };

  const next = SUPPORTED_LOCALES.find((l) => l !== locale) ?? SUPPORTED_LOCALES[0];

  return (
    <button
      onClick={() => changeLocale(next)}
      aria-label={`Passer en ${next.toUpperCase()}`}
      className="border border-foreground rounded-none p-1 w-8.5 h-8.5 flex items-center justify-center hover:scale-105 transition-transform duration-500 ease-in-out text-xs font-medium">
      {next.toUpperCase()}
    </button>
  );
}

/* ----------------------------------------
   Dropdown – items avec enfants (desktop)
---------------------------------------- */
function NavDropdown({ item, locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const children = useMemo(() => (item.children ?? []).filter((c) => c?.active !== false && c?.label), [item.children]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!children.length) return null;

  return (
    <li ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-lg font-medium transition-transform hover:scale-105 duration-500 ease-in-out"
        aria-expanded={open}
        aria-haspopup="true">
        {item.label}
        <ChevronDown
          size={15}
          className={`mt-px transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Panel */}
      <div
        className={[
          "absolute top-full left-1/2 -translate-x-1/2 mt-6 w-80 z-50",
          "transition-all duration-200 origin-top",
          open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none",
        ].join(" ")}>
        {/* Flèche */}

        {/* Liste */}
        <ul role="menu" className="bg-background backdrop-blur-lg border border-border-md shadow-2xl overflow-hidden">
          {children.map((child, i) => {
            const path = child.path?.startsWith("/") ? child.path : `/${child.path ?? ""}`;
            return (
              <li key={child.id ?? i} role="menuitem" className="border-b border-border last:border-0">
                <Link
                  href={`/${locale}${path}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-cd">
                  <span className="shrink-0 w-7 h-7 flex items-center justify-center bg-gold text-t0 font-mono text-[11px]">
                    {String(i + 1).padStart(2, "00")}
                  </span>
                  <span className="flex-1 text-sm font-medium text-t0 group-hover:text-navy transition-colors duration-150">
                    {child.label}
                  </span>
                  <ChevronDown
                    size={13}
                    className="-rotate-90 text-t2 group-hover:text-gold transition-colors duration-150"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

/* ----------------------------------------
   NavItem – lien simple (desktop)
---------------------------------------- */
function NavItem({ item, locale }) {
  const path = item.path?.startsWith("/") ? item.path : `/${item.path ?? ""}`;
  const label = path === "/" ? "Accueil" : item.label;

  return (
    <li>
      <Link
        href={`/${locale}${path}`}
        className="text-lg font-medium transition-transform hover:scale-105 duration-500 ease-in-out z-20 inline-block">
        {label}
      </Link>
    </li>
  );
}

/* ----------------------------------------
   MobileNavLinks
---------------------------------------- */
function MobileNavLinks({ items, locale, onClick }) {
  return (
    <>
      {items.map((item) => {
        const children = (item.children ?? []).filter((c) => c?.active !== false && c?.label);

        if (children.length > 0) {
          return (
            <li key={item.id}>
              <span className="opacity-40 uppercase tracking-widest text-xs">{item.label}</span>
              <ul className="mt-2 flex flex-col gap-3 pl-3 border-l border-foreground/20">
                {children.map((child) => {
                  const path = child.path?.startsWith("/") ? child.path : `/${child.path ?? ""}`;
                  return (
                    <li key={child.id ?? child.path}>
                      <Link
                        href={`/${locale}${path}`}
                        onClick={onClick}
                        className="text-xl font-medium z-20 inline-block">
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        }

        const path = item.path?.startsWith("/") ? item.path : `/${item.path ?? ""}`;
        const label = path === "/" ? "Accueil" : item.label;
        return (
          <li key={item.id}>
            <Link href={`/${locale}${path}`} onClick={onClick} className="text-xl font-medium z-20 inline-block">
              {label}
            </Link>
          </li>
        );
      })}
    </>
  );
}

/* ----------------------------------------
   DarkModeToggle
---------------------------------------- */
function DarkModeToggle({ isDarkMode, toggleDarkMode, className = "" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={mounted ? (isDarkMode ? "Passer en mode clair" : "Passer en mode sombre") : "Thème"}
      className={`border border-foreground rounded-none p-1 w-8.5 h-8.5 flex items-center justify-center hover:scale-105 transition-transform duration-500 ease-in-out ${className}`}>
      {mounted && (isDarkMode ? (
        <Sun size={16} strokeWidth={"1.25px"} aria-hidden />
      ) : (
        <Moon size={16} strokeWidth={"1.25px"} aria-hidden />
      ))}
    </button>
  );
}

/* ----------------------------------------
   NavActions
---------------------------------------- */
function NavActions({ isDarkMode, toggleDarkMode, locale, linkedinUrl }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${locale}/contact`}
        className="border border-foreground rounded-none px-3 h-8.5 flex items-center justify-center bg-foreground text-background text-xs font-medium tracking-wide hover:bg-navy hover:border-navy transition-all duration-300">
        Contact
      </Link>
      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <a
        href={linkedinUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="border border-foreground rounded-none p-1 w-8.5 h-8.5 flex items-center justify-center hover:scale-105 transition-transform duration-500 ease-in-out">
        <LinkedIn size={16} strokeWidth={"1.25px"} />
      </a>
      <LanguageSwitcher />
    </div>
  );
}

/* ----------------------------------------
   TopMenu
---------------------------------------- */
export default function TopMenu({ items = [], logo, name, linkedinUrl }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { locale } = useLocale();
  const [megaActive, setMegaActive] = useState(false);

  return (
    <>
      {megaActive && (
        <button
          aria-label="Fermer le menu"
          className="fixed inset-0 bg-black/10 z-40 md:hidden"
          onClick={() => setMegaActive(false)}
        />
      )}

      <nav
        className="fixed top-0 left-0 w-full z-40 bg-background/70 backdrop-blur-lg"
        role="navigation"
        aria-label="Navigation principale">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="Retour à l'accueil">
            <div className="relative h-9 w-9">
              <Image src={assetUrl(logo)} alt={`${name} logo`} fill className="object-contain" priority />
            </div>
            <span className="font-serif font-semibold text-2xl">{name}</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6" role="menubar">
              {items.map((item) => {
                const hasChildren = (item.children ?? []).some((c) => c?.label);
                return hasChildren ? (
                  <NavDropdown key={item.id} item={item} locale={locale} />
                ) : (
                  <NavItem key={item.id} item={item} locale={locale} />
                );
              })}
            </ul>
            <NavActions isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} locale={locale} linkedinUrl={linkedinUrl} />
          </div>

          {/* Mobile button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setMegaActive((prev) => !prev)}
            aria-label="Ouvrir le menu"
            aria-expanded={megaActive}
            aria-controls="mobile-menu">
            <Menu
              size={28}
              className={`transform transition-transform duration-300 ${megaActive ? "rotate-90" : "rotate-0"}`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className={`fixed left-0 right-0 top-16 bottom-0 h-[calc(100vh-4rem)] bg-background z-40 p-8 overflow-y-auto transition-transform duration-300 lg:hidden ${
            megaActive ? "translate-y-0" : "translate-y-full"
          }`}>
          <ul className="flex flex-col gap-4 border-b pb-6">
            <MobileNavLinks items={items} locale={locale} onClick={() => setMegaActive(false)} />
          </ul>
          <div className="flex items-center gap-6 mt-6">
            <NavActions isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} locale={locale} linkedinUrl={linkedinUrl} />
          </div>
        </div>
      </nav>
    </>
  );
}
