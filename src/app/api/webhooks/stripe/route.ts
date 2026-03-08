import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getResendClient } from "@/lib/notifications/email";
import { getStripeClient } from "@/lib/payments/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error);
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabaseAdmin = getSupabaseAdminClient();

    const sessionId = session.id;
    const customerEmail = session.customer_details?.email;

    // Example order sync. Expects an 'orders' table with a stripe_session_id column.
    await supabaseAdmin
      .from("orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("stripe_session_id", sessionId);

    if (customerEmail && process.env.RESEND_API_KEY) {
      const resend = getResendClient();
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "Bhavnagar <onboarding@resend.dev>",
        to: customerEmail,
        subject: "Order payment confirmed",
        html: `<p>Your payment for session <strong>${sessionId}</strong> is confirmed.</p>`,
      });
    }
  }

  return NextResponse.json({ received: true });
}

