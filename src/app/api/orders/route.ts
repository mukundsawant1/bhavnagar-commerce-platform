import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { produceCatalog } from "@/lib/commerce/mock-data";
import { compressMetadata, ensureDecompressedMetadata } from "@/lib/compression";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Missing Supabase configuration." }, { status: 500 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll().map((cookie) => ({ name: cookie.name, value: cookie.value })),
      setAll: () => {
        // no-op in server route
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    amount?: number;
    currency?: string;
    metadata?: Record<string, unknown>;
  };

  const currency = body.currency ?? "inr";
  const metadata = body.metadata ?? {};

  const itemsFromClient: unknown[] = Array.isArray(metadata?.items) ? metadata.items : [];

  const sanitizedItems = itemsFromClient
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;
      const maybe = item as Record<string, unknown>;
      const id = typeof maybe.id === "string" ? maybe.id : null;
      const quantity = typeof maybe.quantity === "number" ? maybe.quantity : null;
      if (!id || quantity === null || quantity <= 0) return null;

      const product = produceCatalog.find((p) => p.id === id);
      if (!product) return null;

      return {
        id: product.id,
        name: product.name,
        quantity: Math.min(quantity, product.availableKg),
        unit: product.unit,
        pricePerUnit: product.pricePerKg,
        farmName: product.farmName,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    farmName: string;
  }>;

  const computedAmount = sanitizedItems.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  const firstFarm = sanitizedItems.length > 0 ? sanitizedItems[0].farmName : null;

  const defaultMetadata = {
    assignedFarm: firstFarm,
    adminPaymentReceived: false,
    farmPaymentReceived: false,
  };

  const rawMetadata = {
    ...defaultMetadata,
    ...metadata,
    items: sanitizedItems,
  };

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        user_id: user.id,
        amount: computedAmount,
        currency,
        status: "farm_pending",
        metadata: compressMetadata(rawMetadata),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Order insert error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const order = data ? { ...data, metadata: ensureDecompressedMetadata(data.metadata) } : data;
  return NextResponse.json({ order });
}
