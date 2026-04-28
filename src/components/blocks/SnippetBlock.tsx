import { payload } from "@/lib/payload";
import { RenderBlocks } from "./RenderBlocks";
import type { Snippet, Page } from "@/payload-types";
import type { Locale } from "@/lib/i18n";

type Layout = NonNullable<Page["layout"]>;

type Props = {
  snippet: number | Snippet;
  locale?: Locale;
};

export async function SnippetBlock({ snippet, locale = "fr" }: Props) {
  let resolved: Snippet | null = null;
  if (typeof snippet === "object" && snippet) {
    resolved = snippet;
  } else if (typeof snippet === "number") {
    const client = await payload();
    resolved = (await client
      .findByID({ collection: "snippets", id: snippet, locale, depth: 1 })
      .catch(() => null)) as Snippet | null;
  }
  if (!resolved?.layout) return null;
  return <RenderBlocks blocks={resolved.layout as Layout} locale={locale} />;
}
