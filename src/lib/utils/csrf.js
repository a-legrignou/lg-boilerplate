// lib/utils/csrf.ts
"use server";

import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

/**
 * Récupère (ou crée) le token CSRF dans les cookies et renvoie la valeur.
 * À appeler dans un Server Component ou Server Action.
 */
export async function getCsrfToken() {
  const cookieStore = await cookies();
  let token = cookieStore.get("csrf_token")?.value;
  if (!token) {
    token = uuidv4();
    cookieStore.set({
      name: "csrf_token",
      value: token,
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return token;
}

/** Validation simple : compare token fourni avec valeur en cookie */
export async function validateCsrfToken(token) {
  if (!token) return false;
  const cookieToken = (await cookies()).get("csrf_token")?.value;
  return cookieToken === token;
}
