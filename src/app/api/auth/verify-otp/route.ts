import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteOtp, getOtp } from "@/lib/auth/otp-store";

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
    const entry = getOtp(normalizedEmail);

    if (!entry || entry.code !== code || entry.expiresAt < Date.now()) {
      return NextResponse.json({ error: "OTP is invalid or expired." }, { status: 401 });
    }

    deleteOtp(normalizedEmail);

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
