"use client";

import type { ProduceListing } from "@/lib/commerce/mock-data";
import MinBulkEditor from "@/components/product-settings/min-bulk-editor";

type ProductSettingsPanelProps = {
  products: ProduceListing[];
  title: string;
  subtitle?: string;
};

export default function ProductSettingsPanel({ products, title, subtitle }: ProductSettingsPanelProps) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <div key={product.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-slate-600">Farm: {product.farmName}</p>
              <MinBulkEditor productId={product.id} defaultMin={product.minBulkKg} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
