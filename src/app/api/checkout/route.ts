import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/payments/stripe";

type CheckoutLineItem = {
  name: string;
  unitAmount: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: CheckoutLineItem[] };
    const items = body.items ?? [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required." },
        { status: 400 },
      );
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.unitAmount,
        },
      })),
      success_url: `${origin}/account?checkout=success`,
      cancel_url: `${origin}/cart?checkout=cancelled`,
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 },
    );
  }
}
