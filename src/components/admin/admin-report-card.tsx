"use client";

import { useMemo } from "react";
import type { OrderRecord } from "@/lib/types";

type AdminReportCardProps = {
  orders: OrderRecord[];
};

export default function AdminReportCard({ orders }: AdminReportCardProps) {
  const totalValue = useMemo(() => orders.reduce((sum, order) => sum + (order.amount ?? 0), 0), [orders]);

  const copyReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      totalOrders: orders.length,
      totalValue,
      sample: orders.slice(0, 5).map((o) => ({ id: o.id, status: o.status, amount: o.amount, currency: o.currency })),
    };

    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert("Report copied to clipboard. Share it with your team.");
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Shareable Report</h2>
      <p className="mt-1 text-sm text-muted">Copy a summary report to share with other team members.</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Orders</p>
          <p className="text-xs text-slate-600">Total orders: {orders.length}</p>
          <p className="text-xs text-slate-600">Value: Rs. {totalValue}</p>
        </div>
        <button
          type="button"
          onClick={copyReport}
          className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-50 hover:bg-teal-400"
        >
          Copy report
        </button>
      </div>
    </section>
  );
}
