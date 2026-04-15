/**
 * auth.js
 * =======
 * Server-side session utilities for Directus-based authentication.
 *
 * Cookies:
 *   ds_access  — Directus access token (httpOnly, short-lived ~15 min)
 *   ds_refresh — Directus refresh token (httpOnly, 7 days)
 *
 * Usage (Server Components / Route Handlers):
 *   const user = await getSession();
 *   const tier = getUserTier(user);
 *   const ok   = canAccessPost(tier, post.tier);
 */

import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE  = "ds_access";
export const REFRESH_TOKEN_COOKIE = "ds_refresh";

export const DIRECTUS_URL = (
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  ""
).replace(/\/$/, "");

// ─── Session ──────────────────────────────────────────────────────────────────

/**
 * Fetch the authenticated Directus user from the access-token cookie.
 * Returns null if unauthenticated or the token is expired/invalid.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) return null;

  try {
    const res = await fetch(
      `${DIRECTUS_URL}/users/me?fields=id,email,first_name,last_name,role.id,role.name`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 0 }, // always fresh — never cache auth state
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ─── Tier helpers ─────────────────────────────────────────────────────────────

/**
 * Derives the user content tier from the Directus role name.
 *
 * Directus roles to create:
 *   "Premium"   → tier = "premium"
 *   "Community" → tier = "community"
 *   any other authenticated user → "community" (safe default)
 *   unauthenticated → "public"
 */
export function getUserTier(user) {
  if (!user) return "public";
  const roleName = (user.role?.name ?? "").toLowerCase();
  if (roleName === "premium") return "premium";
  return "community";
}

/**
 * Returns true if a user with `userTier` can access a post with `postTier`.
 *
 * Post tier values (posts.tier field in Directus):
 *   null / ""      → public — visible to everyone
 *   "community"    → free, public — visible to everyone (badge only, no gate)
 *   "premium"      → requires Premium role
 */
export function canAccessPost(userTier, postTier) {
  if (!postTier || postTier === "community") return true;
  if (postTier === "premium") return userTier === "premium";
  return true;
}

// ─── Cookie helpers (used in Route Handlers) ──────────────────────────────────

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Set both session cookies on a NextResponse object.
 * `expiresMs` — the `expires` value from Directus (in milliseconds).
 */
export function setSessionCookies(response, { accessToken, refreshToken, expiresMs }) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    maxAge: Math.floor((expiresMs ?? 900_000) / 1000),
    path: "/",
  });

  if (refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
  }
}

/** Clear both session cookies. */
export function clearSessionCookies(response) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
}
