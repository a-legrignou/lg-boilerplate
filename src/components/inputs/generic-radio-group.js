"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LabelInfo from "./label-info";
import { TriangleAlert } from "lucide-react";

export default function GenericRadioGroup({
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

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      {label && <LabelInfo label={label} info={info || ""} />}

      <RadioGroup
        value={value ? String(value) : ""}
        onValueChange={(val) => {
          const parsed = typeof value === "number" ? Number(val) : val;
          onChange(parsed);
        }}
        disabled={disabled}
        className={`flex ${inline ? "flex-row flex-wrap gap-4" : "flex-col gap-2"}`}>
        {options
          .filter((opt) => opt.label !== "")
          .map((opt) => (
            <div key={String(opt.value)} className="flex items-center gap-2">
              <RadioGroupItem
                value={String(opt.value)}
                id={`radio-${opt.value}`}
                className="border-pearl text-blue-400"
              />
              <label htmlFor={`radio-${opt.value}`} className="text-sm cursor-pointer">
                {opt.label}
              </label>
            </div>
          ))}
      </RadioGroup>
    </div>
  );
}
