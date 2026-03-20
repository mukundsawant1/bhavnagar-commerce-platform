import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { decompressOrders } from "@/lib/compression";
import type { OrderRecord } from "@/lib/types";

type SupabaseOrderRow = Omit<OrderRecord, "metadata"> & { metadata?: unknown };

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="shell-container py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Order History</h1>
          <p className="mt-2 text-sm text-slate-600">Please sign in to view your orders.</p>
          <div className="mt-4">
            <Link href="/account" className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-50 hover:bg-teal-400">
              Sign in / Sign up
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { data: orders = [] } = await supabase
    .from("orders")
    .select("id,status,amount,currency,metadata,created_at,updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const safeOrders: OrderRecord[] = decompressOrders((orders ?? []) as SupabaseOrderRow[]);

  return (
    <main className="shell-container space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">My Orders</h1>
        <p className="mt-2 text-sm text-muted">Track your orders and see payment status, assigned farm, and delivery progress.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-muted">
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Items</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Delivery</th>
                <th className="px-2 py-2">Notes</th>
                <th className="px-2 py-2">Payment</th>
                <th className="px-2 py-2">Farm</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {safeOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100">
                  <td className="px-2 py-2 font-semibold">{order.id}</td>
                  <td className="px-2 py-2">
                    {Array.isArray(order.metadata?.items) && order.metadata.items.length > 0 ? (
                      <ul className="space-y-1 text-xs text-slate-600">
                        {(order.metadata.items as unknown[]).map((item: unknown) => {
                          if (typeof item !== "object" || item === null) return null;
                          const maybe = item as Record<string, unknown>;
                          const name = typeof maybe.name === "string" ? maybe.name : "Item";
                          const quantity = typeof maybe.quantity === "number" ? maybe.quantity : 0;
                          const unit = typeof maybe.unit === "string" ? maybe.unit : "";

                          return (
                            <li key={`${order.id}-${name}-${quantity}`}>
                              {name} x {quantity} {unit}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <span className="text-xs text-slate-500">(no items)</span>
                    )}
                  </td>
                  <td className="px-2 py-2">{order.status}</td>
                  <td className="px-2 py-2">
                    {order.metadata?.deliveryDate ? (
                      <span className="text-xs text-slate-700">{new Date(order.metadata.deliveryDate as string).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-xs text-slate-500">(not set)</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {order.metadata?.rejectionNotes ? (
                      <span className="text-xs text-slate-700">{order.metadata.rejectionNotes}</span>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {order.metadata?.adminPaymentReceived ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                        Admin paid
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">{order.metadata?.assignedFarm ?? "—"}</td>
                  <td className="px-2 py-2">{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {safeOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-2 py-10 text-center text-sm text-slate-600">
                    No orders found. Place an order from the shop or checkout.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
