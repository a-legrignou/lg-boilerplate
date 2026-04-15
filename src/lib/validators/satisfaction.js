import { z } from "zod";

export const SatisfactionSchema = z.object({
  nps: z.number().int().min(0).max(10, "NPS invalide"),
  quality: z.enum(["insufficient", "satisfactory", "good", "excellent"], { message: "Qualité requise" }),
  communication: z.enum(["insufficient", "satisfactory", "good", "excellent"], { message: "Communication requise" }),
  would_recommend: z.enum(["yes", "maybe", "no"], { message: "Réponse requise" }),
  comment: z.string().max(2000).optional(),
});

export const QUALITY_OPTIONS = [
  { value: "insufficient", label: "Insuffisante" },
  { value: "satisfactory", label: "Satisfaisante" },
  { value: "good", label: "Très bonne" },
  { value: "excellent", label: "Excellente" },
];

export const RECOMMEND_OPTIONS = [
  { value: "yes", label: "Oui" },
  { value: "maybe", label: "Peut-être" },
  { value: "no", label: "Non" },
];
