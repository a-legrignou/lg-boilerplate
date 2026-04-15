import { NextResponse } from "next/server";
import { getSession } from "@/lib/utils/auth";
import { readFile } from "fs/promises";
import { join } from "path";

const REPORT_PATH = join(process.cwd(), ".diag", "last-report.json");

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = await readFile(REPORT_PATH, "utf8");
    const report = JSON.parse(raw);
    return NextResponse.json(report);
  } catch {
    return NextResponse.json(
      { error: "Aucun rapport disponible. Lancez d'abord : bash diag.sh" },
      { status: 404 }
    );
  }
}
