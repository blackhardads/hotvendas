import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { planId, planAmount, planLabel, creatorName } = await req.json();

    if (!planId || !planAmount || !planLabel || !creatorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/of?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/of`,
      customer_email: undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${creatorName} - ${planLabel}`,
              description: "OnlyFans Subscription",
              images: ["https://via.placeholder.com/400x400?text=OnlyFans"],
            },
            unit_amount: Math.round(planAmount * 100),
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
