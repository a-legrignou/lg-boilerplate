import Image from "next/image";
import { Section } from "@/components/Section";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Media } from "@/payload-types";
import type { Appearance } from "@/blocks/appearance";

type Item = {
  quote: string;
  authorName: string;
  authorRole?: string | null;
  avatar?: (number | Media) | null;
  id?: string | null;
};

type Props = {
  heading?: string | null;
  columns?: "1" | "2" | "3" | null;
  items?: Item[] | null;
  appearance?: Appearance | null;
};

const COLS: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 md:grid-cols-2",
  "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

export function TestimonialsBlock({
  heading,
  columns,
  items,
  appearance,
}: Props) {
  if (!items?.length) return null;
  return (
    <Section appearance={appearance}>
      {heading ? (
        <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
      ) : null}
      <div className={cn("mt-8 grid gap-4", COLS[columns ?? "3"])}>
        {items.map((item, i) => {
          const avatar =
            typeof item.avatar === "object" && item.avatar ? item.avatar : null;
          return (
            <Card key={item.id ?? i}>
              <CardContent className="pt-6">
                <p className="text-pretty">&ldquo;{item.quote}&rdquo;</p>
              </CardContent>
              <CardFooter className="flex items-center gap-3">
                {avatar?.url ? (
                  <Image
                    src={avatar.url}
                    alt={avatar.alt ?? item.authorName}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-medium">{item.authorName}</p>
                  {item.authorRole ? (
                    <p className="text-xs text-muted-foreground">
                      {item.authorRole}
                    </p>
                  ) : null}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
