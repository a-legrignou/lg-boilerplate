import { ImageResponse } from "next/og";
import { getGlobal } from "@/lib/payload";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "").slice(0, 120);
  const eyebrow = (searchParams.get("eyebrow") || "").slice(0, 60);

  const [brand, settings] = await Promise.all([
    getGlobal("brand").catch(() => null),
    getGlobal("settings", "fr").catch(() => null),
  ]);

  const primary = brand?.primary || "#6366f1";
  const accent = brand?.accent || "#22d3ee";
  const siteName = settings?.siteName || "Folio";
  const fontFamily =
    brand?.fontHeading && brand.fontHeading !== "system"
      ? `"${brand.fontHeading}", system-ui, -apple-system, sans-serif`
      : "system-ui, -apple-system, sans-serif";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: `radial-gradient(circle at 100% 0%, ${accent}33 0%, transparent 50%), radial-gradient(circle at 0% 100%, ${primary}33 0%, transparent 50%), #0a0a0a`,
        color: "#fafafa",
        fontFamily,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: `linear-gradient(135deg, ${primary}, ${accent})`,
          }}
        />
        <span style={{ fontSize: 22, color: "#a3a3a3" }}>{siteName}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {eyebrow ? (
          <span
            style={{
              fontSize: 22,
              color: accent,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {eyebrow}
          </span>
        ) : null}
        <h1
          style={{
            fontSize: title.length > 60 ? 64 : 80,
            lineHeight: 1.05,
            margin: 0,
            fontWeight: 600,
            letterSpacing: -2,
          }}
        >
          {title || siteName}
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
          color: "#737373",
        }}
      >
        <span>{new URL(SITE_URL).host}</span>
        <div
          style={{
            height: 4,
            width: 120,
            background: `linear-gradient(90deg, ${primary}, ${accent})`,
            borderRadius: 2,
          }}
        />
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
