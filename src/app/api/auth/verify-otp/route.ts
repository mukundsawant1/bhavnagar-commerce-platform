import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getOtpCache, markOtpCacheConsumed, incrementOtpCacheAttempts } from "@/lib/otp-store";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

async function ensureUserExists({
  email,
  fullName,
  surname,
  role,
  password,
}: {
  email: string;
  fullName?: string;
  surname?: string;
  role?: string;
  password: string;
}) {
  const supabase = getSupabaseAdminClient();

  type AdminAuthType = {
    createUser?: (payload: Record<string, unknown>) => Promise<{ data?: { user?: { id: string } }; error?: { message?: string } }>;
    listUsers?: (opts?: { page?: number; perPage?: number }) => Promise<{ data?: { users?: Array<{ id: string; email?: string }> }; error?: { message?: string } }>;
    updateUserById?: (id: string, payload: Record<string, unknown>) => Promise<{ data?: { user?: { id: string } }; error?: { message?: string } }>;
  };

  const admin = supabase.auth.admin as unknown as AdminAuthType;

  const userMetadata = {
    full_name: fullName ?? "",
    surname: surname ?? "",
    role: role ?? "buyer",
  };

  const getExistingUser = async () => {
    if (typeof admin.listUsers !== "function") return null;

    const { data, error } = await admin.listUsers({ page: 1, perPage: 100 });
    if (error || !data?.users) return null;

    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    return found ?? null;
  };

  const existingUser = await getExistingUser();

  if (existingUser) {
    if (typeof admin.updateUserById !== "function") {
      return { error: "Supabase admin updateUserById not available." };
    }

    const updateResult = await admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: userMetadata,
    });

    if (!updateResult) {
      return { error: "Failed to update existing user." };
    }

    const { data, error } = updateResult;

    if (error) {
      return { error: error.message || "Unable to update existing user." };
    }

    return { success: true, userId: existingUser.id, user: data?.user ?? existingUser };
  }

  if (typeof admin.createUser !== "function") {
    return { error: "Supabase admin createUser not available." };
  }

  const { data, error } = await admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userMetadata,
  });

  if (error) {
    if (error.message?.toLowerCase().includes("already exists")) {
      return { exists: true };
    }
    return { error: error.message };
  }

  return { success: true, userId: data?.user?.id, user: data?.user };
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

    if (!email || !isValidEmail(email) || !code) {
      return NextResponse.json(
        { error: "Valid email and OTP code are required." },
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

    const supabase = getSupabaseAdminClient();

    const now = new Date().toISOString();

    const { data: rows, error: selectError } = await supabase
      .from("otps")
      .select("id,code,expires_at,attempts,consumed")
      .eq("email", normalizedEmail)
      .eq("consumed", false)
      .gte("expires_at", now)
      .order("created_at", { ascending: false })
      .limit(1);

    if (selectError) {
      console.error("OTP select error", selectError);
      return NextResponse.json({ error: "Unable to verify OTP." }, { status: 500 });
    }

    let entry = rows?.[0] ?? null;
    let isFallback = false;

    if (!entry) {
      const cached = getOtpCache(normalizedEmail);
      if (cached && !cached.consumed && new Date(cached.expires_at).getTime() >= Date.now()) {
        entry = cached;
        isFallback = true;
      }
    }

    if (!entry) {
      return NextResponse.json({ error: "OTP is invalid or expired." }, { status: 401 });
    }

    if (entry.attempts >= 3) {
      return NextResponse.json(
        {
          error:
            "Maximum OTP verification attempts reached. Your account is locked for 15 minutes.",
          help: "Please contact support@bhavnagarstore.com for assistance.",
        },
        { status: 429 },
      );
    }

    if (entry.code !== code.trim()) {
      const newAttempts = entry.attempts + 1;

      if (!isFallback && entry.id) {
        const { error: updateError } = await supabase
          .from("otps")
          .update({ attempts: newAttempts })
          .eq("id", entry.id);

        if (updateError) {
          console.error("OTP attempt update error", updateError);
        }
      } else {
        incrementOtpCacheAttempts(normalizedEmail);
      }

      if (newAttempts >= 3) {
        return NextResponse.json(
          {
            error:
              "Maximum OTP attempts used. Account locked for 15 minutes.",
            help: "Please contact support@bhavnagarstore.com",
          },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          error: `OTP is invalid. ${3 - newAttempts} attempt(s) remaining before lock.`,
          attemptsRemaining: 3 - newAttempts,
        },
        { status: 401 },
      );
    }

    if (!isFallback && entry.id) {
      await supabase.from("otps").update({ consumed: true }).eq("id", entry.id);
    } else {
      markOtpCacheConsumed(normalizedEmail);
    }

    const result = await ensureUserExists({
      email: normalizedEmail,
      fullName,
      surname,
      role,
      password: code,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified; user created/updated and ready to sign in with OTP or Google.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unable to verify OTP." },
      { status: 500 },
    );
  }
}
