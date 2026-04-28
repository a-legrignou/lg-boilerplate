"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Pool } from "pg";

import { auth } from "@/lib/auth";
import { PLANS, requireStripe, type PlanId } from "@/lib/stripe";

const pool = new Pool({ connectionString: process.env.DATABASE_URI });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Crée une checkout session Stripe pour le plan choisi
 * et redirige vers la page Stripe-hosted.
 */
export async function startCheckout(planId: PlanId) {
  const stripe = requireStripe();
  const plan = PLANS[planId];
  if (!plan.priceId) {
    throw new Error(`STRIPE_PRICE_ID manquant pour le plan ${planId}`);
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?next=/pricing");
  const user = session.user as typeof session.user & {
    stripeCustomerId?: string | null;
  };

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await pool.query(
      `UPDATE "user" SET "stripeCustomerId" = $1, "updatedAt" = NOW() WHERE id = $2`,
      [customerId, user.id],
    );
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${SITE_URL}/dashboard?subscription=success`,
    cancel_url: `${SITE_URL}/pricing?canceled=1`,
    allow_promotion_codes: true,
  });

  if (!checkout.url)
    throw new Error("Stripe n'a pas renvoyé d'URL de checkout.");
  redirect(checkout.url);
}

/**
 * Ouvre le Stripe Customer Portal pour gérer/annuler son abonnement.
 */
export async function openCustomerPortal() {
  const stripe = requireStripe();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const user = session.user as typeof session.user & {
    stripeCustomerId?: string | null;
  };
  if (!user.stripeCustomerId) redirect("/pricing");

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${SITE_URL}/dashboard`,
  });
  redirect(portal.url);
}
