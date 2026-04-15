// src/lib/controllers/posts.js
import { createItem, updateItem } from "@directus/sdk";
import { createHash } from "crypto";
import { directusAdmin } from "@/lib/utils/directus";

export async function trackPostView(postId, { ip = "unknown", userAgent = "", referrer = "" } = {}) {
  const ipHash = createHash("sha256").update(ip).digest("hex");

  try {
    // Incrément et log en parallèle — pas de read-then-write (race condition)
    await Promise.all([
      directusAdmin.request(
        // $formula : incrément atomique côté Directus sans read préalable
        updateItem("posts", postId, { views: { $formula: "{{views}} + 1" } }),
      ),
      directusAdmin.request(
        createItem("post_views", {
          post:       postId,
          viewed_at:  new Date().toISOString(),
          ip_hash:    ipHash,
          user_agent: userAgent,
          referrer,
        }),
      ),
    ]);
  } catch (err) {
    console.error("[trackPostView]", err);
  }
}
