import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bhavnagar Commerce",
  description: "Fast, scalable e-commerce web application powered by Next.js",
};

const navLinks = [
  ["All", "/shop"],
  ["Fresh Deals", "/shop"],
  ["Fashion", "/shop"],
  ["Home & Kitchen", "/shop"],
  ["Orders", "/account"],
  ["Admin", "/admin"],
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50">
          <div className="bg-brand-blue text-white">
            <div className="shell-container grid items-center gap-3 py-3 md:grid-cols-[220px_1fr_320px]">
              <Link href="/" className="inline-flex items-center gap-2 rounded-md border border-transparent px-2 py-1 hover:border-white/40">
                <span className="text-2xl font-black tracking-tight">Bhavnagar</span>
                <span className="mt-2 text-xs font-semibold text-amber-300">commerce</span>
              </Link>

              <div className="hidden md:flex">
                <div className="flex w-full overflow-hidden rounded-lg border border-brand-blue-soft bg-white shadow-sm">
                  <span className="bg-slate-100 px-3 py-2 text-sm text-slate-600">All</span>
                  <input
                    aria-label="Search products"
                    placeholder="Search for products, brands and categories"
                    className="w-full px-3 py-2 text-sm text-slate-900 outline-none"
                  />
                  <button className="bg-amber-400 px-4 text-sm font-semibold text-slate-900">Search</button>
                </div>
              </div>

              <div className="flex justify-start gap-4 text-xs sm:justify-end sm:text-sm">
                <Link href="/account" className="rounded-md border border-transparent px-2 py-1 hover:border-white/40">
                  <span className="block text-[11px] text-slate-300">Hello, sign in</span>
                  <span className="font-semibold">Account</span>
                </Link>
                <Link href="/account" className="rounded-md border border-transparent px-2 py-1 hover:border-white/40">
                  <span className="block text-[11px] text-slate-300">Returns</span>
                  <span className="font-semibold">Orders</span>
                </Link>
                <Link href="/cart" className="rounded-md border border-transparent px-2 py-1 hover:border-white/40">
                  <span className="block text-[11px] text-slate-300">Your</span>
                  <span className="font-semibold">Cart</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-brand-blue-soft text-white">
            <nav className="shell-container flex flex-wrap items-center gap-4 py-2 text-sm">
              {navLinks.map(([label, href]) => (
                <Link key={label} href={href} className="rounded-md px-2 py-1 hover:bg-white/10">
                  {label}
                </Link>
              ))}
              <span className="ml-auto rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                Free delivery on first order above Rs. 499
              </span>
            </nav>
          </div>
        </header>

        <div className="py-6">{children}</div>

        <footer className="mt-8 border-t border-slate-300 bg-slate-100">
          <div className="shell-container flex flex-col gap-2 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Bhavnagar Commerce - built on Next.js, Supabase, Stripe, and Resend.</p>
            <p className="font-medium">Ready for Vercel deployment</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

