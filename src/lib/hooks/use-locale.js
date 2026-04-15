"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export function useLocale() {
  const router = useRouter();
  const pathname = usePathname();

  const locales = useMemo(() => ["fr", "en"], []); // toutes les locales supportées
  const defaultLocale = "fr";

  // récupère la locale depuis le path (SSR-safe)
  const locale = useMemo(() => {
    const firstSegment = pathname.split("/")[1];
    return locales.includes(firstSegment) ? firstSegment : defaultLocale;
  }, [pathname, locales]);

  const changeLocale = (newLocale) => {
    if (!locales.includes(newLocale)) return;

    const segments = pathname.split("/");
    if (locales.includes(segments[1])) segments[1] = newLocale;
    else segments.splice(1, 0, newLocale);

    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  return { locale, changeLocale, locales };
}
