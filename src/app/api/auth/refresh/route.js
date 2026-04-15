import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  REFRESH_TOKEN_COOKIE,
  setSessionCookies,
  clearSessionCookies,
} from "@/lib/utils/auth";

const DIRECTUS_URL = (
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  ""
).replace(/\/$/, "");

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token." }, { status: 401 });
  }

  const res = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken, mode: "json" }),
  });

  if (!res.ok) {
    const response = NextResponse.json(
      { error: "Session expirée." },
      { status: 401 },
    );
    clearSessionCookies(response);
    return response;
  }

  const json = await res.json();
  const { access_token, refresh_token, expires } = json.data;

  const response = NextResponse.json({ ok: true });
  setSessionCookies(response, {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresMs: expires,
  });
  return response;
}
