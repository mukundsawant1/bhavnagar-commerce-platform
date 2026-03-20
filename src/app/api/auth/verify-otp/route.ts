import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { enforceRateLimit } from "@/lib/rate-limit";

const isValidGmail = (email: string) => /^[^\s@]+@gmail\.com$/i.test(email.trim());

async function ensureUserExists({
  email,
  fullName,
  surname,
  role,
}: {
  email: string;
  fullName?: string;
  surname?: string;
  role?: string;
}) {
  const supabase = getSupabaseAdminClient();

  type AdminAuthType = {
    createUser?: (payload: Record<string, unknown>) => Promise<{ data?: unknown; error?: { message?: string } }>;
  };

  const admin = supabase.auth.admin as unknown as AdminAuthType;

  // Ensure the user exists in Supabase with metadata (no direct password from frontend required).
  // On role and profile, store role and name with user metadata.
  // NOTE: choose strong generated password to avoid password usage by client.
  const randomPassword = Math.random().toString(36).slice(-12) + "A1!";

  const payload: Record<string, unknown> = {
    email,
    password: randomPassword,
    email_confirm: true,
    user_metadata: {
      full_name: fullName ?? "",
      surname: surname ?? "",
      role: role ?? "buyer",
    },
  };

  // Due to API differences, this method may throw if user exists. we ignore that.
  try {
    if (typeof admin.createUser === "function") {
      const { data, error } = await admin.createUser(payload);
      if (error) {
        if (error.message?.toLowerCase().includes("already exists")) {
          return { exists: true };
        }
        return { error: error.message };
      }
      return { success: true, data };
    }

    return { error: "Supabase admin createUser not available." };
  } catch (err) {
    if (err instanceof Error && err.message.toLowerCase().includes("already exists")) {
      return { exists: true };
    }
    return { error: err instanceof Error ? err.message : "Unknown error." };
  }
}

export async function POST(request: Request) {
  try {
    const { email, code, fullName, surname, role } =
      (await request.json()) as {
        email?: string;
        code?: string;
        fullName?: string;
        surname?: string;
        role?: string;
      };

    if (!email || !isValidGmail(email) || !code) {
      return NextResponse.json(
        { error: "Email and OTP code are required (Gmail only)." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for") ||
      "unknown";
    const rateKey = `otp_verify:${normalizedEmail}:${ip}`;
    const rate = await enforceRateLimit(rateKey);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: rate.reason,
          message: "Too many OTP verification attempts. Please wait before retrying.",
        },
        { status: 429 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase configuration is missing." }, { status: 500 });
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    });

    const { data: rows, error: selectError } = await supabase
      .from("otps")
      .select("id,code,expires_at,attempts,consumed")
      .eq("email", normalizedEmail)
      .eq("consumed", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (selectError) {
      console.error("OTP select error", selectError);
      return NextResponse.json({ error: "Unable to verify OTP." }, { status: 500 });
    }

    const entry = rows?.[0];

    if (!entry || new Date(entry.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "OTP is invalid or expired." }, { status: 401 });
    }

    if (entry.attempts >= 3) {
      return NextResponse.json({ error: "Maximum OTP verification attempts reached." }, { status: 429 });
    }

    if (entry.code !== code) {
      const { error: updateError } = await supabase
        .from("otps")
        .update({ attempts: entry.attempts + 1 })
        .eq("id", entry.id);

      if (updateError) {
        console.error("OTP attempt update error", updateError);
      }

      return NextResponse.json({ error: "OTP is invalid." }, { status: 401 });
    }

    // mark consumed
    await supabase.from("otps").update({ consumed: true }).eq("id", entry.id);

    const result = await ensureUserExists({
      email: normalizedEmail,
      fullName,
      surname,
      role,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP verified; you may continue to authenticate with Google." });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unable to verify OTP." },
      { status: 500 },
    );
  }
}
