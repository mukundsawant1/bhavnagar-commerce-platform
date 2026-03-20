import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { compressMetadata } from "@/lib/compression";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim() ?? "";

    if (!file || !name) {
      return NextResponse.json({ error: "Name and image file are required." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only jpg/png/webp allowed." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    });

    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${file.name}`;
    const filePath = `public/${uniqueName}`;

    const fileBlob = file as Blob;
    const { error: uploadError, data: storageData } = await supabase
      .storage
      .from("products")
      .upload(filePath, fileBlob, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const urlRes = supabase.storage.from("products").getPublicUrl(storageData.path);
    const publicUrl = urlRes.data?.publicUrl ?? "";

    const { error: insertError } = await supabase.from("products").insert([
      {
        name,
        description,
        image_url: publicUrl,
        metadata: compressMetadata({ description }),
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, image_url: publicUrl });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unable to upload file." }, { status: 500 });
  }
}
