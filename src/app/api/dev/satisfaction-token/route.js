import { NextResponse } from "next/server";
import { createItem } from "@directus/sdk";
import { directusAdmin } from "@/lib/utils/directus";
import { randomUUID } from "crypto";

// 🔒 Dev uniquement — jamais accessible en production
export async function GET(req) {
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const token = randomUUID();

  await directusAdmin.request(
    createItem("satisfaction_tokens", {
      token,
      label: "Test mission — Dev",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
    }),
  );

  const { origin } = new URL(req.url);
  return NextResponse.redirect(`${origin}/fr/satisfaction/${token}`);
}
