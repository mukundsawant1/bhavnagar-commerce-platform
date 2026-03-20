"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useCart } from "@/components/cart/cart-store";
import { getProductSettings } from "@/lib/product-settings";
import type { ProduceListing } from "@/lib/commerce/mock-data";

type ProductCardProps = {
  product: ProduceListing;
  addLabel: string;
  askLabel: string;
};

export default function ProductCard({ product, addLabel, askLabel }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const initialSettings = getProductSettings(product.id);
  const initialMinBulk = typeof initialSettings.minBulkKg === "number" ? initialSettings.minBulkKg : 0;

  const [quantity, setQuantity] = useState(initialMinBulk > 0 ? initialMinBulk : 1);
  const [added, setAdded] = useState(false);
  const [minBulk] = useState(initialMinBulk);

  const isAvailable = product.status === "available";

  const handleAdd = () => {
    if (!isAvailable || quantity <= 0 || quantity < minBulk) return;
    addItem({
      id: product.id,
      name: product.name,
      quantity,
      unit: product.unit,
      pricePerUnit: product.pricePerKg,
      farmName: product.farmName,
    });

    showToast(`${product.name} added to cart`, "success");
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  const minBulkDisplay = minBulk ?? product.minBulkKg;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="h-44 bg-gradient-to-br from-teal-50 via-sky-50 to-cyan-100" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            {product.category}
          </p>
          <p
            className={`text-xs font-semibold ${
              product.status === "available"
                ? "text-emerald-700"
                : product.status === "low_stock"
                ? "text-teal-700"
                : "text-red-700"
            }`}
          >
            {product.status.replace("_", " ")}
          </p>
        </div>
        <h2 className="mt-3 line-clamp-2 text-base font-bold">{product.name}</h2>
        <p className="mt-1 text-xs text-muted">Listing: {product.id}</p>
        <p className="mt-2 text-sm text-slate-700">
          Farm: {product.farmName} ({product.location})
        </p>
        <p className="mt-1 text-xs text-muted">Photo: {product.photoHint}</p>
        <p className="mt-2 text-xs text-slate-600">Quality Grade: {product.qualityGrade}</p>
        <div className="mt-2 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-700">
          {minBulk > 0 ? <span>Min bulk: {minBulkDisplay} {product.unit} | </span> : null}
          <span>Available: {product.availableKg} {product.unit}</span>
        </div>
        <p className="mt-2 text-2xl font-black text-slate-900">Rs. {product.pricePerKg}/{product.unit}</p>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600" htmlFor={`qty-${product.id}`}>
              Qty ({product.unit})
            </label>
            <input
              id={`qty-${product.id}`}
              type="number"
              value={quantity}
              min={minBulkDisplay}
              max={product.availableKg > 0 ? product.availableKg : undefined}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isNaN(next)) return;
                setQuantity(Math.max(0, next));
              }}
              className="w-24 rounded-md border border-slate-200 px-2 py-1 text-sm"
            />
            <span className="text-xs text-slate-500">min {minBulkDisplay}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!isAvailable || quantity < product.minBulkKg}
              className="flex-1 rounded-md bg-teal-500 px-3 py-2 text-xs font-semibold text-slate-50 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {added ? "Added" : addLabel}
            </button>
            <button
              type="button"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold"
            >
              {askLabel}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
