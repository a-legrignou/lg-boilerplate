import type { Page } from "@/payload-types";
import { isVisible } from "@/blocks/visibility";
import type { Locale } from "@/lib/i18n";
import { LiveEditOverlay } from "../LiveEditOverlay";
import { HeroBlock } from "./HeroBlock";
import { FeaturesBlock } from "./FeaturesBlock";
import { CTABlock } from "./CTABlock";
import { RichTextBlock } from "./RichTextBlock";
import { GroupBlock } from "./GroupBlock";
import { LogoCloudBlock } from "./LogoCloudBlock";
import { PricingBlock } from "./PricingBlock";
import { TestimonialsBlock } from "./TestimonialsBlock";
import { FAQBlock } from "./FAQBlock";
import { StatsBlock } from "./StatsBlock";
import { SnippetBlock } from "./SnippetBlock";
import { FormBlock } from "./FormBlock";
import { NewsletterBlock } from "./NewsletterBlock";

type Layout = NonNullable<Page["layout"]>;
type Block = Layout[number];

type RenderBlocksProps = {
  blocks: Layout | null | undefined;
  locale?: Locale;
  /** Si défini ET pageId présent, active l'overlay d'édition autour de chaque block. */
  pageId?: number | null;
  editable?: boolean;
};

export function RenderBlocks({
  blocks,
  locale = "fr",
  pageId = null,
  editable = false,
}: RenderBlocksProps) {
  if (!blocks?.length) return null;
  const total = blocks.length;
  const showOverlay = editable && typeof pageId === "number";

  return (
    <>
      {blocks.map((block: Block, i) => {
        if (!isVisible((block as { visibility?: never }).visibility, locale))
          return null;

        const key = `${block.blockType}-${block.id ?? i}`;
        const mobileHidden = (
          block as { visibility?: { mobileHidden?: boolean | null } }
        ).visibility?.mobileHidden;

        let rendered: React.ReactNode = null;
        switch (block.blockType) {
          case "hero":
            rendered = <HeroBlock {...block} />;
            break;
          case "features":
            rendered = <FeaturesBlock {...block} />;
            break;
          case "cta":
            rendered = <CTABlock {...block} />;
            break;
          case "richText":
            rendered = <RichTextBlock {...block} />;
            break;
          case "group":
            rendered = <GroupBlock {...block} locale={locale} />;
            break;
          case "logoCloud":
            rendered = <LogoCloudBlock {...block} />;
            break;
          case "pricing":
            rendered = <PricingBlock {...block} />;
            break;
          case "testimonials":
            rendered = <TestimonialsBlock {...block} />;
            break;
          case "faq":
            rendered = <FAQBlock {...block} />;
            break;
          case "stats":
            rendered = <StatsBlock {...block} />;
            break;
          case "snippet":
            rendered = <SnippetBlock {...block} locale={locale} />;
            break;
          case "form":
            rendered = <FormBlock {...block} />;
            break;
          case "newsletter":
            rendered = <NewsletterBlock {...block} />;
            break;
          default:
            return null;
        }

        const className = mobileHidden ? "hidden md:block" : undefined;
        const style: React.CSSProperties | undefined = showOverlay
          ? {
              position: "relative",
              outline: "1px dashed transparent",
              transition: "outline-color 0.15s",
            }
          : undefined;

        return (
          <div
            key={key}
            data-block-index={i}
            className={className}
            style={style}
          >
            {rendered}
            {showOverlay ? (
              <LiveEditOverlay
                pageId={pageId}
                index={i}
                total={total}
                locale={locale}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
}
