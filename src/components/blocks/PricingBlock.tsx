import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Appearance } from "@/blocks/appearance";

type Tier = {
  name: string;
  price: string;
  period?: string | null;
  description?: string | null;
  features?: { label: string; id?: string | null }[] | null;
  cta?: { label?: string | null; href?: string | null } | null;
  highlighted?: boolean | null;
  id?: string | null;
};

type Props = {
  heading?: string | null;
  intro?: string | null;
  tiers?: Tier[] | null;
  appearance?: Appearance | null;
};

export function PricingBlock({ heading, intro, tiers, appearance }: Props) {
  if (!tiers?.length) return null;
  const cols =
    tiers.length === 4
      ? "lg:grid-cols-4"
      : tiers.length === 3
        ? "md:grid-cols-3"
        : tiers.length === 2
          ? "md:grid-cols-2"
          : "grid-cols-1";

  return (
    <Section appearance={appearance}>
      {heading ? (
        <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
          {heading}
        </h2>
      ) : null}
      {intro ? (
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          {intro}
        </p>
      ) : null}
      <div className={cn("mt-10 grid grid-cols-1 gap-6", cols)}>
        {tiers.map((tier, i) => (
          <Card
            key={tier.id ?? i}
            className={cn(
              "flex flex-col",
              tier.highlighted &&
                "border-(--brand-primary) shadow-lg ring-1 ring-(--brand-primary)",
            )}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {tier.price}
                </span>
                {tier.period ? (
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                ) : null}
              </div>
              {tier.description ? (
                <CardDescription>{tier.description}</CardDescription>
              ) : null}
            </CardHeader>
            {tier.features?.length ? (
              <ul className="flex-1 space-y-3 px-6 pb-6 text-sm">
                {tier.features.map((f, j) => (
                  <li key={f.id ?? j} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-(--brand-primary)" />
                    <span>{f.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {tier.cta?.label && tier.cta?.href ? (
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={tier.cta.href}>{tier.cta.label}</Link>
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </div>
    </Section>
  );
}
