"use client";

import { useState } from "react";

/**
 * useFilters
 * ==========
 * Hook générique pour gérer un ou plusieurs filtres sur une liste de données.
 * Évite de dupliquer la logique useState + filter dans chaque grille.
 *
 * @template T
 * @param {T[]} data     - Liste des éléments à filtrer
 * @param {Array<{
 *   key: string,
 *   predicate: (item: T, value: string) => boolean
 * }>} config           - Un objet par filtre : clé + prédicat de correspondance
 *
 * @returns {{
 *   values:   Record<string, string>,
 *   setValue: (key: string, value: string) => void,
 *   filtered: T[],
 * }}
 *
 * @example
 * const { values, setValue, filtered } = useFilters(modules, [
 *   { key: "axe",     predicate: (m, v) => v === "all" || m.axe === v },
 *   { key: "persona", predicate: (m, v) => matchPersona(m, v) },
 * ]);
 */
export function useFilters(data, config) {
  // Initialise chaque filtre à "all"
  const [values, setValues] = useState(
    () => Object.fromEntries(config.map((c) => [c.key, "all"]))
  );

  /** Met à jour la valeur d'un filtre donné. */
  const setValue = (key, value) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  /** Items correspondant à TOUS les filtres actifs. */
  const filtered = (data ?? []).filter((item) =>
    config.every(({ key, predicate }) => predicate(item, values[key]))
  );

  return { values, setValue, filtered };
}
