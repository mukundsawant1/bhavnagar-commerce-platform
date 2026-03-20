"use client";

import { useState } from "react";
import { getProductSettings, setProductMinBulk } from "@/lib/product-settings";

type MinBulkEditorProps = {
  productId: string;
  defaultMin: number;
  label?: string;
  onChange?: (minBulk: number) => void;
};

export default function MinBulkEditor({ productId, defaultMin, label, onChange }: MinBulkEditorProps) {
  const initialSettings = getProductSettings(productId);
  const initialMinBulk = typeof initialSettings.minBulkKg === "number" ? initialSettings.minBulkKg : defaultMin;
  const [minBulk, setMinBulk] = useState(initialMinBulk);

  const update = (next: number) => {
    setMinBulk(next);
    setProductMinBulk(productId, next);
    if (onChange) onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-600">{label ?? "Minimum bulk (kg)"}</label>
      <input
        type="number"
        min={1}
        value={minBulk}
        onChange={(event) => update(Number(event.target.value))}
        className="w-28 rounded-md border border-slate-300 px-2 py-1 text-sm"
      />
      <p className="text-xs text-slate-500">This value is stored locally and applies to ordering for this product.</p>
    </div>
  );
}
