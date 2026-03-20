import { NextResponse } from "next/server";
import { setOtp } from "@/lib/auth/otp-store";
import { enforceRateLimit } from "@/lib/rate-limit";

const isValidGmail = (email: string) => /^[^\s@]+@gmail\.com$/i.test(email.trim());

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

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

    if (!email || !isValidGmail(email)) {
      return NextResponse.json(
        { error: "Valid Gmail address is required to request OTP." },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    setOtp(normalizedEmail, otp, expiresAt);

    // For real production use send this OTP email via a secure provider (Resend/Supabase SMTP).
    // We are logging the code here for dev visibility.
    console.info(`OTP for ${normalizedEmail}: ${otp}`);

    return NextResponse.json({
      success: true,
      message:
        "If the email is registered, an OTP has been generated and will be sent. Follow the next step.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unable to generate OTP." },
      { status: 500 },
    );
  }
}
