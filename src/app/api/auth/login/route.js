import { NextResponse } from "next/server";
import { setSessionCookies } from "@/lib/utils/auth";

const DIRECTUS_URL = (
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
  ""
).replace(/\/$/, "");

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis." },
      { status: 400 },
    );
  }

  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, mode: "json" }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = err?.errors?.[0]?.message ?? "Identifiants invalides.";
    return NextResponse.json(
      { error: message },
      { status: res.status === 401 ? 401 : 400 },
    );
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
