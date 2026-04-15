import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumb — fil d'Ariane visuel.
 *
 * Props:
 *   items     : { name: string, path?: string }[]
 *               Le dernier élément est la page courante (pas de lien).
 *   className : string — permet de surcharger la largeur max du conteneur
 *               (défaut : max-w-4xl, pour les pages détail).
 *               Passer ex. "max-w-6xl" pour les pages listing.
 */
export default function Breadcrumb({ items, className = "max-w-6xl" }) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Fil d'Ariane" className={`w-full ${className} mx-auto pt-8 pb-0`}>
      <ol className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 shrink-0 text-border" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className="text-foreground font-medium max-w-[200px] truncate">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-foreground transition-colors duration-200">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
