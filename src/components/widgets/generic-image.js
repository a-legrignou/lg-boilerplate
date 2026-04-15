import Image from "next/image";

export default function GenericImage({ src, alt, className = "z-0", priority = false, sizes = "100vw" }) {
  if (!src || !alt) return null;
  const isSvg = typeof src === "string" && src.toLowerCase().endsWith(".svg");
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      fetchPriority={priority ? "high" : "auto"}
      unoptimized={isSvg}
      className={className}
    />
  );
}
