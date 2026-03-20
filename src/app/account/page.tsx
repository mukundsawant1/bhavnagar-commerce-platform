import AccountAuthPanel from "@/components/auth/account-auth-panel";
import { getServerI18n } from "@/lib/i18n/server";

type AccountPageProps = {
  searchParams: Promise<{
    checkout?: string;
    next?: string;
    error?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const { dictionary } = await getServerI18n();
  const checkoutState = params.checkout;
  const nextPath = params.next;
  const configError = params.error;

  return (
    <main className="shell-container grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">{dictionary.account.title}</h1>
        <p className="mt-2 text-sm text-muted">{dictionary.account.subtitle}</p>
      {checkoutState === "success" ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {dictionary.account.paymentSuccess}
        </p>
      ) : null}
      {checkoutState === "cancelled" ? (
        <p className="mt-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {dictionary.account.checkoutCancelled}
        </p>
      ) : null}
      {nextPath ? (
        <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          {dictionary.account.signInPrompt} <span className="font-semibold">{nextPath}</span>.
        </p>
      ) : null}
      {configError ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {dictionary.account.configError}
        </p>
      ) : null}
      <AccountAuthPanel nextPath={nextPath} copy={dictionary.auth} />
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Your Orders</h2>
        <p className="mt-2 text-sm text-muted">Track your orders and see payment & delivery status.</p>
        <div className="mt-4">
          <a
            href="/orders"
            className="inline-flex items-center justify-center rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-50 hover:bg-teal-400"
          >
            View order history
          </a>
        </div>
      </section>
      </section>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">{dictionary.account.roleGuide}</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>{dictionary.account.buyerLine}</li>
          <li>{dictionary.account.adminLine}</li>
          <li>{dictionary.account.farmLine}</li>
          <li>{dictionary.account.gmailLine}</li>
        </ul>
      </aside>
    </main>
  );
}
