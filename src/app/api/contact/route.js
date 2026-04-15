import { NextResponse } from "next/server";
import { createItem } from "@directus/sdk";
import { z } from "zod";
import { validateCsrfToken } from "@/lib/utils/csrf";
import { directusAdmin } from "@/lib/utils/directus";
import { ContactSchema } from "@/lib/validators/contact";

// Rate limiting : 3 requêtes par tranche de 15 minutes par IP
const RATE_LIMIT = 3;
const WINDOW_MS = 15 * 60 * 1000;
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// Endpoint POST
export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ success: false, message: "Trop de requêtes, réessayez dans quelques minutes." }, { status: 429 });
  }

  try {
    const csrfToken = req.headers.get("x-csrf-token");
    if (!await validateCsrfToken(csrfToken)) {
      return NextResponse.json({ success: false, message: "Token invalide" }, { status: 403 });
    }

    const data = await req.json();

    // Validation Zod
    const validated = ContactSchema.parse(data);

    // Création dans Directus via createItem
    await directusAdmin.request(
      createItem("contact_messages", {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        message: validated.message,
      }),
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Erreur API contact:", err);

    // Gestion des erreurs Zod
    if (err instanceof z.ZodError) {
      const message = err.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    // Autres erreurs
    return NextResponse.json({ success: false, message: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
