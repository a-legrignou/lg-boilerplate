import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/Section";
import type { Media } from "@/payload-types";
import type { Appearance } from "@/blocks/appearance";

type Logo = {
  logo: number | Media;
  name: string;
  href?: string | null;
  id?: string | null;
};
type Props = {
  heading?: string | null;
  logos?: Logo[] | null;
  appearance?: Appearance | null;
};

export function LogoCloudBlock({ heading, logos, appearance }: Props) {
  if (!logos?.length) return null;
  return (
    <Section appearance={appearance ?? { padding: "sm" }}>
      {heading ? (
        <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {heading}
        </p>
      ) : null}
      <div className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {logos.map((item, i) => {
          const m = typeof item.logo === "object" ? item.logo : null;
          if (!m?.url) return null;
          const img = (
            <Image
              src={m.url}
              alt={m.alt || item.name}
              width={m.width ?? 160}
              height={m.height ?? 60}
              className="mx-auto h-10 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
              title={item.name}
            />
          );
          return item.href ? (
            <Link
              key={item.id ?? i}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {img}
            </Link>
          ) : (
            <div key={item.id ?? i}>{img}</div>
          );
        })}
      </div>
    </Section>
  );
}
