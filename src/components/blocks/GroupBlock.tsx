import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";
import { isVisible } from "@/blocks/visibility";
import type { Page } from "@/payload-types";
import type { Appearance } from "@/blocks/appearance";
import type { Locale } from "@/lib/i18n";
import { HeroBlock } from "./HeroBlock";
import { FeaturesBlock } from "./FeaturesBlock";
import { CTABlock } from "./CTABlock";
import { RichTextBlock } from "./RichTextBlock";
import { LogoCloudBlock } from "./LogoCloudBlock";
import { PricingBlock } from "./PricingBlock";
import { TestimonialsBlock } from "./TestimonialsBlock";
import { FAQBlock } from "./FAQBlock";
import { StatsBlock } from "./StatsBlock";

type Layout = NonNullable<Page["layout"]>;
type AnyBlock = Layout[number];
type ChildBlock = Exclude<
  AnyBlock,
  { blockType: "group" | "snippet" | "form" }
>;

const COLS: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 md:grid-cols-2",
  "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};
const GAP: Record<string, string> = { sm: "gap-4", md: "gap-8", lg: "gap-14" };
const ALIGN: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  stretch: "items-stretch",
};

type Props = {
  columns?: "1" | "2" | "3" | "4" | null;
  gap?: "sm" | "md" | "lg" | null;
  align?: "start" | "center" | "stretch" | null;
  children: ChildBlock[];
  appearance?: Appearance | null;
  locale?: Locale;
};

function renderChild(block: ChildBlock) {
  switch (block.blockType) {
    case "hero":
      return <HeroBlock {...block} />;
    case "features":
      return <FeaturesBlock {...block} />;
    case "cta":
      return <CTABlock {...block} />;
    case "richText":
      return <RichTextBlock {...block} />;
    case "logoCloud":
      return <LogoCloudBlock {...block} />;
    case "pricing":
      return <PricingBlock {...block} />;
    case "testimonials":
      return <TestimonialsBlock {...block} />;
    case "faq":
      return <FAQBlock {...block} />;
    case "stats":
      return <StatsBlock {...block} />;
    default:
      return null;
  }
}

export function GroupBlock({
  columns,
  gap,
  align,
  children,
  appearance,
  locale = "fr",
}: Props) {
  const cols = COLS[columns ?? "2"];
  const gapClass = GAP[gap ?? "md"];
  const alignClass = ALIGN[align ?? "stretch"];
  const visible = children.filter((b) =>
    isVisible((b as { visibility?: never }).visibility, locale),
  );

  return (
    <Section appearance={appearance} innerClassName="px-0">
      <div className={cn("grid", cols, gapClass, alignClass)}>
        {visible.map((block, i) => (
          <div
            key={`${block.blockType}-${block.id ?? i}`}
            className={cn(
              "[&>section]:py-0",
              (block as { visibility?: { mobileHidden?: boolean | null } })
                .visibility?.mobileHidden && "hidden md:block",
            )}
          >
            {renderChild(block)}
          </div>
        ))}
      </div>
    </Section>
  );
}
