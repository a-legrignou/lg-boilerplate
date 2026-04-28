import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/structured-data";
import type { Appearance } from "@/blocks/appearance";

type Item = { question: string; answer: string; id?: string | null };
type Props = {
  heading?: string | null;
  items?: Item[] | null;
  appearance?: Appearance | null;
};

export function FAQBlock({ heading, items, appearance }: Props) {
  if (!items?.length) return null;
  return (
    <Section appearance={appearance ?? { maxWidth: "narrow" }}>
      <JsonLd data={faqSchema(items)} />
      {heading ? (
        <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
      ) : null}
      <div className="mt-8 space-y-2">
        {items.map((item, i) => (
          <details
            key={item.id ?? i}
            className="group rounded-lg border border-border bg-card px-5 py-4 transition open:bg-card/80"
          >
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 whitespace-pre-line text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
