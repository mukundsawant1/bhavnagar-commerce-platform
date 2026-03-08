export default function CartPage() {
  return (
    <main className="shell-container grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">Shopping Cart</h1>
        <p className="mt-2 text-sm text-muted">Review items, delivery options, and taxes before checkout.</p>
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          Your cart is currently empty. Add products from the shop to begin checkout.
        </div>
      </section>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between"><span>Subtotal</span><span>Rs. 0</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Rs. 0</span></div>
          <div className="flex justify-between"><span>Tax</span><span>Rs. 0</span></div>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3 text-base font-bold">
          <div className="flex justify-between"><span>Total</span><span>Rs. 0</span></div>
        </div>
        <button className="mt-4 w-full rounded-md bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300">
          Proceed to Checkout
        </button>
      </aside>
    </main>
  );
}
