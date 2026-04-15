/**
 * Areas — Secteurs d'activité + couverture géographique
 *
 * section.title / subtitle / description → en-tête
 * section.image                          → fond de la carte
 * section.blocks (type "area-card")      → badges secteurs (item.title + item.icon)
 */

import TitleSection from "@/components/widgets/title-section";
import { DynamicIcon } from "@/components/widgets/dynamic-icons";
import { assetUrl } from "@/lib/utils/assets";

export default function Areas({ section }) {
  const sectors = (section?.blocks ?? []).map((b) => b?.item).filter((item) => item?.title);
  const mapSrc = assetUrl(section?.image?.id ?? section?.image, null);

  return (
    <section aria-labelledby="areas-heading" className="w-full">
      <style>{`
        @keyframes city-ping {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(2.8); opacity: 0;   }
          100% { transform: scale(2.8); opacity: 0;   }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] divide-y lg:divide-y-0 lg:divide-x divide-border items-start">
          {/* Secteurs */}

          <div className="pb-14 lg:pb-0 lg:pr-14 flex flex-col justify-center gap-6">
            {(section?.title || section?.subtitle) && (
              <TitleSection
                subtitle={section.subtitle}
                title={section.title}
                description={section.description}
                className="mb-14"
              />
            )}
            {sectors.length > 0 && (
              <>
                <div role="list" aria-label="Secteurs d'activité" className="flex flex-wrap gap-2">
                  {sectors.map((item) => (
                    <span
                      key={item.title}
                      role="listitem"
                      className="inline-flex items-center gap-2 px-3 py-1 border text-xs font-medium tracking-wide bg-navy/8 text-navy border-navy/50">
                      {item.icon && <DynamicIcon name={item.icon} size={13} strokeWidth={2} aria-hidden="true" />}
                      {item.title}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Carte */}
          <div className="pt-14 lg:pt-0 lg:pl-14 flex flex-col gap-5">
            {mapSrc && (
              <div className="relative w-full px-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mapSrc} alt="" aria-hidden="true" className="w-full h-auto saturate-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
