import Link from "next/link";

export default function Home() {
  return (
    <main className="shell-container space-y-6">
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg sm:p-10">
          <p className="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
            Premium Shopping Experience
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            Fast, trusted, and conversion-ready ecommerce storefront.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-200 sm:text-base">
            Bhavnagar Commerce combines modern design, secure checkout, and
            reliable operations to launch quickly on Vercel.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-md bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Start Shopping
            </Link>
            <Link
              href="/account"
              className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Today Offer</p>
            <h2 className="mt-2 text-xl font-bold">Up to 40% off</h2>
            <p className="mt-2 text-sm text-muted">Fashion, home and accessories curated for festive season.</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Delivery Promise</p>
            <h2 className="mt-2 text-xl font-bold">Same day dispatch</h2>
            <p className="mt-2 text-sm text-muted">Priority packing for prepaid and premium customers.</p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Secure Checkout", "Stripe-backed checkout and webhook verification."],
          ["Role-based Admin", "Supabase-auth protected dashboard and controls."],
          ["Email Notifications", "Resend integration for post-payment updates."],
          ["Vercel Ready", "Optimized Next.js deployment path for production."],
        ].map(([title, description]) => (
          <article key={title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Quick Access</h2>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Core Routes</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Shop", "/shop"],
            ["Cart", "/cart"],
            ["Checkout", "/checkout"],
            ["Account", "/account"],
            ["Admin", "/admin"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold transition hover:border-amber-300 hover:bg-amber-50"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

