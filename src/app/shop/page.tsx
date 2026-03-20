import { produceCatalog } from "@/lib/commerce/mock-data";
import { getServerI18n } from "@/lib/i18n/server";
import ProductCard from "@/components/shop/product-card";
import { createServerClient } from "@supabase/ssr";

export const revalidate = 60;

export default async function ShopPage() {
  const { dictionary } = await getServerI18n();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  let products = produceCatalog;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    });

    const { data, error } = await supabase
      .from("products")
      .select("id,name,description,image_url,metadata")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      products = data.map((prod) => ({
        id: prod.id as string,
        name: prod.name as string,
        category: "Vegetable",
        unit: "kg",
        minBulkKg: 1,
        pricePerKg: 100,
        availableKg: 100,
        farmName: "Supabase Farm",
        location: "Online",
        photoHint: "",
        qualityGrade: "A",
        status: "available",
        imageUrl: prod.image_url as string,
        description: prod.description as string,
      }));
    }
  }

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
        {products.map((product) => (
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
