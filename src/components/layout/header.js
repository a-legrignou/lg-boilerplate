import { ArrowDown } from "lucide-react";
import GenericImage from "../widgets/generic-image";
import MotionWrapper from "../widgets/motion-wrapper";
import { Beamlines } from "@/components/widgets/beamlines";
import { CTAButton } from "@/components/ui/cta-button";

export default function HeaderLayout({ title, subtitle, image, description, actions = [], home = false }) {
  if (!home) {
    return (
      <header className="relative w-full overflow-hidden min-h-[42vh] flex items-end">
        {/* Image de fond */}
        {image && (
          <div className="absolute inset-0" aria-hidden="true">
            <GenericImage src={image} alt={title} priority className="object-cover object-center" />
          </div>
        )}

        {/* Overlay de base — filtre minimal sur toute l'image */}
        <div className="absolute inset-0 bg-navy/30" aria-hidden="true" />
        {/* Gradient depuis le bas — renforce la lisibilité du texte */}
        <div className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/30 to-transparent" aria-hidden="true" />

        {/* Ligne décorative gold */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/30" aria-hidden="true" />

        {/* Contenu aligné à gauche, ancré en bas */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 xl:px-16 pb-12 pt-20 flex flex-col gap-3">
          {subtitle && (
            <span className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-gold">{subtitle}</span>
          )}
          <h1 className="font-serif text-4xl sm:text-5xl text-tw font-normal leading-tight max-w-2xl">{title}</h1>
          {description && <p className="text-tw/60 text-sm leading-relaxed max-w-lg mt-1">{description}</p>}
        </div>
      </header>
    );
  }

  return (
    <header className="relative w-full overflow-hidden min-h-svh flex items-center px-8">
      {/* Background image */}
      <div className="absolute inset-0" aria-hidden="true">
        <GenericImage src={image} alt={title} priority className="object-cover object-left" />
      </div>

      <Beamlines aria-hidden="true" />

      {/* Overlay */}

      <div
        className="absolute inset-0 bg-linear-to-br from-background via-background/10 to-background/0 dark:bg-linear-to-br dark:from-black/80 dark:via-black/40 dark:to-black/30 "
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto lg:ml-12 w-50 sm:w-full text-center lg:text-left lg:items-start max-w-xl space-y-6 flex flex-col">
        <h1 className="text-5xl sm:text-5xl md:text-6xl font-extrabold text-foreground">{title}</h1>
        {subtitle && <span className="text-t1 text-2xl">{subtitle}</span>}
        {actions.length > 0 && (
          <MotionWrapper delay={0.8} duration={1} className="flex flex-wrap gap-4">
            {actions.map((action, i) => (
              <CTAButton key={i} href={action.href} label={action.label} variant={action.variant} />
            ))}
          </MotionWrapper>
        )}
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce text-black dark:text-white"
        aria-hidden="true">
        <span className="text-xs uppercase tracking-[0.2em]">Découvrir</span>
        <ArrowDown className="w-4 h-4" />
      </div>
    </header>
  );
}
