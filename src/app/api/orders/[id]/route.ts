import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { compressMetadata, ensureDecompressedMetadata } from "@/lib/compression";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const profileRes = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profileRes.data?.role;

  const resolvedParams = await params;
  const orderRes = await supabase
    .from("orders")
    .select("user_id,metadata")
    .eq("id", resolvedParams.id)
    .single();

  if (orderRes.error) {
    return NextResponse.json({ error: orderRes.error.message }, { status: 500 });
  }

  const ownerId = orderRes.data?.user_id;

  const isAuthorized =
    user.id === ownerId || role === "admin" || role === "farm_owner";

  if (!isAuthorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    status?: string;
    assignedFarm?: string | null;
    adminPaymentReceived?: boolean;
    farmPaymentReceived?: boolean;
    deliveryDate?: string;
    rejectionNotes?: string;
    metadata?: Record<string, unknown>;
  };

  const status = body.status;
  const assignedFarm = body.assignedFarm;
  const adminPaymentReceived = body.adminPaymentReceived;
  const farmPaymentReceived = body.farmPaymentReceived;
  const deliveryDate = body.deliveryDate;
  const rejectionNotes = body.rejectionNotes;
  const metadata = body.metadata;

  const existingMetadata = ensureDecompressedMetadata(orderRes.data?.metadata);
  const mergedMetadata = {
    ...existingMetadata,
    ...metadata,
  };

  if (status) {
    const allowed = [
      "pending",
      "farm_pending",
      "farm_accepted",
      "farm_rejected",
      "admin_review",
      "scheduled",
      "paid",
      "failed",
      "cancelled",
    ];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
  }

  const currentMetadata = { ...mergedMetadata };

  if (typeof assignedFarm !== "undefined") {
    currentMetadata.assignedFarm = assignedFarm;
  }

  if (typeof adminPaymentReceived !== "undefined") {
    currentMetadata.adminPaymentReceived = adminPaymentReceived;
  }

  if (typeof farmPaymentReceived !== "undefined") {
    currentMetadata.farmPaymentReceived = farmPaymentReceived;
  }

  if (typeof deliveryDate === "string") {
    currentMetadata.deliveryDate = deliveryDate;
  }

  if (typeof rejectionNotes === "string") {
    currentMetadata.rejectionNotes = rejectionNotes;
  }

  const updatePayload: Record<string, unknown> = {
    metadata: compressMetadata(currentMetadata),
  };

  if (status) {
    updatePayload.status = status;
  }

  const adminClient = getSupabaseAdminClient();
  const { data, error } = await adminClient
    .from("orders")
    .update(updatePayload)
    .eq("id", resolvedParams.id)
    .select()
    .single();

  if (error) {
    console.error("Order update error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const order = data
    ? { ...data, metadata: ensureDecompressedMetadata(data.metadata) }
    : data;

  return NextResponse.json({ order });
}
