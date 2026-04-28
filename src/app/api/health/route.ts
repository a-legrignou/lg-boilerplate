import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URI });

export async function GET() {
  const start = Date.now();
  try {
    await pool.query("SELECT 1");
    return Response.json(
      {
        status: "ok",
        database: "up",
        uptime: process.uptime(),
        latencyMs: Date.now() - start,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "degraded", database: "down" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
