"use client";

import Image from "next/image";
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
  const initialMinBulk = typeof initialSettings.minBulkKg === "number" ? initialSettings.minBulkKg : product.minBulkKg ?? 1;

  const [quantity, setQuantity] = useState(initialMinBulk);
  const [selectedUnit, setSelectedUnit] = useState<"kg" | "g">("kg");
  const [added, setAdded] = useState(false);
  const [minBulk] = useState(initialMinBulk);

  const isAvailable = product.status === "available";
  const isGram = selectedUnit === "g";
  const minBulkForUnit = isGram ? minBulk * 1000 : minBulk;
  const availableForUnit = isGram ? product.availableKg * 1000 : product.availableKg;
  const pricePerUnit = isGram ? product.pricePerKg / 1000 : product.pricePerKg;

  const handleAdd = () => {
    if (!isAvailable || quantity <= 0 || quantity < minBulkForUnit) return;
    const lineId = `${product.id}::${selectedUnit}`;
    addItem({
      lineId,
      id: product.id,
      name: product.name,
      quantity,
      unit: selectedUnit,
      pricePerUnit,
      farmName: product.farmName,
    });

    showToast(`${product.name} (${selectedUnit}) added to cart`, "success");
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      {product.imageUrl ? (
        <div className="relative h-44 w-full bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-teal-50 via-sky-50 to-cyan-100" />
      )}
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
        {product.description ? <p className="mt-1 text-xs text-slate-700">{product.description}</p> : null}
        <p className="mt-1 text-xs text-muted">Listing: {product.id}</p>
        <p className="mt-2 text-sm text-slate-700">
          Farm: {product.farmName} ({product.location})
        </p>
        {product.photoHint ? <p className="mt-1 text-xs text-muted">Photo: {product.photoHint}</p> : null}
        <p className="mt-2 text-xs text-slate-600">Quality Grade: {product.qualityGrade}</p>
        <div className="mt-2 rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-700">
          {minBulk > 0 ? <span>Min bulk: {minBulkForUnit} {selectedUnit} | </span> : null}
          <span>Available: {availableForUnit} {selectedUnit}</span>
        </div>
        <p className="mt-2 text-2xl font-black text-slate-900">
          Rs. {pricePerUnit.toFixed(3).replace(/\.?0+$/, "")}/{selectedUnit}
        </p>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600" htmlFor={`unit-${product.id}`}>
              Unit
            </label>
            <select
              id={`unit-${product.id}`}
              value={selectedUnit}
              onChange={(event) => {
                const nextUnit = event.target.value as "kg" | "g";
                setSelectedUnit(nextUnit);
                setQuantity(nextUnit === "g" ? minBulk * 1000 : minBulk);
              }}
              className="rounded-md border border-slate-200 px-2 py-1 text-sm"
            >
              <option value="kg">kg</option>
              <option value="g">gram</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600" htmlFor={`qty-${product.id}`}>
              Qty ({selectedUnit})
            </label>
            <input
              id={`qty-${product.id}`}
              type="number"
              value={quantity}
              min={minBulkForUnit}
              max={availableForUnit > 0 ? availableForUnit : undefined}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (Number.isNaN(next)) return;
                setQuantity(Math.max(0, next));
              }}
              className="w-24 rounded-md border border-slate-200 px-2 py-1 text-sm"
            />
            <span className="text-xs text-slate-500">min {minBulkForUnit}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!isAvailable || quantity < minBulkForUnit || quantity > availableForUnit}
              className="flex-1 rounded-md bg-teal-500 px-3 py-2 text-xs font-semibold text-slate-50 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {added ? "Added" : addLabel}
            </button>
            {!isAvailable ? (
              <span className="text-xs text-red-600">Not available</span>
            ) : quantity < minBulkForUnit ? (
              <span className="text-xs text-amber-600">Minimum {minBulkForUnit} required</span>
            ) : null}
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
