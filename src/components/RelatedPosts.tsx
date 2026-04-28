import type { Post } from "@/payload-types";
import type { Locale } from "@/lib/i18n";
import { PostCard } from "./PostCard";

export function RelatedPosts({
  posts,
  locale,
}: {
  posts: Post[];
  locale: Locale;
}) {
  if (!posts.length) return null;
  return (
    <section className="mt-20 border-t border-border pt-12">
      <h2 className="text-xl font-semibold tracking-tight">
        {locale === "fr" ? "Articles liés" : "Related posts"}
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
