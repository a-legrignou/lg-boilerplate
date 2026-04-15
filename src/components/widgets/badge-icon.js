import { cn } from "@/lib/utils/cn";

const VARIANTS = {
  gold: "bg-gold/10 text-gold border-gold",
  sage: "bg-sage/10 text-sage border-sage",
  navy: "bg-navy/8 text-navy border-navy/50",
  default: "bg-cl text-t2 border-border",
};

export default function BadgeIcon({ label, icon: Icon, variant = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 border text-xs font-medium tracking-wide",
        VARIANTS[variant] ?? VARIANTS.default,
        className,
      )}>
      {Icon && <Icon size={13} strokeWidth={2} />}
      {label}
    </span>
  );
}
