import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import type { Appearance } from "@/blocks/appearance";

type Btn = {
  label: string;
  href: string;
  variant?: "default" | "secondary" | "outline" | null;
  id?: string | null;
};
type Variant = "centered" | "banner" | "card";
type Align = "left" | "center" | "right";

type Props = {
  variant?: Variant | null;
  textAlign?: Align | null;
  title: string;
  description?: string | null;
  buttons?: Btn[] | null;
  appearance?: Appearance | null;
};

export function CTABlock({
  variant,
  textAlign,
  title,
  description,
  buttons,
  appearance,
}: Props) {
  const v: Variant = variant ?? "centered";

  if (v === "banner") {
    return (
      <Section appearance={appearance}>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {buttons?.length ? (
            <div className="flex flex-wrap gap-3 shrink-0">
              {buttons.map((b, i) => (
                <Button
                  key={b.id ?? i}
                  size="lg"
                  variant={b.variant ?? "default"}
                  asChild
                >
                  <Link href={b.href}>{b.label}</Link>
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </Section>
    );
  }

  if (v === "card") {
    return (
      <Section appearance={appearance ?? { maxWidth: "narrow" }}>
        <div className="rounded-xl bg-(--brand-primary) p-10 text-white md:p-14">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 text-white/80">{description}</p>
            ) : null}
            {buttons?.length ? (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {buttons.map((b, i) => (
                  <Button key={b.id ?? i} size="lg" variant="secondary" asChild>
                    <Link href={b.href}>{b.label}</Link>
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Section>
    );
  }

  // centered (default)
  const align: Align = textAlign ?? "center";
  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";
  const justifyClass =
    align === "left"
      ? "justify-start"
      : align === "right"
        ? "justify-end"
        : "justify-center";

  return (
    <Section appearance={appearance ?? { maxWidth: "narrow" }}>
      <div className={alignClass}>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-muted-foreground">{description}</p>
        ) : null}
        {buttons?.length ? (
          <div className={`mt-8 flex flex-wrap gap-3 ${justifyClass}`}>
            {buttons.map((b, i) => (
              <Button
                key={b.id ?? i}
                size="lg"
                variant={b.variant ?? "default"}
                asChild
              >
                <Link href={b.href}>{b.label}</Link>
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
