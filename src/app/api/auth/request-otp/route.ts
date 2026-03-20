import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendOTPEmail } from "@/lib/email";

const isValidGmail = (email: string) => /^[^\s@]+@gmail\.com$/i.test(email.trim());

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || !isValidGmail(email)) {
      return NextResponse.json({ error: "Valid Gmail address is required to request OTP." }, { status: 400 });
    }

    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for") ||
      "unknown";
    const rateKey = `otp_request:${email}:${ip}`;
    const rate = await enforceRateLimit(rateKey);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: rate.reason,
          message: "Too many OTP requests. Please wait before retrying.",
        },
        { status: 429 },
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: "EMAIL_USER and EMAIL_PASS must be configured for email delivery." },
        { status: 500 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

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

    const { error: insertError } = await supabase.from("otps").insert([
      {
        email: normalizedEmail,
        code: otp,
        expires_at: expiresAt,
        attempts: 0,
        consumed: false,
      },
    ]);

    if (insertError) {
      console.error("OTP insert error", insertError);
      return NextResponse.json({ error: "Unable to store OTP." }, { status: 500 });
    }

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("OTP email send failed", emailError);
      return NextResponse.json({ error: "Unable to send OTP email. Check email configuration." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent to your email. Please check inbox and spam." });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unable to generate OTP." },
      { status: 500 },
    );
  }
}
