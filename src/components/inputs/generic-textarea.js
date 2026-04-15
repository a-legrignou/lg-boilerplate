"use client";

import { Textarea } from "../ui/textarea";
import LabelInfo from "./label-info";

export default function GenericTextarea({ value, onChange, placeholder, className, label, info, error, rows = 5 }) {
  return (
    <div className={`flex flex-col w-full ${className || ""}`}>
      {label && <LabelInfo label={label} info={info} />}

      <Textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`bg-background border border-pearl placeholder-neutral-500 text-background shadow-xs px-2 py-2 rounded-none w-full focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : ""
        } leading-normal`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
