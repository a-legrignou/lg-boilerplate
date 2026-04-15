"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LabelInfo from "./label-info";

export default function GenericRadioGroup({ value, onChange, label, info, className, disabled = false }) {
  // Dégradé pastel pour rendre les radios jolis
  const ringColors = [
    "border-red-500",
    "border-orange-500",
    "border-yellow-500",
    "border-lime-600",
    "border-green-600",
  ];

  const options = [
    { value: 0, label: "Nulle" },
    { value: 1, label: "Faible" },
    { value: 2, label: "Moyenne" },
    { value: 3, label: "Élevée" },
    { value: 4, label: "Très élevée" },
  ];

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      {label && <LabelInfo label={label} info={info || ""} />}

      <RadioGroup
        value={value !== null && value !== undefined ? String(value) : ""}
        onValueChange={(val) => {
          const parsed = typeof value === "number" ? Number(val) : val;
          onChange(parsed);
        }}
        disabled={disabled}
        className={`flex flex-row flex-wrap gap-4`}>
        {options
          .filter((opt) => opt.label !== "")
          .map((opt, index) => (
            <div key={String(opt.value)} className="flex items-center gap-2">
              <RadioGroupItem
                value={String(opt.value)}
                id={`radio-${opt.value}`}
                className={`border-pearl text-blue-400 ${ringColors[index]}`}
              />
              <label htmlFor={`radio-${opt.value}`} className="text-sm cursor-pointer w-18">
                {opt.label}
              </label>
            </div>
          ))}
      </RadioGroup>
    </div>
  );
}
