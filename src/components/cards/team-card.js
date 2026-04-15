import Image from "next/image";
import { Globe, Linkedin as LinkedinIcon } from "lucide-react";

const assetBase = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "";

export default function TeamCard({ block, type = "team" }) {
  const imageId = block?.image?.id ?? block?.image;
  const imgSrc = imageId ? `${assetBase}${imageId}` : "/default-avatar.png";

  return (
    <div className="group relative overflow-hidden card-surface border hover:border-navy/30 transition-all duration-300">
      {/* Photo */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={block?.title ?? ""}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale-20 group-hover:grayscale-0"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      {/* Infos */}
      <div className="px-4 py-3 text-center">
        <p className="font-serif text-base font-medium text-t0">{block?.title}</p>
        {block?.subtitle && <p className="text-xs text-t2 mt-0.5">{block.subtitle}</p>}
      </div>

      {/* Lien externe (LinkedIn ou site) */}
      {block?.path && (
        <a
          href={block.path}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={type === "team" ? "LinkedIn" : "Site web"}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center card-surface border text-t2 hover:text-navy hover:border-navy transition-all duration-200">
          {type === "team" ? <LinkedinIcon size={14} strokeWidth={1.5} /> : <Globe size={14} strokeWidth={1.5} />}
        </a>
      )}
    </div>
  );
}
