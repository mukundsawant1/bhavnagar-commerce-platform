"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import LanguageSelector from "@/components/i18n/language-selector";
import type { AppDictionary, AppLanguage } from "@/lib/i18n/dictionaries";

type HeaderProps = {
  language: AppLanguage;
  dictionary: AppDictionary;
};

export default function Header({ language, dictionary }: HeaderProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("buyer");
  const { totalQuantity } = useCart();
  const shouldAnimate = totalQuantity > 0;
  const router = useRouter();
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const IDLE_LOGOUT_MS = 15 * 60 * 1000; // 15 minutes

  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUserLoggedIn(!!user);
      }

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        if (mounted) {
          setUserEmail(user.email ?? null);
          setUserName(profile?.full_name ?? user.user_metadata?.full_name ?? user.email ?? null);
          setUserRole((profile?.role as string) ?? (user.user_metadata?.role as string) ?? "buyer");
        }
      } else {
        if (mounted) {
          setUserName(null);
          setUserEmail(null);
          setUserRole("buyer");
        }
      }
    };

    void getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      if (mounted) {
        setUserLoggedIn(!!session?.user);
      }
      if (event === "SIGNED_OUT") {
        setUserName(null);
        setUserRole("buyer");
      }
      if (event === "USER_UPDATED" || event === "SIGNED_IN") {
        if (session?.user) {
          setUserRole((session.user.user_metadata?.role as string) ?? "buyer");
        }
      }
    });

    const resetIdleTimer = () => {
      try {
        window.localStorage.setItem("bhavnagar_last_activity", Date.now().toString());
      } catch {}

      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }

      logoutTimeoutRef.current = setTimeout(async () => {
        await supabase.auth.signOut();
        setUserLoggedIn(false);
        setUserName(null);
        setUserRole("buyer");
        router.push("/");
      }, IDLE_LOGOUT_MS);
    };

    const activityEvents = ["mousemove", "keydown", "click", "touchstart"];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetIdleTimer));

    resetIdleTimer();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetIdleTimer));
    };
  }, [supabase, router]);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-brand-blue text-white">
        <div className="shell-container grid items-center gap-3 py-3 md:grid-cols-[220px_1fr_320px]">
          <Link href="/" className="inline-flex items-center gap-2 rounded-md border border-transparent px-2 py-1 hover:border-white/40">
                      <h1 className="text-center text-2xl font-black tracking-tight">
                          FreMi
                          <span className="block mt-2 text-xs font-semibold text-teal-200">
                              Fresh for Mi & Family from Farm
                          </span>
                      </h1>
            {/*<span className="text-2xl font-black tracking-tight">FreMi</span>*/}
            {/*<span className="mt-2 text-xs font-semibold text-teal-200">Fresh for Mi & Family from Farm</span>*/}
          </Link>

          <div className="hidden md:flex min-w-0">
            <div className="flex w-full min-w-0 overflow-hidden rounded-lg border border-brand-blue-soft bg-white shadow-sm">
              <span className="bg-slate-100 px-3 py-2 text-sm text-slate-600">All</span>
              <input
                aria-label="Search products"
                placeholder={dictionary.layout.searchPlaceholder}
                className="w-full px-3 py-2 text-sm text-slate-900 outline-none"
              />
              <button className="bg-teal-500 px-4 text-sm font-semibold text-slate-50 hover:bg-teal-400">
                {dictionary.layout.searchButton}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-4 text-xs sm:justify-end sm:text-sm">
            <Link href="/account" className="rounded-md border border-transparent px-2 py-1 hover:border-white/40">
              <span className="block text-[11px] text-slate-300">
                {userLoggedIn ? `Hello, ${userName ?? userEmail ?? "User"}` : dictionary.layout.signInGreeting}
              </span>
              <span className="font-semibold">{dictionary.layout.account}</span>
            </Link>
            <Link href="/orders" className="rounded-md border border-transparent px-2 py-1 hover:border-white/40">
              <span className="block text-[11px] text-slate-300">{dictionary.layout.returns}</span>
              <span className="font-semibold">{dictionary.layout.orders}</span>
            </Link>
            <Link href="/cart" className="relative rounded-md border border-transparent px-2 py-1 hover:border-white/40">
              <span className="block text-[11px] text-slate-300">{dictionary.layout.your}</span>
              <span className="flex items-center gap-2 font-semibold">
                {dictionary.layout.cart}
                {totalQuantity > 0 ? (
                  <span
                    key={totalQuantity}
                    className={`rounded-full bg-teal-500 px-2 py-0.5 text-[10px] font-bold text-slate-50 transition-transform duration-200 ${
                      shouldAnimate ? "animate-pulse" : ""
                    }`}
                  >
                    {totalQuantity}
                  </span>
                ) : null}
              </span>
            </Link>
            <LanguageSelector currentLanguage={language} label={dictionary.layout.language} />
          </div>
        </div>
      </div>

      <div className="bg-brand-blue-soft text-white">
        <nav className="shell-container flex flex-wrap items-center gap-4 py-2 text-sm">
          <Link href="/shop" className="rounded-md px-2 py-1 hover:bg-white/10">
            {dictionary.layout.nav.bulkShop}
          </Link>
          <Link href="/shop" className="rounded-md px-2 py-1 hover:bg-white/10">
            {dictionary.layout.nav.vegetables}
          </Link>
          <Link href="/shop" className="rounded-md px-2 py-1 hover:bg-white/10">
            {dictionary.layout.nav.fruits}
          </Link>

          {userLoggedIn && (userRole === "buyer" || userRole === "admin" || userRole === "farm_owner") ? (
            <Link href="/orders" className="rounded-md px-2 py-1 hover:bg-white/10">
              {dictionary.layout.nav.buyerOrders}
            </Link>
          ) : null}

          {userLoggedIn && userRole === "admin" ? (
            <Link href="/admin" className="rounded-md px-2 py-1 hover:bg-white/10">
              {dictionary.layout.nav.admin}
            </Link>
          ) : null}

          {userLoggedIn && (userRole === "farm_owner" || userRole === "admin") ? (
            <Link href="/farm" className="rounded-md px-2 py-1 hover:bg-white/10">
              {dictionary.layout.nav.farm}
            </Link>
          ) : null}
          <span className="ml-auto rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
            {dictionary.layout.stockBanner}
          </span>
        </nav>
      </div>
    </header>
  );
}
