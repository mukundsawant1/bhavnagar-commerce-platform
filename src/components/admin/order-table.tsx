"use client";

import { useMemo, useState } from "react";

import type { OrderRecord } from "@/lib/types";

type OrderTableProps = {
  initialOrders: OrderRecord[];
};

export default function OrderTable({ initialOrders }: OrderTableProps) {
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deliveryInput, setDeliveryInput] = useState<Record<string, string>>(() =>
    initialOrders.reduce((acc, order) => {
      const date = (order.metadata?.deliveryDate as string) ?? "";
      if (date) acc[order.id] = date;
      return acc;
    }, {} as Record<string, string>),
  );

  const totalValue = useMemo(() => orders.reduce((sum, order) => sum + (order.amount ?? 0), 0), [orders]);


  const markPaid = async (orderId: string) => {
    setError(null);
    setUpdatingId(orderId);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPaymentReceived: true }),
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

  const updateDeliveryDate = async (orderId: string, deliveryDate: string) => {
    setError(null);
    setUpdatingId(orderId);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryDate }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error ?? "Failed to update delivery date.");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, metadata: body.order?.metadata ?? order.metadata }
            : order,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update delivery date.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Buyer Orders In Queue</h2>
          <p className="mt-2 text-2xl font-bold">{orders.length}</p>
          <p className="text-sm text-emerald-700">Requests waiting for review</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Total Order Value</h2>
          <p className="mt-2 text-2xl font-bold">Rs. {totalValue}</p>
          <p className="text-sm text-slate-600">Across all buyer orders</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Payment Tracker</h2>
          <p className="mt-2 text-sm text-slate-600">Mark orders as paid once payment is received.</p>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Order Decision Queue</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-muted">
                <th className="px-2 py-2">PO</th>
                <th className="px-2 py-2">Items</th>
                <th className="px-2 py-2">User</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Delivery</th>
                <th className="px-2 py-2">Payment</th>
                <th className="px-2 py-2">Assigned Farm</th>
                <th className="px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
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
                    {order.metadata?.adminPaymentReceived ? (
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
                    <input
                      type="date"
                      value={deliveryInput[order.id] ?? (order.metadata?.deliveryDate as string) ?? ""}
                      onChange={(event) =>
                        setDeliveryInput((prev) => ({
                          ...prev,
                          [order.id]: event.target.value,
                        }))
                      }
                      className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      disabled={updatingId === order.id}
                      onClick={() => updateDeliveryDate(order.id, deliveryInput[order.id] ?? "")}
                      className="mt-1 w-full rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                    >
                      {updatingId === order.id ? "Updating..." : "Save"}
                    </button>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      disabled={updatingId === order.id}
                      onClick={() => markPaid(order.id)}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                      {updatingId === order.id ? "Updating..." : "Mark payment received"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
