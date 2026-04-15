"use client";

import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, X, Eye, EyeOff, Info, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Combo } from "@/components/inputs/generic-combo";
import GenericSelect from "@/components/inputs/generic-select";
import GenericText from "@/components/inputs/generic-text";
import GenericCheckbox from "@/components/inputs/generic-checkbox";
import GenericTextarea from "@/components/inputs/generic-textarea";
import GenericRadio from "@/components/inputs/generic-radio-group";
import GenericRadioCard from "@/components/inputs/generic-radio-card";
import GenericScaleSelector from "@/components/inputs/generic-scale-group";

export default function GenericInput({
  type = "text",
  value,
  onChange,
  placeholder,
  label,
  info,
  error,
  options = [],
  onAddOption,
  onRemoveOption,
  disabled = false,
  className,
  rows,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  const preview = useMemo(() => {
    if (!value) return null;
    if (value instanceof File) return URL.createObjectURL(value);
    if (typeof value === "string") return value;
    return null;
  }, [value]);

  const handleFile = (file) => {
    if (disabled) return;
    onChange(file);
  };

  const handleRemoveFile = () => {
    if (disabled) return;
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const opts = Array.isArray(options)
    ? typeof options[0] === "string"
      ? options.map((o) => ({ label: o, value: o }))
      : options
    : [];

  // --- Rendu dynamique ---
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <GenericTextarea value={value} onChange={(e) => onChange(e)} placeholder={placeholder} rows={rows ?? 3} />
        );

      case "radiocard":
        return (
          <GenericRadioCard
            value={typeof value === "string" ? value : ""}
            onChange={(val) => onChange(val)}
            options={opts}
            disabled={disabled}
            inline={true}
          />
        );

      case "scale":
        return (
          <GenericScaleSelector
            value={
              typeof value === "number"
                ? value
                : typeof value === "string" && value !== "" && !isNaN(Number(value))
                ? Number(value)
                : 0
            }
            onChange={(val) => onChange(val)}
          />
        );

      case "password":
        return (
          <div className="relative w-full">
            <GenericText
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={`rounded w-full ${error ? "border-red-500" : ""}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent p-1"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
        );

      case "select":
        return (
          <GenericSelect
            value={typeof value === "string" ? value : ""}
            onChange={(val) => onChange(val)}
            options={opts}
            disabled={disabled}
          />
        );

      case "radio":
        return (
          <GenericRadio
            value={typeof value === "string" ? value : ""}
            onChange={(val) => onChange(val)}
            options={opts}
            disabled={disabled}
            inline={true}
          />
        );

      case "combo":
        // Convertit toujours en FieldOption avec label/value correct

        return (
          <Combo
            value={typeof value === "string" ? value : undefined}
            onChange={(val) => onChange(val)}
            options={opts}
            placeholder={placeholder}
            onAdd={(label) => onAddOption?.(label)}
            onRemove={(val) => onRemoveOption?.(val)}
          />
        );

      case "checkbox":
        return (
          <GenericCheckbox value={Array.isArray(value) ? value : []} onChange={(val) => onChange(val)} options={opts} />
        );

      case "file":
        return (
          <div
            className="relative flex flex-col items-center justify-center border border-dashed border-pearl rounded-lg p-6 text-center cursor-pointer hover:bg-cd transition group"
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => e.preventDefault()}>
            <Avatar className="w-24 h-24 rounded-md overflow-hidden mb-2">
              {preview ? (
                <AvatarImage key={preview} src={preview} alt="Preview" className="object-cover" />
              ) : (
                <AvatarFallback>
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
            {!preview ? (
              <>
                <Upload size={22} className="text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Glissez ou cliquez pour ajouter un fichier</p>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}>
                  <X size={18} />
                </Button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              disabled={disabled}
            />
          </div>
        );

      default:
        return (
          <GenericText
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`bg-background border border-pearl rounded w-full ${error ? "border-red-500" : "border-pearl"}`}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col w-full ${className || ""}`}>
      {label && (
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-semibold">{label}</label>
          {info && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-sm">{info}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      {renderInput()}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
