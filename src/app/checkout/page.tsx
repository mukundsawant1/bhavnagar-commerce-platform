import { getServerI18n } from "@/lib/i18n/server";
import OrderSubmit from "@/components/checkout/order-submit";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const { dictionary } = await getServerI18n();

  return (
    <main className="shell-container grid gap-4 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-3xl font-black tracking-tight">{dictionary.checkout.title}</h1>
          <p className="mt-2 text-sm text-muted">{dictionary.checkout.subtitle}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">{dictionary.checkout.sectionBuyerDetails}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input placeholder={dictionary.checkout.buyerPlaceholderBusiness} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder={dictionary.checkout.buyerPlaceholderContact} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder={dictionary.checkout.buyerPlaceholderCity} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <input placeholder={dictionary.checkout.buyerPlaceholderPostal} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">{dictionary.checkout.sectionOrderPayment}</h2>
          <p className="mt-2 text-sm text-muted">{dictionary.checkout.agreementNote}</p>
          <p className="mt-2 text-sm text-muted">{dictionary.checkout.orderStep3}</p>
          <OrderSubmit dictionary={dictionary.checkout} />
        </div>
      </section>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">{dictionary.checkout.orderTimelineTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex justify-between"><span>{dictionary.checkout.orderStep1}</span><span>Day 0</span></li>
          <li className="flex justify-between"><span>{dictionary.checkout.orderStep2}</span><span>Day 0-1</span></li>
          <li className="flex justify-between"><span>{dictionary.checkout.orderStep3}</span><span>Day 1</span></li>
          <li className="flex justify-between"><span>{dictionary.checkout.orderStep4}</span><span>Day 1-2</span></li>
        </ul>
        <div className="mt-4 border-t border-slate-200 pt-3">
          <div className="flex justify-between text-base font-bold"><span>{dictionary.checkout.currentEta}</span><span>{dictionary.checkout.etaPending}</span></div>
        </div>
        <p className="mt-3 text-xs text-muted">{dictionary.checkout.agreementNote}</p>
      </aside>
    </main>
  );
}
