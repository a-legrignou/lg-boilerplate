"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Appearance } from "@/blocks/appearance";

import type { Form } from "@/payload-types";

type FormField = NonNullable<Form["fields"]>[number];

type Props = {
  form: number | Form;
  heading?: string | null;
  description?: string | null;
  appearance?: Appearance | null;
};

export function FormBlock({ form, heading, description, appearance }: Props) {
  const formDoc: Form | null = typeof form === "object" ? form : null;
  const formId = typeof form === "object" ? form.id : form;

  const [pending, setPending] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!formDoc) {
    return (
      <Section appearance={appearance ?? { maxWidth: "narrow" }}>
        <p className="text-sm text-muted-foreground">
          Form #{formId} introuvable.
        </p>
      </Section>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    const submissionData = (formDoc?.fields ?? [])
      .filter(
        (f): f is FormField & { name: string } =>
          "name" in f && Boolean(f.name),
      )
      .map((f) => ({ field: f.name, value: String(data.get(f.name) ?? "") }));

    try {
      const res = await fetch("/api/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: formId, submissionData }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      if (formDoc?.confirmationType === "redirect" && formDoc?.redirect?.url) {
        window.location.href = formDoc.redirect.url;
        return;
      }
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setPending(false);
    }
  }

  return (
    <Section appearance={appearance ?? { maxWidth: "narrow" }}>
      {heading ? (
        <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
      ) : null}
      {description ? (
        <p className="mt-3 text-muted-foreground">{description}</p>
      ) : null}

      {confirmed ? (
        <p className="mt-8 rounded-lg border border-border bg-card p-6 text-center">
          Merci, votre message a bien été envoyé.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          {(formDoc.fields ?? []).map((field, i) => {
            if (field.blockType === "message" || !field.name) return null;
            const id = `field-${field.name}-${i}`;
            const common = {
              id,
              name: field.name,
              required: field.required ?? undefined,
              defaultValue:
                "defaultValue" in field &&
                (typeof field.defaultValue === "string" ||
                  typeof field.defaultValue === "number")
                  ? field.defaultValue
                  : undefined,
            };

            return (
              <div key={id} className="flex flex-col gap-2">
                {field.label ? <Label htmlFor={id}>{field.label}</Label> : null}
                {field.blockType === "textarea" ? (
                  <textarea
                    {...common}
                    rows={5}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                ) : field.blockType === "select" ? (
                  <select
                    {...common}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {(field.options ?? []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.blockType === "checkbox" ? (
                  <Input
                    {...common}
                    type="checkbox"
                    defaultChecked={Boolean(field.defaultValue)}
                    className="size-4"
                  />
                ) : (
                  <Input
                    {...common}
                    type={
                      field.blockType === "email"
                        ? "email"
                        : field.blockType === "number"
                          ? "number"
                          : "text"
                    }
                  />
                )}
              </div>
            );
          })}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {formDoc.submitButtonLabel || "Envoyer"}
          </Button>
        </form>
      )}
    </Section>
  );
}
