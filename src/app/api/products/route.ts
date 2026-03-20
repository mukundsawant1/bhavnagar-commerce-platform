import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { decompressMetadata } from "@/lib/compression";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });

  const { data, error } = await supabase.from("products").select("id,name,description,image_url,metadata").order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data ?? []).map((prod) => ({
    ...prod,
    metadata: decompressMetadata(prod.metadata),
  }));

  return NextResponse.json({ products });
}
