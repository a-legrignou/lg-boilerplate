// /lib/widgets/LabelInfo.tsx
"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function LabelInfo({ label, info }) {
  return (
    <div className="flex items-center gap-2 mb-0.6 mt-0.6">
      <label className="block text-sm font-semibold">{label}</label>
      {info && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="max-w-xs text-sm">{info}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
