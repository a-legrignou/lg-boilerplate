import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";
import { revalidatePath } from "next/cache";

const safeRevalidate = (fn: () => void) => {
  try {
    fn();
  } catch {
    // Outside the Next runtime (CLI migrations) — ignore.
  }
};

export const revalidatePage: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req,
}) => {
  const slug = (doc as { slug?: string }).slug;
  const prevSlug = (previousDoc as { slug?: string } | undefined)?.slug;
  const locale = (req as { locale?: string }).locale ?? "fr";
  const prefix = locale === "fr" ? "" : `/${locale}`;

  safeRevalidate(() => {
    if (slug) {
      const path = slug === "home" ? prefix || "/" : `${prefix}/${slug}`;
      revalidatePath(path);
    }
    if (prevSlug && prevSlug !== slug) {
      const path =
        prevSlug === "home" ? prefix || "/" : `${prefix}/${prevSlug}`;
      revalidatePath(path);
    }
    revalidatePath("/sitemap.xml");
  });

  return doc;
};

export const revalidatePost: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req,
}) => {
  const slug = (doc as { slug?: string }).slug;
  const prevSlug = (previousDoc as { slug?: string } | undefined)?.slug;
  const locale = (req as { locale?: string }).locale ?? "fr";
  const prefix = locale === "fr" ? "" : `/${locale}`;

  safeRevalidate(() => {
    if (slug) revalidatePath(`${prefix}/blog/${slug}`);
    if (prevSlug && prevSlug !== slug)
      revalidatePath(`${prefix}/blog/${prevSlug}`);
    revalidatePath(`${prefix}/blog`);
    revalidatePath(`${prefix}/rss.xml`);
    revalidatePath("/sitemap.xml");
  });

  return doc;
};

export const revalidateOnDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  const slug = (doc as { slug?: string }).slug;
  const locale = (req as { locale?: string }).locale ?? "fr";
  const prefix = locale === "fr" ? "" : `/${locale}`;

  safeRevalidate(() => {
    if (slug) revalidatePath(`${prefix}/${slug}`);
    revalidatePath("/sitemap.xml");
  });

  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidate(() => {
    revalidatePath("/", "layout");
  });
  return doc;
};
