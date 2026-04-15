import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LinkArrow({ path, label, className = "" }) {
  if (!path) return null;

  return (
    <Link
      href={path}
      className={`inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold transition-colors duration-200 group ${className}`}>
      {label ?? "En savoir plus"}
      <ArrowRight
        size={14}
        className="transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden
      />
    </Link>
  );
}
