import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[\d\s().-]{7,20}$/.test(val), "Numéro de téléphone invalide"),
  message: z.string().min(5, "Le message est trop court"),
});
