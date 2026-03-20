"use client";

import { useMemo, useState } from "react";

import type { OrderRecord } from "@/lib/types";

type FarmOrdersProps = {
  farmName: string;
  initialOrders: OrderRecord[];
};

export default function FarmOrders({ farmName, initialOrders }: FarmOrdersProps) {
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState<Record<string, { deliveryDate: string; rejectionNotes: string }>>({});

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status !== "farm_accepted"),
    [orders],
  );

  const updateOrder = async (orderId: string, payload: Record<string, unknown>) => {
    setError(null);
    setUpdatingId(orderId);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error ?? "Failed to update order.");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: body.order?.status ?? order.status, metadata: body.order?.metadata ?? order.metadata }
            : order,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Orders assigned to {farmName}</h2>
        <p className="mt-1 text-sm text-muted">Farm owners can accept or reject orders, set delivery date, and share delivery details with admin.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-muted">
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Buyer</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Payment</th>
                <th className="px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => {
                const form = orderForm[order.id] ?? {
                  deliveryDate: (order.metadata?.deliveryDate as string) ?? "",
                  rejectionNotes: (order.metadata?.rejectionNotes as string) ?? "",
                };
                return (
                  <tr key={order.id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-semibold">{order.id}</td>
                    <td className="px-2 py-2">
                      {Array.isArray(order.metadata?.items) && order.metadata.items.length > 0 ? (
                        <ul className="space-y-1 text-xs text-slate-600">
                          {order.metadata.items.map((item) => {
                            if (typeof item !== "object" || item === null) return null;
                            const maybe = item as Record<string, unknown>;
                            const name = typeof maybe.name === "string" ? maybe.name : "Item";
                            const quantity = typeof maybe.quantity === "number" ? maybe.quantity : 0;
                            return (
                              <li key={`${order.id}-${name}-${quantity}`}>{name} x {quantity}</li>
                            );
                          })}
                        </ul>
                      ) : (
                        <span className="text-xs text-slate-500">(none)</span>
                      )}
                    </td>
                    <td className="px-2 py-2">{order.user_id}</td>
                    <td className="px-2 py-2">{order.status}</td>
                    <td className="px-2 py-2">
                      {order.metadata?.farmPaymentReceived ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                          Received
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-slate-600">Delivery date</label>
                          <input
                            type="date"
                            value={form.deliveryDate}
                            onChange={(event) =>
                              setOrderForm((prev) => ({
                                ...prev,
                                [order.id]: { ...form, deliveryDate: event.target.value },
                              }))
                            }
                            className="w-full rounded-md border border-slate-200 px-2 py-1 text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-semibold text-slate-600">Rejection notes</label>
                          <textarea
                            value={form.rejectionNotes}
                            onChange={(event) =>
                              setOrderForm((prev) => ({
                                ...prev,
                                [order.id]: { ...form, rejectionNotes: event.target.value },
                              }))
                            }
                            className="h-16 w-full resize-none rounded-md border border-slate-200 px-2 py-1 text-xs"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={updatingId === order.id}
                            onClick={() =>
                              updateOrder(order.id, {
                                status: "farm_accepted",
                                deliveryDate: form.deliveryDate || undefined,
                                farmPaymentReceived: true,
                              })
                            }
                            className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                          >
                            {updatingId === order.id ? "Updating..." : "Accept"}
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === order.id}
                            onClick={() =>
                              updateOrder(order.id, {
                                status: "farm_rejected",
                                rejectionNotes: form.rejectionNotes || undefined,
                              })
                            }
                            className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
                          >
                            {updatingId === order.id ? "Updating..." : "Reject"}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
