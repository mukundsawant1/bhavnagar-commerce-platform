"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-store";
import { useToast } from "@/components/ui/toast";
import type { AppDictionary } from "@/lib/i18n/dictionaries";

type CartViewProps = {
  dictionary: AppDictionary["cart"];
};

export default function CartView({ dictionary }: CartViewProps) {
  const router = useRouter();
  const { items, totalAmount, totalQuantity, updateQuantity, removeItem, clear } = useCart();
  const { showToast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const hasItems = items.length > 0;

  const formattedTotal = useMemo(() => `Rs. ${totalAmount}`, [totalAmount]);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleClear = () => {
    setIsClearing(true);
    clear();
    showToast("Cart cleared", "info");
    setTimeout(() => setIsClearing(false), 250);
  };

  return (
    <main className="shell-container grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{dictionary.title}</h1>
            <p className="mt-2 text-sm text-muted">{dictionary.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!hasItems}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {dictionary.submitForReview}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!hasItems || isClearing}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {isClearing ? "Clearing…" : "Clear cart"}
            </button>
          </div>
        </div>

        {hasItems ? (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-600">
                      {item.farmName} • Rs. {item.pricePerUnit}/{item.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-600" htmlFor={`qty-${item.id}`}>
                      Qty
                    </label>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(item.id);
                        showToast(`${item.name} removed from cart`, "info");
                      }}
                      className="rounded-md border border-transparent bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            {dictionary.emptyMessage}
            <div className="mt-4">
              <Link href="/shop" className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-50 hover:bg-teal-400">
                Browse shop
              </Link>
            </div>
          </div>
        )}
      </section>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">{dictionary.summaryTitle}</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>{dictionary.totalQuantity}</span>
            <span>{totalQuantity} kg</span>
          </div>
          <div className="flex justify-between">
            <span>{dictionary.estimatedValue}</span>
            <span>{formattedTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>{dictionary.expectedLogistics}</span>
            <span>{hasItems ? "Pending farm assignment" : "—"}</span>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3 text-base font-bold">
          <div className="flex justify-between">
            <span>{dictionary.requestValue}</span>
            <span>{formattedTotal}</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
