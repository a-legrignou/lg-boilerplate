import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import type { Media } from "@/payload-types";
import type { Appearance } from "@/blocks/appearance";

type Props = {
  variant?: "centered" | "split" | null;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  image?: (number | Media) | null;
  cta?: { label?: string | null; href?: string | null } | null;
  appearance?: Appearance | null;
};

export function HeroBlock({
  variant,
  eyebrow,
  title,
  subtitle,
  image,
  cta,
  appearance,
}: Props) {
  const img = typeof image === "object" && image ? image : null;
  const isSplit = variant === "split" && img?.url;

  return (
    <Section appearance={appearance}>
      {isSplit ? (
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            {eyebrow ? (
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
            {cta?.label && cta?.href ? (
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              </div>
            ) : null}
          </div>
          <div>
            <Image
              src={img.url!}
              alt={img.alt ?? ""}
              width={img.width ?? 1200}
              height={img.height ?? 800}
              className="rounded-lg border border-border"
            />
          </div>
        </div>
      ) : (
        <div className="text-center">
          {eyebrow ? (
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight md:text-6xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
          {cta?.label && cta?.href ? (
            <div className="mt-10 flex justify-center">
              <Button size="lg" asChild>
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            </div>
          ) : null}
          {img?.url ? (
            <div className="mt-12">
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                width={img.width ?? 1200}
                height={img.height ?? 600}
                className="mx-auto rounded-lg border border-border"
              />
            </div>
          ) : null}
        </div>
      )}
    </Section>
  );
}
