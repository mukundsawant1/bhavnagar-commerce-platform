import { sampleProducts } from "@/lib/commerce/mock-data";

export default function ShopPage() {
  return (
    <main className="shell-container space-y-5">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">Shop</h1>
        <p className="mt-2 text-sm text-muted">Discover featured products and limited-time prices.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sampleProducts.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
            <div className="h-44 bg-gradient-to-br from-slate-100 via-slate-50 to-amber-100" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  {product.category}
                </p>
                <p className="text-xs font-semibold text-emerald-700">{product.badge}</p>
              </div>
              <h2 className="mt-3 line-clamp-2 text-base font-bold">{product.name}</h2>
              <p className="mt-1 text-xs text-muted">SKU: {product.id}</p>
              <p className="mt-2 text-xs text-amber-600">
                {"★".repeat(Math.round(product.rating))} {product.rating} ({product.reviews} ratings)
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">Rs. {product.price}</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-md bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-300">
                  Add to Cart
                </button>
                <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold">
                  Buy Now
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
