"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LabelInfo from "./label-info";

export default function GenericSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  label,
  info,
  inline = false,
  disabled = false,
}) {
  return (
    <div className={`flex ${inline ? "flex-row items-center gap-2" : "flex-col gap-1"} ${className || ""}`}>
      {label && <LabelInfo label={label} info={info || ""} />}
      <Select
        value={String(value)}
        onValueChange={(val) => {
          const parsed = typeof value === "number" ? Number(val) : val;
          onChange(parsed);
        }}
        disabled={disabled}>
        <SelectTrigger
          className={`bg-background border border-pearl ring-0 shadow-sm h-9 rounded selected:ring-2 focus:ring-blue-500 ${
            inline ? "w-auto" : "w-full"
          }`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-background rounded">
          {options.map((opt) => (
            <SelectItem key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
