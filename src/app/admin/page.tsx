import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { farmPartners, produceCatalog } from "@/lib/commerce/mock-data";
import { decompressOrders } from "@/lib/compression";
import OrderTable from "@/components/admin/order-table";
import ProductUpload from "@/components/admin/product-upload";
import AdminReportCard from "@/components/admin/admin-report-card";
import type { OrderRecord } from "@/lib/types";
import ProductSettingsPanel from "@/components/product-settings/product-settings-panel";

type SupabaseOrderRow = Omit<OrderRecord, "metadata"> & { metadata?: unknown };

export default async function AdminPage() {
  let safeOrders: OrderRecord[] = [];
  let loadError: string | null = null;

  try {
    const supabaseAdmin = getSupabaseAdminClient();
    const { data: orders = [] } = await supabaseAdmin
      .from("orders")
      .select("id,user_id,status,amount,currency,metadata,created_at,updated_at")
      .order("created_at", { ascending: false });

    safeOrders = decompressOrders((orders ?? []) as SupabaseOrderRow[]);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unable to load admin data.";
  }

  return (
    <main className="shell-container space-y-4">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Review buyer orders, assign farms, and manage delivery commitments.
        </p>
      </section>

      {loadError ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-rose-800">Configuration required</h2>
          <p className="mt-2 text-sm text-rose-700">
            {loadError}
          </p>
          <p className="mt-3 text-sm text-slate-700">
            To use the admin dashboard you must set the Supabase service role key.
            Add <code className="rounded bg-slate-100 px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to your environment and restart the dev server.
          </p>
        </section>
      ) : (
        <>
          <OrderTable initialOrders={safeOrders} />

          <ProductSettingsPanel
            products={produceCatalog}
            title="Product Ordering Controls"
            subtitle="Set minimum bulk purchase quantities for each product. These values apply to both buyers and farm owners when ordering."
          />
        </>
      )}

      <div className="mt-6">
        <ProductUpload />
      </div>

      <AdminReportCard orders={safeOrders} />

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Farm Partner Directory</h2>
        <ul className="mt-4 space-y-3">
          {farmPartners.map((farm) => (
            <li key={farm.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{farm.name}</p>
                <p className="text-xs text-muted">Owner: {farm.owner} | {farm.phone}</p>
              </div>
              <div className="text-right text-xs text-muted">
                <p>{farm.location} | {farm.produceCount} listings</p>
                <p>Reliability {farm.reliabilityScore}/5</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-4 text-sm text-muted">
        Workflow: Buyer places order, farm approves or rejects, and admin overrides/sets final delivery timeline.
      </div>
    </main>
  );
}
