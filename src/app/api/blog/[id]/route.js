// src/app/api/posts/[id]/view/route.js

import { NextResponse } from "next/server";
import { createItem, readItem, updateItem } from "@directus/sdk";
import { createHash } from "crypto";
import { directusAdmin } from "@/lib/utils/directus";

export async function POST(req, { params }) {
  const { id } = await params;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown";

  const ipHash = createHash("sha256").update(ip).digest("hex");

  try {
    // 1. Lire le compteur actuel
    const post = await directusAdmin.request(readItem("posts", id, { fields: ["views"] }));

    // 2. Incrémenter
    await directusAdmin.request(
      updateItem("posts", id, {
        views: (post.views ?? 0) + 1,
      }),
    );

    // 3. Créer l'entrée qualitative
    await directusAdmin.request(
      createItem("post_views", {
        post: id,
        viewed_at: new Date().toISOString(),
        ip_hash: ipHash,
        user_agent: req.headers.get("user-agent") ?? "",
        referrer: req.headers.get("referer") ?? "",
      }),
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[view]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
