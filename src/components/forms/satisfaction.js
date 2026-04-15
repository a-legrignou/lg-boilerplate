"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SatisfactionSchema, QUALITY_OPTIONS, RECOMMEND_OPTIONS } from "@/lib/validators/satisfaction";
import { GenericButton } from "@/components/inputs/generic-button";
import { Loader, Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ─── Sélecteur NPS 0–10 ─────────────────────────────────────── */
function NpsSelector({ value, onChange }) {
  const scores = Array.from({ length: 11 }, (_, i) => i);
  const color = (n) => {
    if (n <= 6) return "border-red-300 text-red-600 data-[selected=true]:bg-red-500 data-[selected=true]:border-red-500";
    if (n <= 8) return "border-amber-300 text-amber-600 data-[selected=true]:bg-amber-500 data-[selected=true]:border-amber-500";
    return "border-green-300 text-green-600 data-[selected=true]:bg-green-500 data-[selected=true]:border-green-500";
  };

  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label="Score de recommandation de 0 à 10" className="flex flex-wrap gap-2">
        {scores.map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} sur 10`}
            aria-pressed={value === n}
            data-selected={value === n}
            onClick={() => onChange(n)}
            className={cn(
              "w-10 h-10 border text-sm font-medium transition-all duration-150",
              "data-[selected=true]:text-white",
              color(n),
            )}>
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[0.65rem] text-t2 uppercase tracking-widest">
        <span>Peu probable</span>
        <span>Très probable</span>
      </div>
    </div>
  );
}

/* ─── Sélecteur carte radio ──────────────────────────────────── */
function CardRadio({ options, value, onChange, error, "aria-labelledby": labelledBy }) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-2 border text-sm transition-all duration-150",
            value === opt.value
              ? "border-navy bg-navy/5 text-navy font-medium"
              : "border-border text-t1 hover:border-navy/40",
          )}>
          {opt.label}
        </button>
      ))}
      {error && <p className="w-full text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ─── Formulaire principal ───────────────────────────────────── */
export default function SatisfactionForm({ token, label }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SatisfactionSchema),
    defaultValues: { nps: undefined, quality: undefined, communication: undefined, would_recommend: undefined, comment: "" },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch(`/api/satisfaction/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      router.push(`/satisfaction/${token}/merci`);
    } catch (err) {
      setServerError(err.message || "Une erreur est survenue.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

      {/* NPS */}
      <div className="space-y-3">
        <p id="label-nps" className="text-sm font-medium text-t0">
          Quelle est la probabilité que vous nous recommandiez à un confrère ou partenaire ?
        </p>
        <Controller
          control={control}
          name="nps"
          render={({ field }) => (
            <div role="group" aria-labelledby="label-nps">
              <NpsSelector value={field.value} onChange={field.onChange} />
            </div>
          )}
        />
        {errors.nps && <p className="text-xs text-red-500">{errors.nps.message}</p>}
      </div>

      {/* Qualité */}
      <div className="space-y-3">
        <p id="label-quality" className="text-sm font-medium text-t0">
          Comment évaluez-vous la qualité de nos livrables ?
        </p>
        <Controller
          control={control}
          name="quality"
          render={({ field }) => (
            <CardRadio aria-labelledby="label-quality" options={QUALITY_OPTIONS} value={field.value} onChange={field.onChange} error={errors.quality?.message} />
          )}
        />
      </div>

      {/* Communication */}
      <div className="space-y-3">
        <p id="label-communication" className="text-sm font-medium text-t0">
          Comment évaluez-vous notre communication tout au long de la mission ?
        </p>
        <Controller
          control={control}
          name="communication"
          render={({ field }) => (
            <CardRadio aria-labelledby="label-communication" options={QUALITY_OPTIONS} value={field.value} onChange={field.onChange} error={errors.communication?.message} />
          )}
        />
      </div>

      {/* Recommandation */}
      <div className="space-y-3">
        <p id="label-recommend" className="text-sm font-medium text-t0">
          Envisageriez-vous de faire appel à nous pour une prochaine mission ?
        </p>
        <Controller
          control={control}
          name="would_recommend"
          render={({ field }) => (
            <CardRadio aria-labelledby="label-recommend" options={RECOMMEND_OPTIONS} value={field.value} onChange={field.onChange} error={errors.would_recommend?.message} />
          )}
        />
      </div>

      {/* Commentaire */}
      <div className="space-y-3">
        <label htmlFor="satisfaction-comment" className="block text-sm font-medium text-t0">
          Un commentaire libre ? <span className="text-t2 font-normal">(optionnel)</span>
        </label>
        <textarea
          {...register("comment")}
          id="satisfaction-comment"
          rows={4}
          placeholder="Vos remarques, suggestions ou points d'amélioration…"
          className="w-full border border-border bg-background text-t0 text-sm px-3 py-2 resize-none focus:outline-none focus:border-navy transition-colors placeholder:text-t2"
        />
        {errors.comment && <p className="text-xs text-red-500">{errors.comment.message}</p>}
      </div>

      {serverError && (
        <p className="text-sm text-red-500 border border-red-200 bg-red-50 px-4 py-3">{serverError}</p>
      )}

      <div className="flex justify-end">
        <GenericButton type="submit" disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting ? (
            <><Loader className="animate-spin h-4 w-4" /> Envoi…</>
          ) : (
            <>Envoyer mon avis <Send size={15} /></>
          )}
        </GenericButton>
      </div>

    </form>
  );
}
