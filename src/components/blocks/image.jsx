import GenericImage from "@/components/widgets/generic-image";

const assetBase = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "";

/**
 * image — bloc image pleine largeur.
 *
 * Champs Directus :
 *   image   object|string   — asset Directus
 *   title   string          — texte alternatif (optionnel)
 */
export default function ImageBlock({ block }) {
  const imageId = block?.image?.id ?? block?.image;
  const imgSrc = imageId ? `${assetBase}${imageId}` : null;
  if (!imgSrc) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <GenericImage src={imgSrc} alt={block?.title ?? ""} className="object-cover w-full" />
    </div>
  );
}
