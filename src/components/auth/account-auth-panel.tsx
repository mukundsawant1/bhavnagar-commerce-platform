"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AccountAuthPanelProps = {
  nextPath?: string;
};

type AuthMode = "signin" | "signup";

type UserOrder = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
};

export default function AccountAuthPanel({ nextPath }: AccountAuthPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        setMessage("Signed in successfully.");

        if (nextPath) {
          window.location.href = nextPath;
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        setMessage("Account created. Check your email for verification if enabled.");
      }
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Authentication failed.");
      }
    } finally {
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
      setMessage("Signed out.");
    }

    setLoading(false);
  };

  if (user) {
    return (
      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold">Signed In</h2>
        <p className="mt-1 text-sm text-muted">{user.email}</p>

        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Recent Orders</h3>
          {orders.length === 0 ? (
            <p className="mt-2 text-sm">No recent orders found.</p>
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
          {loading ? "Please wait..." : "Sign Out"}
        </button>

        {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
            mode === "signin" ? "bg-slate-900 text-white" : "bg-white"
          }`}
          onClick={() => setMode("signin")}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`rounded-md px-4 py-1.5 text-sm font-semibold ${
            mode === "signup" ? "bg-slate-900 text-white" : "bg-white"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            required
          />
        ) : null}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          required
          minLength={6}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
