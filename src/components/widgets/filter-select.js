"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

/**
 * FilterSelect — dropdown de filtre stylisé.
 *
 * Props:
 *   options     : { value: string, label: string, Icon?: ComponentType }[]
 *   value       : string (valeur active)
 *   onChange    : (value: string) => void
 *   placeholder : string (label affiché par défaut)
 */
export default function FilterSelect({ options, value, onChange, placeholder }) {
  const isActive = value !== "all";

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={placeholder}
        className={cn(
          "h-auto w-auto min-w-36 gap-2 rounded-none px-4 py-2 text-sm font-medium shadow-none transition-colors focus:ring-2 focus:ring-navy/40 focus:ring-offset-1",
          isActive
            ? "border-gold text-gold bg-gold/5 hover:bg-gold/10"
            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
        )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="rounded-none border-border shadow-md">
        {options.map(({ value: v, label, Icon }) => (
          <SelectItem
            key={v}
            value={v}
            className={cn(
              "cursor-pointer rounded-none text-sm py-2 pr-8 pl-3",
              "focus:bg-navy/5 focus:text-foreground",
              v === value && "text-gold font-medium"
            )}>
            <span className="flex items-center gap-2">
              {Icon && (
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    v === value ? "text-gold" : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
              )}
              {label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
