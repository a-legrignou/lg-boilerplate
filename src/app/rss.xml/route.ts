import { buildRss } from "@/lib/rss";

export async function GET() {
  const xml = await buildRss("fr");
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
