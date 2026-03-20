"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useCart } from "@/components/cart/cart-store";
import type { AppDictionary } from "@/lib/i18n/dictionaries";

type OrderSubmitProps = {
  dictionary: AppDictionary["checkout"];
};

export default function OrderSubmit({ dictionary }: OrderSubmitProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const { items, totalAmount, clear } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");

  const hasItems = items.length > 0;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    if (!hasItems) {
      setError("Your cart is empty. Add items before submitting an order.");
      setIsSubmitting(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to place an order.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "inr",
          metadata: {
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            items,
            buyer: {
              businessName,
              contact,
              city,
              postal,
            },
          },
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error ?? "Failed to create order.");
      }

      clear();
      setMessage(
        `Order created: ${body.order?.id ?? "(unknown)"}. Status: ${body.order?.status ?? "?"}. You can track it in your orders page.`,
      );

      setTimeout(() => router.push("/orders"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          placeholder={dictionary.buyerPlaceholderBusiness}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder={dictionary.buyerPlaceholderContact}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder={dictionary.buyerPlaceholderCity}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          value={postal}
          onChange={(event) => setPostal(event.target.value)}
          placeholder={dictionary.buyerPlaceholderPostal}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p>
          <span className="font-semibold">Items:</span> {items.length} | <span className="font-semibold">Total</span>: Rs. {totalAmount}
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || !hasItems}
        className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-50 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : dictionary.submitOrder}
      </button>

      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
