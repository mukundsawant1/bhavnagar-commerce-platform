import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/header";
import { CartProvider } from "@/components/cart/cart-store";
import { ToastProvider } from "@/components/ui/toast";
import { getServerI18n } from "@/lib/i18n/server";
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
  title: "Bhavnagar Bulk Produce",
  description: "Bulk fruits and vegetables marketplace connecting buyers, admin, and farm owners",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { language, dictionary } = await getServerI18n();

  return (
    <html lang={language}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <ToastProvider>
            <Header language={language} dictionary={dictionary} />
            <div className="py-6">{children}</div>
          </ToastProvider>
        </CartProvider>

        <footer className="mt-8 border-t border-slate-300 bg-slate-100">
          <div className="shell-container flex flex-col gap-2 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Bhavnagar Commerce - built on Next.js, Supabase, Stripe, and Resend.</p>
            <p className="font-medium">{dictionary.layout.workflowFooter}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

