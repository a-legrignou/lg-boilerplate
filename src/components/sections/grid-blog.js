"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "@/components/cards/blog-card";
import { BLOG_TIER_FILTERS } from "@/lib/constants/filters";

export default function GridBlog({ posts, userTier = "public", currentPage = 1, totalPages = 1, currentTier = "all" }) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const buildUrl = (page, tier) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) params.set("page", String(page)); else params.delete("page");
    if (tier && tier !== "all") params.set("tier", tier); else params.delete("tier");
    const qs = params.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  };

  const handleTier = (tier) => {
    router.push(buildUrl(1, tier));
  };

  if (!posts?.length && currentPage === 1) return null;

  return (
    <section className="max-w-6xl mx-auto w-full px-6 py-20">

      {/* Filtre par tier */}
      <div className="flex items-center gap-2 mb-10 border-b border-border pb-4 flex-wrap">
        {BLOG_TIER_FILTERS.map(({ value, label, Icon }) => {
          const isActive = currentTier === value;
          return (
            <button
              key={value}
              onClick={() => handleTier(value)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium transition-colors
                ${isActive
                  ? "text-foreground border-b-2 border-foreground -mb-px"
                  : "text-muted-foreground hover:text-foreground"
                }`}>
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Grille */}
      {posts.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-10">
          Aucun article dans cette catégorie.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <BlogCard
                key={post.id ?? i}
                post={post}
                priority={currentPage === 1 && i < 3}
                userTier={userTier}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination des articles" className="flex items-center justify-center gap-2 mt-14">
              <Link
                href={buildUrl(Math.max(1, currentPage - 1), currentTier)}
                aria-label="Page précédente"
                aria-disabled={currentPage === 1}
                className={`flex items-center justify-center w-9 h-9 border border-border text-t2 hover:border-navy hover:text-navy transition-colors ${currentPage === 1 ? "pointer-events-none opacity-30" : ""}`}>
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildUrl(p, currentTier)}
                  aria-label={`Page ${p}`}
                  aria-current={p === currentPage ? "page" : undefined}
                  className={`w-9 h-9 text-sm font-medium border transition-colors flex items-center justify-center
                    ${p === currentPage
                      ? "border-navy bg-navy text-white"
                      : "border-border text-t2 hover:border-navy hover:text-navy"
                    }`}>
                  {p}
                </Link>
              ))}

              <Link
                href={buildUrl(Math.min(totalPages, currentPage + 1), currentTier)}
                aria-label="Page suivante"
                aria-disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-9 h-9 border border-border text-t2 hover:border-navy hover:text-navy transition-colors ${currentPage === totalPages ? "pointer-events-none opacity-30" : ""}`}>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
