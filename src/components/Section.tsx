import { cn } from "@/lib/utils";
import type { Appearance } from "@/blocks/appearance";

const BG: Record<NonNullable<Appearance["background"]>, string> = {
  default: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  inverted: "bg-foreground text-background",
  branded: "bg-(--brand-primary) text-white",
};

const PAD_TOP: Record<NonNullable<Appearance["padding"]>, string> = {
  none: "pt-0",
  sm: "pt-8 md:pt-12",
  md: "pt-16 md:pt-20",
  lg: "pt-24 md:pt-32",
};

const PAD_BOTTOM: Record<NonNullable<Appearance["padding"]>, string> = {
  none: "pb-0",
  sm: "pb-8 md:pb-12",
  md: "pb-16 md:pb-20",
  lg: "pb-24 md:pb-32",
};

const INNER: Record<NonNullable<Appearance["maxWidth"]>, string> = {
  narrow: "max-w-2xl",
  normal: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-full",
};

const DIVIDER: Record<NonNullable<Appearance["divider"]>, string> = {
  none: "",
  top: "border-t border-border",
  bottom: "border-b border-border",
  both: "border-y border-border",
};

export function Section({
  appearance,
  children,
  className,
  innerClassName,
  as: Tag = "section",
}: {
  appearance?: Appearance | null;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  as?: "section" | "article" | "aside" | "header" | "footer" | "div";
}) {
  const a = appearance ?? {};
  const bg = BG[a.background ?? "default"];
  const padBase = a.padding ?? "md";
  const padTop = PAD_TOP[a.paddingTop ?? padBase];
  const padBottom = PAD_BOTTOM[a.paddingBottom ?? padBase];
  const inner = INNER[a.maxWidth ?? "normal"];
  const divider = DIVIDER[a.divider ?? "none"];

  return (
    <Tag className={cn(bg, padTop, padBottom, divider, className)}>
      <div className={cn("container mx-auto px-6", inner, innerClassName)}>
        {children}
      </div>
    </Tag>
  );
}
