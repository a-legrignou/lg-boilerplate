import { NextResponse } from "next/server";
import { getCsrfToken } from "@/lib/utils/csrf";

export async function GET() {
  try {
    const csrfToken = await getCsrfToken();
    return NextResponse.json({ csrfToken });
  } catch (error) {
    console.error("Erreur lors de la récupération du CSRF token:", error);
    return NextResponse.json({ error: "Impossible de récupérer le CSRF token" }, { status: 500 });
  }
}
