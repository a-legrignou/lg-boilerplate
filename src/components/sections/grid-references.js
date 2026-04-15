"use client";

import { useMemo } from "react";
import CaseCard from "@/components/cards/case-card";
import FilterSelect from "@/components/widgets/filter-select";
import { sectorLabel, sizeLabel } from "@/lib/utils/case-labels";
import { useFilters } from "@/lib/hooks/use-filters";

export default function GridReferences({ cases }) {
  const { values, setValue, filtered } = useFilters(cases, [
    { key: "sector", predicate: (c, val) => val === "all" || c.client_sector === val },
    { key: "size",   predicate: (c, val) => val === "all" || c.client_size   === val },
  ]);

  // Options dynamiques construites à partir des données présentes
  const sectorOptions = useMemo(() => {
    const present = [...new Set(cases.map((c) => c.client_sector).filter(Boolean))];
    return [
      { value: "all", label: "Tous secteurs" },
      ...present.map((v) => ({ value: v, label: sectorLabel(v) ?? v })),
    ];
  }, [cases]);

  const sizeOptions = useMemo(() => {
    const present = [...new Set(cases.map((c) => c.client_size).filter(Boolean))];
    return [
      { value: "all", label: "Toutes tailles" },
      ...present.map((v) => ({ value: v, label: sizeLabel(v) ?? v })),
    ];
  }, [cases]);

  if (!cases?.length) return null;

  const showSectorFilter = sectorOptions.length > 2;
  const showSizeFilter   = sizeOptions.length   > 2;

  return (
    <section className="max-w-6xl mx-auto w-full px-6 py-20">
      {(showSectorFilter || showSizeFilter) && (
        <div className="flex items-center gap-3 flex-wrap mb-12 pb-4 border-b border-border">
          {showSectorFilter && (
            <FilterSelect
              options={sectorOptions}
              value={values.sector}
              onChange={(v) => setValue("sector", v)}
              placeholder="Secteur"
            />
          )}
          {showSizeFilter && (
            <FilterSelect
              options={sizeOptions}
              value={values.size}
              onChange={(v) => setValue("size", v)}
              placeholder="Taille"
            />
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-16">
          Aucune référence dans cette sélection.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((c) => (
            <CaseCard key={c.id} block={c} />
          ))}
        </div>
      )}
    </section>
  );
}
