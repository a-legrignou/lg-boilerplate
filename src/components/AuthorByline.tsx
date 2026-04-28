import Link from "next/link";
import Image from "next/image";
import type { User, Media } from "@/payload-types";
import { localizedPath, type Locale } from "@/lib/i18n";

export function AuthorByline({
  author,
  locale,
  date,
}: {
  author: User;
  locale: Locale;
  date?: string;
}) {
  const avatar = (author.avatar as Media | undefined)?.url;
  const href = author.slug
    ? localizedPath(`/auteur/${author.slug}`, locale)
    : null;

  const content = (
    <div className="flex items-center gap-3">
      {avatar ? (
        <Image
          src={avatar}
          alt={author.name || author.email}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <div className="size-10 rounded-full bg-muted" />
      )}
      <div className="text-sm">
        <div className="font-medium text-foreground">
          {author.name || author.email}
        </div>
        {date ? (
          <time dateTime={date} className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString(
              locale === "fr" ? "fr-FR" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </time>
        ) : null}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="inline-block hover:opacity-90">
      {content}
    </Link>
  ) : (
    content
  );
}
