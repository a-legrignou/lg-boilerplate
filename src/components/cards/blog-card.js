import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Calendar, Clock } from "lucide-react";
import GenericImage from "@/components/widgets/generic-image";
import TierBadge from "@/components/widgets/tier-badge";

const assetBase = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "";

const BlogCard = ({ post, priority = false, userTier = "public" }) => {
  const postUrl = `/blog/${post.slug || post.id}`;

  const isLocked = post.tier === "premium" && userTier !== "premium";

  const imgSrc = post.image ? `${assetBase}${post.image}` : null;

  return (
    <Link
      href={postUrl}
      aria-label={`${post.title}${isLocked ? " — Contenu Premium" : ""}`}
      className="group h-full flex flex-col card-surface border hover:shadow-lg hover:shadow-navy/5 transition-all duration-500 overflow-hidden">
      {/* Image */}
      {imgSrc && (
        <div className="relative aspect-video overflow-hidden shrink-0">
          <GenericImage
            src={imgSrc}
            alt={post.title}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale-20 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-linear-to-t from-noir/50 to-transparent" />

          {/* Lock overlay — décoratif, info portée par aria-label du lien parent */}
          {isLocked && (
            <div aria-hidden="true" className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Lock className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-medium">
                  {post.tier === "premium" ? "Contenu Premium" : "Connexion requise"}
                </span>
              </div>
            </div>
          )}

          {/* Tier badge */}
          {post.tier && (
            <div className="absolute top-2 right-2">
              <TierBadge tier={post.tier} />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Eyebrow */}
        {post.category?.title && (
          <span className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-gold">
            {post.category.title}
          </span>
        )}

        {/* Titre */}
        <h3 className="font-serif text-xl text-t0 leading-snug transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-t2 leading-relaxed line-clamp-2">{post.excerpt}</p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-t2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              <span>{new Date(post.date_created).toLocaleDateString("fr-FR")}</span>
            </div>
            {post.readtime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>{post.readtime} min</span>
              </div>
            )}
          </div>

          <span className="card-cta inline-flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Lire
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
