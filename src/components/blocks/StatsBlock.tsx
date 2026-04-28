import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";
import type { Appearance } from "@/blocks/appearance";

type Item = {
  value: string;
  label: string;
  suffix?: string | null;
  id?: string | null;
};
type Props = {
  heading?: string | null;
  intro?: string | null;
  items?: Item[] | null;
  appearance?: Appearance | null;
};

export function StatsBlock({ heading, intro, items, appearance }: Props) {
  if (!items?.length) return null;
  const cols =
    items.length >= 4
      ? "grid-cols-2 md:grid-cols-4"
      : items.length === 3
        ? "grid-cols-1 md:grid-cols-3"
        : items.length === 2
          ? "grid-cols-2"
          : "grid-cols-1";

  return (
    <Section appearance={appearance}>
      {heading ? (
        <h2 className="text-center text-3xl font-semibold tracking-tight">
          {heading}
        </h2>
      ) : null}
      {intro ? (
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          {intro}
        </p>
      ) : null}
      <div className={cn("mt-10 grid gap-8 text-center", cols)}>
        {items.map((item, i) => (
          <div key={item.id ?? i}>
            <div className="text-4xl font-semibold tracking-tight md:text-5xl text-(--brand-primary)">
              {item.value}
            </div>
            {item.suffix ? (
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {item.suffix}
              </div>
            ) : null}
            <div className="mt-2 text-sm text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
