import AccountAuthPanel from "@/components/auth/account-auth-panel";

type AccountPageProps = {
  searchParams: Promise<{
    checkout?: string;
    next?: string;
    error?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const checkoutState = params.checkout;
  const nextPath = params.next;
  const configError = params.error;

  return (
    <main className="shell-container grid gap-4 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight">Account</h1>
        <p className="mt-2 text-sm text-muted">Secure sign-in powered by Supabase Auth.</p>
      {checkoutState === "success" ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Payment completed successfully. Your order status will update shortly.
        </p>
      ) : null}
      {checkoutState === "cancelled" ? (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Checkout was cancelled. You can retry from your cart.
        </p>
      ) : null}
      {nextPath ? (
        <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          Please sign in to access <span className="font-semibold">{nextPath}</span>.
        </p>
      ) : null}
      {configError ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Configuration is incomplete. Set Supabase env variables and try again.
        </p>
      ) : null}
      <AccountAuthPanel nextPath={nextPath} />
      </section>

      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Account Benefits</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Track orders and payment status in real-time.</li>
          <li>Fast checkout with saved account details.</li>
          <li>Priority offers and personalized recommendations.</li>
        </ul>
      </aside>
    </main>
  );
}
