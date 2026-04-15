export const SIZE_LABELS = {
  ge:  "Grande entreprise",
  etm: "ETM",
  pme: "PME",
  tpe: "TPE/TPE",
};

export const SECTOR_LABELS = {
  defence:                "Défense",
  aeronautics:            "Aéronautique",
  energy:                 "Énergie",
  finance:                "Finance",
  industry:               "Industrie",
  public:                 "Secteur public",
  tech:                   "Technologie",
  health:                 "Santé",
  transport:              "Transport",
  regulated_professions:  "Professions réglementées",
};

export const sizeLabel   = (v) => SIZE_LABELS[v]   ?? v ?? null;
export const sectorLabel = (v) => SECTOR_LABELS[v] ?? v ?? null;
