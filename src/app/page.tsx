import Link from "next/link";
import { getServerI18n } from "@/lib/i18n/server";
export const revalidate = 60;
export default async function Home() {
  const { dictionary } = await getServerI18n();

  return (
    <main className="shell-container space-y-6">
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-8 text-white shadow-lg sm:p-10">
              <p className="inline-block rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
            {dictionary.home.heroTagline}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            {dictionary.home.heroHeadline}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-200 sm:text-base">
            {dictionary.home.heroCopy}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-md bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-50 transition hover:bg-teal-400"
            >
              {dictionary.home.ctaBuyer}
            </Link>
            <Link
              href="/admin"
              className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {dictionary.home.ctaAdmin}
            </Link>
            <Link
              href="/farm"
              className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {dictionary.home.ctaFarm}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{dictionary.home.buyerPanelTitle}</p>
            <h2 className="mt-2 text-xl font-bold">{dictionary.home.buyerPanelTitle}</h2>
            <p className="mt-2 text-sm text-muted">{dictionary.home.buyerPanelDesc}</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{dictionary.home.farmPanelTitle}</p>
            <h2 className="mt-2 text-xl font-bold">{dictionary.home.farmPanelTitle}</h2>
            <p className="mt-2 text-sm text-muted">{dictionary.home.farmPanelDesc}</p>
          </article>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [dictionary.home.card1Title, dictionary.home.card1Desc],
          [dictionary.home.card2Title, dictionary.home.card2Desc],
          [dictionary.home.card3Title, dictionary.home.card3Desc],
          [dictionary.home.card4Title, dictionary.home.card4Desc],
        ].map(([title, description]) => (
          <article key={title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">{dictionary.home.orderFlowTitle}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            [dictionary.home.orderFlowStep1Title, dictionary.home.orderFlowStep1Desc],
            [dictionary.home.orderFlowStep2Title, dictionary.home.orderFlowStep2Desc],
            [dictionary.home.orderFlowStep3Title, dictionary.home.orderFlowStep3Desc],
          ].map(([title, description]) => (
            <article key={title} className="rounded-lg bg-slate-50 p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{dictionary.home.quickAccess}</h2>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">{dictionary.home.coreRoutes}</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {[
            [dictionary.layout.nav.bulkShop, "/shop"],
            [dictionary.layout.cart, "/cart"],
            [dictionary.layout.checkout, "/checkout"],
            [dictionary.layout.account, "/account"],
            [dictionary.layout.nav.admin, "/admin"],
            [dictionary.layout.nav.farm, "/farm"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold transition hover:border-teal-300 hover:bg-teal-50"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

