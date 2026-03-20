"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppDictionary } from "@/lib/i18n/dictionaries";

type AccountAuthPanelProps = {
  nextPath?: string;
  copy: AppDictionary["auth"];
};

type AuthMode = "signin" | "signup";
type UserRole = "buyer" | "admin" | "farm_owner";

type UserOrder = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
};

export default function AccountAuthPanel({ nextPath, copy }: AccountAuthPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [surname, setSurname] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [otpCode, setOtpCode] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);

  const isGmailAddress = (value: string) => /^[^\s@]+@gmail\.com$/i.test(value.trim());

  const roleLabels: Record<UserRole, string> = {
    buyer: copy.roleBuyer,
    admin: copy.roleAdmin,
    farm_owner: copy.roleFarm,
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!isMounted) return;
      setUser(currentUser ?? null);

      if (currentUser) {
        const { data } = await supabase
          .from("orders")
          .select("id,status,amount,currency,created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        setOrders((data ?? []) as UserOrder[]);
      }
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const requestOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!isGmailAddress(normalizedEmail)) {
        throw new Error(copy.gmailOnlyError);
      }

      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.error ?? copy.authFailed);
      }

      setOtpRequested(true);
      setMessage(data?.message ?? copy.otpSent);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.authFailed);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!isGmailAddress(normalizedEmail)) {
        throw new Error(copy.gmailOnlyError);
      }

      if (!otpCode.trim()) {
        throw new Error(copy.otpRequired);
      }

      if (mode === "signup" && !fullName.trim()) {
        throw new Error(copy.fullNameRequired);
      }

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          code: otpCode.trim(),
          fullName: fullName.trim(),
          surname: surname.trim(),
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? copy.authFailed);
      }

      setOtpVerified(true);
      setMessage(copy.otpVerified);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : copy.authFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!isGmailAddress(normalizedEmail)) {
      setError(copy.gmailOnlyError);
      setLoading(false);
      return;
    }

    if (!otpRequested) {
      setError(copy.otpBeforeGoogle);
      setLoading(false);
      return;
    }

    if (!otpVerified) {
      setError(copy.otpVerifyRequired);
      setLoading(false);
      return;
    }

    const redirectTo = nextPath
      ? `${window.location.origin}/account?next=${encodeURIComponent(nextPath)}`
      : `${window.location.origin}/account`;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
    } else {
      setUser(null);
      setOrders([]);
      setMessage(copy.signedOutSuccess);
      setOtpRequested(false);
      setOtpVerified(false);
    }

    setLoading(false);
  };

  if (user) {
    return (
      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold">{copy.signedIn}</h2>
        <p className="mt-1 text-sm text-muted">{user.email}</p>
        <p className="mt-1 text-xs text-slate-600">
          {copy.roleLabel}: {roleLabels[(user.user_metadata?.role as UserRole | undefined) ?? "buyer"]}
        </p>

        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{copy.recentOrders}</h3>
          {orders.length === 0 ? (
            <p className="mt-2 text-sm">{copy.noRecentOrders}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {orders.map((order) => (
                <li key={order.id} className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm">
                  <span className="font-medium">{order.id.slice(0, 8)}</span> | {order.status} | {order.currency.toUpperCase()} {order.amount}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={loading}
          className="mt-4 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"
        >
          {loading ? copy.pleaseWait : copy.signOut}
        </button>

        {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{mode === "signin" ? copy.signIn : copy.signUp}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
              mode === "signin" ? "bg-slate-900 text-white" : "bg-white"
            }`}
            onClick={() => {
              setMode("signin");
              setOtpRequested(false);
              setOtpVerified(false);
              setMessage(null);
              setError(null);
            }}
          >
            {copy.signIn}
          </button>
          <button
            type="button"
            className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
              mode === "signup" ? "bg-slate-900 text-white" : "bg-white"
            }`}
            onClick={() => {
              setMode("signup");
              setOtpRequested(false);
              setOtpVerified(false);
              setMessage(null);
              setError(null);
            }}
          >
            {copy.signUp}
          </button>
        </div>
      </div>

      {error ? <div className="mt-4 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div> : null}
      {message ? <div className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          {mode === "signup" ? (
            <>
              <input
                type="text"
                placeholder={copy.fullName}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                required
              />
              <input
                type="text"
                placeholder={copy.surname}
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="buyer">{copy.roleBuyer}</option>
                <option value="admin">{copy.roleAdmin}</option>
                <option value="farm_owner">{copy.roleFarm}</option>
              </select>
            </>
          ) : null}

          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder={copy.gmailAddress}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setOtpRequested(false);
                setOtpVerified(false);
              }}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={requestOtp}
              disabled={loading || !isGmailAddress(email)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {copy.requestOtp}
            </button>
            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading || !otpRequested || !otpCode.trim()}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {copy.verifyOtp}
            </button>
          </div>

          <input
            type="text"
            placeholder={copy.otpCode}
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || !otpVerified}
            className="w-full rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-50 hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? copy.pleaseWait : copy.continueGoogle}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold">{copy.continueWithGoogleTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{copy.continueWithGoogleSubtitle}</p>
          <p className="mt-3 text-xs text-slate-500">{copy.googleOAuthHint}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-600">{copy.gmailOnlyHint}</p>
    </section>
  );
}
