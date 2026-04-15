// proxy.js — Middleware Next.js 16+
import { NextResponse } from "next/server";
import { getMaintenance } from "@/lib/models/maintenance";

const SUPPORTED_LOCALES = ["fr", "en"];
const DEFAULT_LOCALE = "fr";

/** Routes nécessitant une session valide (sans préfixe locale) */
const PROTECTED_SLUGS = ["/account"];

const IS_PROD = process.env.NODE_ENV === "production";

const DIRECTUS_URL = (process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "").replace(/\/$/, "");

// ─── Maintenance cache (TTL 30 s) ────────────────────────────────────────────
let maintenanceCache = { value: false, expiresAt: 0 };

async function getMaintenanceStatus() {
  if (Date.now() < maintenanceCache.expiresAt) {
    return maintenanceCache.value;
  }
  const item = await getMaintenance();
  const value = item?.status === true;
  maintenanceCache = { value, expiresAt: Date.now() + 30_000 };
  return value;
}

// ─── Silent token refresh ─────────────────────────────────────────────────────
async function silentRefresh(refreshToken) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken, mode: "json" }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return { accessToken: json.data.access_token, expiresMs: json.data.expires };
  } catch {
    return null;
  }
}

// ─── Main proxy ───────────────────────────────────────────────────────────────
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // ── Skip Next.js internals, API routes, static files, and maintenance page ─
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/maintenance"
  ) {
    return;
  }

  // ── Extract locale ────────────────────────────────────────────────────────
  const hasLocale = SUPPORTED_LOCALES.some((locale) => pathname.startsWith(`/${locale}`));
  const localeMatch = pathname.match(/^\/(fr|en)(\/.*)?$/);
  const locale = localeMatch?.[1] ?? DEFAULT_LOCALE;
  const pathWithoutLocale = localeMatch?.[2] ?? pathname;

  // ── Auth: silent refresh + route protection ───────────────────────────────
  const accessToken = request.cookies.get("ds_access")?.value;
  const refreshToken = request.cookies.get("ds_refresh")?.value;

  const isProtected = PROTECTED_SLUGS.some(
    (slug) => pathWithoutLocale === slug || pathWithoutLocale.startsWith(`${slug}/`),
  );

  // No access token but refresh token present → try silent refresh
  if (!accessToken && refreshToken) {
    const refreshed = await silentRefresh(refreshToken);

    if (refreshed) {
      const res = NextResponse.next();
      res.cookies.set("ds_access", refreshed.accessToken, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "lax",
        maxAge: Math.floor(refreshed.expiresMs / 1000),
        path: "/",
      });
      return res;
    }

    // Refresh failed → clean stale cookie, redirect if protected
    if (isProtected) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("ds_refresh");
      return res;
    }
  }

  // No tokens at all + protected route → redirect to login
  if (isProtected && !accessToken && !refreshToken) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Maintenance mode ──────────────────────────────────────────────────────
  const inMaintenance = await getMaintenanceStatus();

  if (inMaintenance) {
    return NextResponse.redirect(new URL("/maintenance", request.url), 307);
  }

  // ── Locale redirect ───────────────────────────────────────────────────────
  if (hasLocale) return; // already prefixed

  const acceptLanguage = request.headers.get("accept-language") || "";
  const detectedLocale = SUPPORTED_LOCALES.find((l) => acceptLanguage.toLowerCase().startsWith(l)) || DEFAULT_LOCALE;

  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${detectedLocale}${pathname}`;

  return NextResponse.redirect(newUrl, 308);
}

// ── Matcher ───────────────────────────────────────────────────────────────────
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
