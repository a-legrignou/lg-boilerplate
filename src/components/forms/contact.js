"use client";
import { useState } from "react";
import GenericForm from "@/components/forms/engine";
import { GenericButton } from "@/components/inputs/generic-button";
import { Loader, Send } from "lucide-react";
import toast from "react-hot-toast";
import { ContactSchema as formSchema } from "@/lib/validators/contact";

// 🔧 Changé "key" en "name" + ajouté "label"
const formLayout = [
  { name: "name", type: "text", placeholder: "Votre nom" },
  { name: "email", type: "email", placeholder: "Votre adresse email" },
  { name: "phone", type: "tel", placeholder: "Un numéro pour vous joindre (optionnel)" },
  { name: "message", type: "textarea", placeholder: "Décrivez votre projet, vos enjeux, vos questions…", rows: 4 },
];

export default function ContactForm({ initialEmail = "" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultData = { name: "", email: initialEmail, phone: "", message: "" };

  const handleSubmit = async (data) => {
    const toastId = toast.loading("Envoi du formulaire...");
    setIsSubmitting(true);

    try {
      const csrfRes = await fetch("/api/csrf/get-csrf");
      const { csrfToken } = await csrfRes.json();

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("NETWORK_ERROR");
      const json = await res.json();
      if (!json?.success) throw new Error(json?.message || "UNKNOWN_ERROR");

      toast.success("Formulaire envoyé avec succès !", { id: toastId });
      return { success: true };
    } catch (err) {
      const message =
        err?.message === "NETWORK_ERROR"
          ? "Erreur réseau, veuillez réessayer."
          : err?.message || "Une erreur est survenue.";
      toast.error(message, { id: toastId });
      return { success: false, message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <GenericForm
        id="generic-form"
        initialValues={defaultData}
        schema={formSchema}
        fields={formLayout}
        onSubmit={handleSubmit}
      />
      <div className="flex flex-row-reverse mt-4">
        <GenericButton type="submit" form="generic-form" disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting ? (
            <>
              <Loader className="animate-spin h-5 w-5" /> Envoi...
            </>
          ) : (
            <>
              Être contacté <Send />
            </>
          )}
        </GenericButton>
      </div>
    </div>
  );
}
