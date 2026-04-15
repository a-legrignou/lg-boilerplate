"use client";

import LabelInfo from "./label-info";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function RadioCardGroup({
  value,
  onChange,
  options,
  label,
  info,
  className,
  inline = false,
  disabled = false,
}) {
  if (!options || options.length === 0) {
    return (
      <div className="text-red-700 text-sm flex flex-row items-center p-1 border border-red-700 rounded">
        <TriangleAlert className="mr-2" />
        Aucune donnée disponible
      </div>
    );
  }

  const current = value != null ? String(value) : "";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <LabelInfo label={label} info={info} />}

      <div
        className={cn(
          "flex",
          inline ? "flex-row flex-wrap gap-3" : "flex-col gap-2",
          disabled && "opacity-60 pointer-events-none"
        )}>
        {options.map((opt) => {
          if (!opt.label) return null;

          const selected = current === String(opt.value);

          return (
            <div
              key={String(opt.value)}
              onClick={() => !disabled && onChange(opt.value)}
              className={cn(
                "cursor-pointer py-1 px-3 rounded-sm border transition-all w-full sm:w-auto flex flex-row gap-3",
                selected ? "border-sky-600 bg-sky-600/10 shadow-sm" : "border-border-md hover:border-sky-400"
              )}>
              <div className="flex items-center justify-between gap-4">
                <div
                  className={cn(
                    "w-4 h-4 border rounded-full",
                    selected ? "bg-sky-600 border-sky-600" : "border-border-dk"
                  )}
                />
              </div>{" "}
              <h4 className="font-semibold">{opt.label}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}
