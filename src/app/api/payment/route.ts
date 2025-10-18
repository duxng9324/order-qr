import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  try {
    const { amount, currency, orderId } = await req.json();

    if (!amount || !currency || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error("Payment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
