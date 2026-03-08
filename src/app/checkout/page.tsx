export default function CheckoutPage() {
  return (
    <main className="shell-container grid gap-4 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-3xl font-black tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-muted">
            Complete shipping and payment details to place your order securely.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">1. Shipping Address</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input placeholder="Full name" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Phone number" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="City" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder="Postal code" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">2. Payment Method</h2>
          <p className="mt-2 text-sm text-muted">
            Stripe checkout endpoint ready at <code>POST /api/checkout</code>.
          </p>
          <button className="mt-4 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300">
            Continue to Secure Payment
          </button>
        </div>
      </section>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Order Review</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex justify-between"><span>Items (0)</span><span>Rs. 0</span></li>
          <li className="flex justify-between"><span>Delivery</span><span>Rs. 0</span></li>
          <li className="flex justify-between"><span>Tax</span><span>Rs. 0</span></li>
        </ul>
        <div className="mt-4 border-t border-slate-200 pt-3">
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>Rs. 0</span></div>
        </div>
        <p className="mt-3 text-xs text-muted">By placing your order, you agree to our terms and privacy policy.</p>
      </aside>
    </main>
  );
}
