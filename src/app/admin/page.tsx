import { productPerformance, salesSeries } from "@/lib/analytics/mock";

export default function AdminPage() {
  const maxSales = Math.max(...salesSeries.map((item) => item.total));

  return (
    <main className="shell-container space-y-4">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
        Manage catalog, orders, and analytics from this protected route.
        </p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Daily Sales</h2>
          <p className="mt-2 text-2xl font-bold">Rs. 1,13,050</p>
          <p className="text-sm text-emerald-700">+8.2% vs yesterday</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Monthly Revenue</h2>
          <p className="mt-2 text-2xl font-bold">Rs. 14,82,900</p>
          <p className="text-sm text-emerald-700">+13.6% vs last month</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Orders Today</h2>
          <p className="mt-2 text-2xl font-bold">184</p>
          <p className="text-sm text-slate-600">27 pending fulfillment</p>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Daily Sales Trend</h2>
        <div className="mt-4 grid grid-cols-7 items-end gap-2">
          {salesSeries.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-accent/80"
                style={{ height: `${Math.round((item.total / maxSales) * 140)}px` }}
                title={`Rs. ${item.total}`}
              />
              <span className="text-xs text-muted">{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Product Performance</h2>
        <ul className="mt-4 space-y-3">
          {productPerformance.map((item) => (
            <li key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm text-muted">{item.sold} sold</span>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-4 text-sm text-muted">
        Replace mock analytics with Supabase SQL aggregates for production reporting.
      </div>
    </main>
  );
}
