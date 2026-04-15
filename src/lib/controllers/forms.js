// lib/controllers/forms.ts
import { ZodError } from "zod";
import { cookies } from "next/headers"; // ✅ import correct pour App Router

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function handleFileUpload(file, prefix) {
  if (!file || file.size === 0) return null;

  if (!ALLOWED_MIME.includes(file.type)) throw new Error("Type de fichier non autorisé");
  if (file.size > MAX_SIZE) throw new Error("Fichier trop volumineux");

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fileExt = file.name.split(".").pop();
  const fileName = `${prefix}_${uuidv4()}.${fileExt}`;
  const filePath = path.join(uploadsDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.promises.writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

export async function deleteFile(filePath) {
  const sanitizedPath = filePath.replace(/^\/+/g, "");
  const fullPath = path.join(process.cwd(), "public", sanitizedPath);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  if (fullPath.startsWith(uploadsDir) && fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export async function validateSchema(data, schema) {
  try {
    schema.parse(data);
    return { success: true, message: "Validation réussie" };
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = {};
      err.issues.forEach((issue) => {
        const key = issue.path[0];
        if (key) errors[key.toString()] = issue.message;
      });
      return { success: false, errors };
    }
    throw err;
  }
}

export async function validateForm(formData, schema, minTimestampDelay = 5000) {
  const errors = {};
  const data = {};

  // --- Récupération des valeurs ---
  for (const [key, value] of formData.entries()) {
    data[key] = value instanceof File ? value : String(value).trim();
  }

  // --- CSRF ---
  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get("csrf_token")?.value;
  if (!csrfCookie || csrfCookie !== data.csrf) {
    errors.csrf = "Jeton CSRF invalide.";
  }

  // --- Timestamp ---
  const timestamp = Number(data.timestamp);
  if (isNaN(timestamp)) errors.timestamp = "Timestamp invalide.";
  else if (Date.now() - timestamp < minTimestampDelay) {
    errors.timestamp = `Veuillez attendre ${minTimestampDelay / 1000} secondes avant de soumettre le formulaire.`;
  }

  // --- Honeypot anti-bot ---
  if (data.security && data.security.trim() !== "") {
    errors.security = "Soumission suspecte détectée.";
  }

  // --- Validation Zod ---
  try {
    schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      err.issues.forEach((issue) => {
        const key = issue.path[0];
        if (typeof key === "string") {
          errors[key] = issue.message;
        }
      });
    } else {
      throw err;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, message: "Formulaire valide." };
}
