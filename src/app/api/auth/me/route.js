import { NextResponse } from "next/server";
import { getSession, getUserTier } from "@/lib/utils/auth";

export async function GET() {
  const user = await getSession();
  return NextResponse.json({
    user: user ?? null,
    tier: getUserTier(user),
    authenticated: !!user,
  });
}
