"use client";

import React, { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import LabelInfo from "./label-info";

export default function GenericFile({ label, info, value, onChange, disabled = false, error }) {
  const [preview, setPreview] =
    (useState < string) |
    (null > (typeof value === "string" ? value : value instanceof File ? URL.createObjectURL(value) : null));
  const fileInputRef = (useRef < HTMLInputElement) | (null > null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (disabled) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleRemove = () => {
    if (disabled) return;
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <LabelInfo label={label} info={info || ""} />}

      <div className="flex items-center gap-4">
        {/* Avatar cliquable */}
        <div className="relative">
          <Avatar className="w-20 h-20 cursor-pointer rounded-sm" onClick={openFileDialog}>
            {preview ? (
              <AvatarImage src={preview} alt="Preview" />
            ) : (
              <AvatarFallback>
                <FileText className="w-6 h-6 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>

          {/* Bouton supprimer en overlay */}
          {preview && !disabled && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 text-red-500 hover:text-red-600"
              onClick={handleRemove}>
              <X size={16} />
            </Button>
          )}
        </div>

        {/* Zone drop / info */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".png,.jpg,.jpeg,.svg"
            disabled={disabled}
          />

          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`flex flex-col items-center justify-center border border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/10 transition ${
              disabled ? "opacity-50 pointer-events-none" : ""
            }`}>
            <Upload size={20} />
            <span className="text-xs mt-1 text-muted-foreground text-center">
              Glisser un fichier ou cliquer pour choisir
            </span>
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
