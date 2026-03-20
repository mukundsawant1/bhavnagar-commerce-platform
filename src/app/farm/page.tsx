import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { farmPartners, produceCatalog } from "@/lib/commerce/mock-data";
import { getServerI18n } from "@/lib/i18n/server";
import { decompressOrders } from "@/lib/compression";
import FarmOrders from "@/components/farm/orders";
import ProductSettingsPanel from "@/components/product-settings/product-settings-panel";
import type { OrderRecord } from "@/lib/types";

type SupabaseOrderRow = Omit<OrderRecord, "metadata"> & { metadata?: unknown };

export default async function FarmPage() {
  const { dictionary } = await getServerI18n();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileRes = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user?.id)
    .single();

  const fullName = profileRes.data?.full_name ?? "";
  const ownFarm = farmPartners.find((farm) => farm.owner === fullName) ?? farmPartners[0];
  const ownProducts = produceCatalog.filter((product) => product.farmName === ownFarm.name);

  const { data: assignedOrders } = await supabase
    .from("orders")
    .select("id,user_id,status,amount,currency,metadata,created_at,updated_at")
    .filter("metadata->>assignedFarm", "eq", ownFarm.name)
    .order("created_at", { ascending: false });

  const safeOrders: OrderRecord[] = decompressOrders((assignedOrders ?? []) as SupabaseOrderRow[]);

  return (
    <main className="shell-container space-y-4">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">{dictionary.farm.pageTitle}</h1>
        <p className="mt-2 text-sm text-muted">{dictionary.farm.pageSubtitle}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">{dictionary.farm.profileTitle}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <p>
            <span className="font-semibold">{dictionary.farm.farmLabel}</span> {ownFarm.name}
          </p>
          <p>
            <span className="font-semibold">{dictionary.farm.ownerLabel}</span> {ownFarm.owner}
          </p>
          <p>
            <span className="font-semibold">{dictionary.farm.locationLabel}</span> {ownFarm.location}
          </p>
          <p>
            <span className="font-semibold">{dictionary.farm.contactLabel}</span> {ownFarm.phone}
          </p>
        </div>
      </section>

      <FarmOrders farmName={ownFarm.name} initialOrders={safeOrders} />

      <ProductSettingsPanel
        products={ownProducts}
        title="Farm Product Controls"
        subtitle="Adjust minimum bulk quantities for your farm listings (buyer-facing)."
      />
    </main>
  );
}
