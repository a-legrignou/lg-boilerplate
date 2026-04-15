import GenericImage from "@/components/widgets/generic-image";
import TitleSection from "@/components/widgets/title-section";
import SmartLink from "@/components/ui/smart-link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const assetBase = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "";

export default function Teaser({ section, tone = "light" }) {
  const imageId = section?.image?.id ?? section?.image;
  const imgSrc = imageId ? `${assetBase}${imageId}` : null;

  return (
    <section className="relative max-w-7xl mx-auto w-full px-6 py-20">
      <div className={imgSrc ? "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" : ""}>
        {imgSrc && (
          <div className="relative h-full min-h-80 overflow-hidden ring-1 ring-white/6">
            <GenericImage
              src={imgSrc}
              alt={section?.title ?? ""}
              className="object-cover absolute inset-0 w-full h-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="flex flex-col gap-6">
          <TitleSection title={section?.title} subtitle={section?.subtitle} description={section?.description} tone={tone} />
          {section?.cta?.length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              {section.cta.map((cta, i) => (
                <SmartLink
                  key={i}
                  href={cta.path}
                  className={cn(
                    "inline-flex items-center gap-2 px-7 py-3 font-medium text-sm transition-all duration-300",
                    i === 0
                      ? "bg-gold text-noir hover:bg-gold/90"
                      : tone === "dark" || tone === "navy"
                        ? "border border-tw/30 text-tw hover:border-tw hover:bg-tw/5"
                        : "border border-border-dk text-t0 hover:border-navy hover:bg-navy/5",
                  )}>
                  {cta.label}
                  {i === 0 && <ArrowRight size={15} aria-hidden />}
                </SmartLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
