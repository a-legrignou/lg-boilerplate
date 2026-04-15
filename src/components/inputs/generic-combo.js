"use client";

import * as React from "react";
import { ChevronsUpDown, CircleCheck, CirclePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function Combo({ value, onChange, options, onAdd, onRemove, placeholder = "Sélectionner..." }) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (!options.some((o) => o.label === trimmed)) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  const selectedLabel = options.find((o) => o.value.toString() === value?.toString())?.label ?? placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="border border-pearl rounded h-9">
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between ">
          <span className="w-4/5 overflow-hidden text-left">{selectedLabel}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 bg-background">
        <Command>
          {/* Barre d’ajout */}
          <div className="flex items-center gap-1 px-3 py-2 border-b w-full justify-between">
            <Input
              placeholder="Ajouter une catégorie"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              className="h-9 m-0 border-none outline-none focus-visible:ring-0"
            />
            <Button size="icon" variant="ghost" onClick={handleAdd}>
              <CirclePlus size={20} />
            </Button>
          </div>

          {/* Liste des catégories */}
          <CommandList>
            <CommandEmpty>Aucune catégorie</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.value.toString()} value={opt.value.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span onClick={() => handleSelect(opt.value.toString())} className="cursor-pointer flex-1">
                      {opt.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {value === opt.value.toString() && <CircleCheck className="opacity-100 text-green-500" />}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRemove(opt.value.toString())}
                        className="hover:text-red-500">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
