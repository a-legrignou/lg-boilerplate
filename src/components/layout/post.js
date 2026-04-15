import Link from "next/link";
import { Calendar, Clock, User, Tag, Crown, ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";
import GenericImage from "@/components/widgets/generic-image";
import TierBadge from "@/components/widgets/tier-badge";
import BadgeIcon from "@/components/widgets/badge-icon";
import BlogCard from "@/components/cards/blog-card";
import PdfDownloadButton from "@/components/widgets/pdf-download-button";
import { slugify } from "@/lib/utils/string";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Paywall gate ─────────────────────────────────────────────────────────────

function PaywallGate({ locale = "fr" }) {
  return (
    <div className="relative mt-10">
      {/* Fade overlay */}
      <div
        className="absolute -top-24 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
        aria-hidden="true"
      />

      {/* Gate card */}
      <div className="border border-border bg-muted px-8 py-10 text-center space-y-5">
        <div className="flex justify-center">
          <Crown className="w-8 h-8 text-gold" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">Contenu réservé aux membres Premium</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Accédez à l&apos;intégralité de cet article et à tous nos contenus exclusifs en passant Premium.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gold text-gold text-sm font-medium hover:bg-gold/10 transition">
            <Crown className="w-4 h-4" aria-hidden="true" />
            Devenir Premium
          </Link>
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-border text-t2 text-sm font-medium hover:bg-muted transition">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export default function PostLayout({ post, relatedPosts = [], locked = false, locale = "fr" }) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const shareUrl = `${origin}/${locale}/blog/${post.slug || post.id}`;
  const authorName = Array.isArray(post.authors) && post.authors.length > 0
    ? post.authors.map(a => a.post_authors_id?.name).filter(Boolean).join(" | ")
    : null;
  const authorRole = Array.isArray(post.authors) && post.authors.length === 1
    ? post.authors[0]?.post_authors_id?.role || null
    : null;

  return (
    <div className="flex flex-col">
      {/* ARTICLE */}
      <article className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-14 space-y-6 md:space-y-8">
        {/* Retour + Export PDF */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm text-t2 hover:text-t0 transition-colors duration-200">
            <ArrowLeft size={14} />
            Retour aux analyses
          </Link>
          {!locked && (
            <PdfDownloadButton
              slug={post.slug || post.id}
              endpoint={`/api/blog/${post.slug || post.id}/pdf`}
              filename={`article_${post.slug || post.id}.pdf`}
            />
          )}
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2">
          {post.category?.title && <BadgeIcon label={post.category.title} icon={Tag} variant="navy" />}
          {post.date_created && (
            <BadgeIcon
              label={new Date(post.date_created).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              icon={Calendar}
            />
          )}
          {post.readtime && <BadgeIcon label={`${post.readtime} min`} icon={Clock} />}
          {authorName && <BadgeIcon label={authorRole ? `${authorName} · ${authorRole}` : authorName} icon={User} />}
          {post.tier && <TierBadge tier={post.tier} />}
        </div>

        {/* Intro/Excerpt — always visible (important for SEO) */}
        {post.excerpt && (
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground border-l-2 bg-muted border-primary p-3 md:p-4">
            {post.excerpt}
          </p>
        )}

        {/* Content — gated when locked */}
        <section className="space-y-6 md:space-y-8 border-t pt-6 md:pt-10">
          {locked ? (
            <>
              {post.blocks?.slice(0, 1).map((block, index) => {
                if (block.type !== "text") return null;
                return (
                  <div key={index} className="space-y-3">
                    {block.title && <h2 className="text-xl md:text-2xl font-semibold scroll-mt-32">{block.title}</h2>}
                    <div className="prose prose-sm md:prose-base text-justify max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:underline line-clamp-6">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
                    </div>
                  </div>
                );
              })}
              <PaywallGate locale={locale} />
            </>
          ) : (
            post.blocks?.map((block, index) => {
              switch (block.type) {
                case "text":
                  return (
                    <div key={index} className="space-y-3">
                      {block.title && <h2 className="text-xl md:text-2xl font-semibold scroll-mt-32">{block.title}</h2>}
                      <div className="prose prose-sm md:prose-base text-justify max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:underline">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
                      </div>
                    </div>
                  );

                case "heading":
                  const id = slugify(block.content || block.title);
                  return (
                    <h2
                      id={id}
                      key={index}
                      className="text-xl md:text-2xl lg:text-3xl font-semibold mt-8 md:mt-14 scroll-mt-32">
                      {block.title || block.content}
                    </h2>
                  );

                case "quote":
                  return (
                    <blockquote key={index} className="text-sm px-4 md:px-8 text-center text-muted-foreground italic">
                      {block.caption}
                    </blockquote>
                  );

                case "image":
                  return (
                    <figure key={index} className="space-y-2 md:space-y-3 my-6 md:my-8 -mx-4 md:mx-0">
                      <div className="relative w-full aspect-video rounded-none md:rounded-xl overflow-hidden">
                        <GenericImage
                          src={process.env.NEXT_PUBLIC_DIRECTUS_ASSETS + block.image}
                          alt={block.caption || "Image de l'article"}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="text-xs md:text-sm text-center text-muted-foreground italic px-4 md:px-0">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );

                case "cta": {
                  return (
                    <div
                      key={index}
                      className="border border-border border-l-4 border-l-navy bg-cd px-8 py-7 space-y-4">
                      {block.title && <p className="font-serif text-xl text-t0">{block.title}</p>}
                      {block.text && <p className="text-sm text-t1 leading-relaxed">{block.text}</p>}
                      {block.path && block.label && (
                        <Link
                          href={block.path}
                          className="inline-flex items-center gap-2 text-sm font-medium text-navy border border-navy px-5 py-2.5 hover:bg-navy hover:text-white transition-colors duration-200">
                          {block.label}
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  );
                }

                case "exemple":
                  return (
                    <div key={index} className="border-l-2 border-border pl-4 md:pl-5">
                      {block.title && (
                        <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground/60 mb-1.5">
                          {block.title}
                        </p>
                      )}
                      <div className="prose prose-sm max-w-none italic text-muted-foreground dark:prose-invert prose-p:my-2 prose-p:text-justify">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })
          )}
        </section>

        {/* Sources */}
        {Array.isArray(post.sources) && post.sources.length > 0 && (
          <aside className="border-t border-border pt-6 space-y-3">
            <p className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-gold">Sources</p>
            <ol className="space-y-2">
              {post.sources.map((source, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="shrink-0 text-xs text-gold/60 mt-0.5 w-4 text-right">{i + 1}.</span>
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    {source.organisation && (
                      <span className="text-[0.65rem] font-medium tracking-wide uppercase text-t2 border border-border px-1.5 py-px leading-none">
                        {source.organisation}
                      </span>
                    )}
                    {source.path ? (
                      <a
                        href={source.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors underline underline-offset-2">
                        {source.reference}
                        <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                      </a>
                    ) : (
                      <span>{source.reference}</span>
                    )}
                    {source.date && (
                      <span className="text-xs text-muted-foreground/60">{source.date}</span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        )}

        {/* Share — only when content is fully accessible */}
        {!locked && (
          <div className="pt-6 md:pt-10 border-t space-y-3 md:space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Partager cet article</p>
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3">
              {/* LinkedIn */}
              <Link
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Partager sur LinkedIn (nouvel onglet)"
                className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 border border-[#0A66C2] text-[#0A66C2] rounded-lg hover:bg-[#0A66C2] hover:text-white transition text-xs md:text-sm">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span aria-hidden="true">LinkedIn</span>
              </Link>

              {/* Twitter */}
              <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Partager sur Twitter / X (nouvel onglet)"
                className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 border border-[#1DA1F2] text-[#1DA1F2] rounded-lg hover:bg-[#1DA1F2] hover:text-white transition text-xs md:text-sm">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span aria-hidden="true">Twitter</span>
              </Link>

              {/* Facebook */}
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Partager sur Facebook (nouvel onglet)"
                className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 border border-[#1877F2] text-[#1877F2] rounded-lg hover:bg-[#1877F2] hover:text-white transition text-xs md:text-sm">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span aria-hidden="true">Facebook</span>
              </Link>

              {/* WhatsApp */}
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Partager sur WhatsApp (nouvel onglet)"
                className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 border border-[#25D366] text-[#25D366] rounded-lg hover:bg-[#25D366] hover:text-white transition text-xs md:text-sm">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span aria-hidden="true">WhatsApp</span>
              </Link>

              {/* Email */}
              <Link
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Découvrez cet article : ${shareUrl}`)}`}
                aria-label="Partager par e-mail"
                className="col-span-2 md:col-span-1 inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 border border-muted-foreground text-muted-foreground rounded-lg hover:bg-muted transition text-xs md:text-sm">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 md:w-5 md:h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span aria-hidden="true">Email</span>
              </Link>
            </div>
          </div>
        )}
      </article>

      {/* Articles similaires */}
      {relatedPosts?.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 md:px-6 mt-12 md:mt-20 py-8 md:py-14">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 md:mb-8">Articles similaires</h2>

          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((item) => (
              <BlogCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
