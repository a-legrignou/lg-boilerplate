"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Plus, Check, X, Trash2, AlertCircle, Info, Home } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils/cn";

const variantStyles = {
  default: {
    className: "bg-primary text-white rounded-none hover:bg-sky-700 hover:shadow-md",
  },
  new: {
    className: "bg-sky-600 text-white hover:bg-sky-700",
    icon: <Plus className="w-4 h-4" />,
  },
  validate: {
    className: "bg-green-600 text-white hover:bg-green-700",
    icon: <Check className="w-4 h-4" />,
  },
  cancel: {
    className: "bg-cd text-t0 hover:bg-border",
    icon: <X className="w-4 h-4" />,
  },
  delete: {
    className: "bg-red-600 text-white hover:bg-red-700",
    icon: <Trash2 className="w-4 h-4" />,
  },
  danger: {
    className: "bg-red-500 text-white hover:bg-red-600",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  info: {
    className: "bg-blue-500 text-white hover:bg-blue-600",
    icon: <Info className="w-4 h-4" />,
  },
  warning: {
    className: "bg-yellow-400 text-black hover:bg-yellow-500",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  home: {
    className: "bg-yellow-400 text-black hover:bg-yellow-500",
    icon: <Home className="w-4 h-4" />,
  },
};

export function GenericButton({
  type = "button",
  appVariant = "default",
  loading,
  loadingLabel = "Chargement...",
  label,
  children,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...props
}) {
  const { pending } = useFormStatus();
  const isSubmitting = type === "submit" && pending;

  const actualLoading = loading ?? isSubmitting;

  const v = variantStyles[appVariant];

  return (
    <Button
      type={type}
      form={props.form} //  ← ← ← 🟩 AJOUT
      disabled={disabled || actualLoading}
      className={cn(
        "flex items-center gap-2 font-medium transition-all",
        v.className,
        actualLoading && "opacity-70 cursor-not-allowed",
        className,
      )}
      {...props}>
      {/* Loading Spinner */}
      {actualLoading && <Loader2 className="w-4 h-4 animate-spin" />}

      {/* Icône gauche */}
      {!actualLoading && (leftIcon ?? v.icon)}

      {/* Label */}
      {actualLoading ? loadingLabel : label || children}

      {/* Icône droite */}
      {!actualLoading && rightIcon}
    </Button>
  );
}
