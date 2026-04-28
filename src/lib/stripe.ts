import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

export const stripe = apiKey ? new Stripe(apiKey) : null;

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY manquant — voir .env.example");
  }
  return stripe;
}

/**
 * Définition des plans. Les priceId viennent de Stripe Dashboard.
 * Ajoute des entrées ici pour multiplier les tiers.
 */
export const PLANS = {
  premium: {
    id: "premium",
    name: "Premium",
    description: "Tout débloqué.",
    priceId: process.env.STRIPE_PRICE_ID_PREMIUM || "",
    amount: "9 €",
    interval: "mois",
    features: [
      "Accès complet aux fonctionnalités",
      "Support prioritaire",
      "Pas de limite d'usage",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
