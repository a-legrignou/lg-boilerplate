import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/payload-types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const cover =
    typeof post.cover === "object" && post.cover ? post.cover : null;
  const href = localizedPath(`/blog/${post.slug}`, locale);
  return (
    <Link href={href} className="block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {cover?.url ? (
          <div className="relative aspect-[16/9] bg-muted">
            <Image
              src={cover.url}
              alt={cover.alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <CardHeader>
          <CardTitle className="text-lg">{post.title}</CardTitle>
          {post.excerpt ? (
            <CardDescription className="line-clamp-2">
              {post.excerpt}
            </CardDescription>
          ) : null}
          <time
            dateTime={post.createdAt}
            className="mt-2 text-xs text-muted-foreground"
          >
            {new Date(post.createdAt).toLocaleDateString(
              locale === "fr" ? "fr-FR" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </time>
        </CardHeader>
      </Card>
    </Link>
  );
}
