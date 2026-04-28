import { headers } from "next/headers";
import type Stripe from "stripe";
import { Pool } from "pg";

import { requireStripe } from "@/lib/stripe";

const pool = new Pool({ connectionString: process.env.DATABASE_URI });

const RELEVANT_EVENTS = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe not configured", { status: 503 });
  }
  const stripe = requireStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[stripe] signature verification failed:", msg);
    return new Response(`Webhook error: ${msg}`, { status: 400 });
  }

  if (!RELEVANT_EVENTS.has(event.type)) {
    return Response.json({ received: true, ignored: event.type });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode !== "subscription") break;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        const userId = session.client_reference_id;

        if (!userId) {
          console.warn(
            "[stripe] checkout.session.completed sans client_reference_id",
          );
          break;
        }

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        await pool.query(
          `UPDATE "user"
              SET "stripeCustomerId" = $1,
                  "subscriptionId"   = $2,
                  "subscriptionStatus" = $3,
                  "updatedAt" = NOW()
            WHERE id = $4`,
          [customerId, subscriptionId, sub.status, userId],
        );
        console.log(`[stripe] user ${userId} → ${sub.status}`);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await pool.query(
          `UPDATE "user"
              SET "subscriptionId"   = $1,
                  "subscriptionStatus" = $2,
                  "updatedAt" = NOW()
            WHERE "stripeCustomerId" = $3`,
          [sub.id, sub.status, sub.customer],
        );
        console.log(`[stripe] subscription ${sub.id} → ${sub.status}`);
        break;
      }
    }
  } catch (err) {
    console.error("[stripe] handler error:", err);
    return new Response("Handler error", { status: 500 });
  }

  return Response.json({ received: true });
}
