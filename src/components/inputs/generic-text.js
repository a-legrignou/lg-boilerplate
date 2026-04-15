"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import LabelInfo from "./label-info";

export default function GenericTextInput({
  value,
  onChange,
  placeholder,
  className,
  type = "text",
  label,
  error,
  disabled = false,
  required = false,
  info,
}) {
  const inputId = React.useId();

  return (
    <div className={`flex flex-col w-full ${className || ""} border-none m-0 p-0`}>
      {label && <LabelInfo label={label} info={info || ""} />}

      <Input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`bg-background border px-2 py-2 placeholder-neutral-500 text-background rounded-none w-full h-9 focus:outline-none focus:ring-2 focus:ring-blue-500 m-0 shadow-xs text-sm ${
          error ? "border-red-500" : "border-pearl"
        }`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
