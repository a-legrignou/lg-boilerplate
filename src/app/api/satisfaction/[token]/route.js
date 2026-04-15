import { NextResponse } from "next/server";
import { z } from "zod";
import { getSatisfactionToken, submitSatisfactionResponse } from "@/lib/models/satisfaction";
import { SatisfactionSchema } from "@/lib/validators/satisfaction";

export async function POST(req, { params }) {
  const { token } = await params;

  // Vérification du token
  const record = await getSatisfactionToken(token);
  if (!record) {
    return NextResponse.json({ success: false, message: "Lien invalide, expiré ou déjà utilisé." }, { status: 403 });
  }

  try {
    const data = await req.json();
    const validated = SatisfactionSchema.parse(data);
    await submitSatisfactionResponse(record.id, token, validated);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const message = err.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ success: false, message }, { status: 400 });
    }
    console.error("[API] satisfaction POST", err?.message ?? err);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
