import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section } from "@/components/Section";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Appearance } from "@/blocks/appearance";

type Item = {
  icon?: string | null;
  title: string;
  description?: string | null;
  id?: string | null;
};
type Variant = "grid" | "grid-4" | "list" | "cards";
type Props = {
  variant?: Variant | null;
  heading?: string | null;
  intro?: string | null;
  items?: Item[] | null;
  appearance?: Appearance | null;
};

const resolveIcon = (name?: string | null): LucideIcon | null =>
  name
    ? ((Icons as unknown as Record<string, LucideIcon>)[name] ?? null)
    : null;

export function FeaturesBlock({
  variant,
  heading,
  intro,
  items,
  appearance,
}: Props) {
  if (!items?.length) return null;
  const v: Variant = variant ?? "grid";

  return (
    <Section appearance={appearance}>
      {heading ? (
        <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
      ) : null}
      {intro ? (
        <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>
      ) : null}

      {v === "list" ? (
        <ul className="mt-8 space-y-6 max-w-2xl">
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            return (
              <li key={item.id ?? i} className="flex gap-4">
                {Icon ? (
                  <Icon className="size-5 mt-1 shrink-0 text-(--brand-primary)" />
                ) : (
                  <span className="size-5 mt-1 shrink-0 rounded-full bg-muted" />
                )}
                <div>
                  <div className="font-medium text-foreground">
                    {item.title}
                  </div>
                  {item.description ? (
                    <p className="mt-1 text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : v === "cards" ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            return (
              <Card key={item.id ?? i} className="border-2">
                <CardHeader>
                  {Icon ? (
                    <div className="mb-2 inline-flex size-10 items-center justify-center rounded-lg bg-(--brand-primary)/10">
                      <Icon className="size-5 text-(--brand-primary)" />
                    </div>
                  ) : null}
                  <CardTitle>{item.title}</CardTitle>
                  {item.description ? (
                    <CardDescription>{item.description}</CardDescription>
                  ) : null}
                </CardHeader>
              </Card>
            );
          })}
        </div>
      ) : (
        <div
          className={`mt-8 grid gap-4 ${v === "grid-4" ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}
        >
          {items.map((item, i) => {
            const Icon = resolveIcon(item.icon);
            return (
              <Card key={item.id ?? i}>
                <CardHeader>
                  {Icon ? (
                    <Icon className="size-5 text-muted-foreground" />
                  ) : null}
                  <CardTitle>{item.title}</CardTitle>
                  {item.description ? (
                    <CardDescription>{item.description}</CardDescription>
                  ) : null}
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </Section>
  );
}
