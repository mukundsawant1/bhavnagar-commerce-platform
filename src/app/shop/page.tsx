import { produceCatalog } from "@/lib/commerce/mock-data";
import { getServerI18n } from "@/lib/i18n/server";
import ProductCard from "@/components/shop/product-card";

export default async function ShopPage() {
  const { dictionary } = await getServerI18n();

  return (
    <main className="shell-container space-y-5">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">Bulk Produce Marketplace</h1>
        <p className="mt-2 text-sm text-muted">
          Buyer view: choose fruits and vegetables in bulk lots, compare farm availability,
          and place purchase requests.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {produceCatalog.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addLabel={dictionary.shop.addBulkRequest}
            askLabel={dictionary.shop.askAvailability}
          />
        ))}
      </div>
    </main>
  );
}
