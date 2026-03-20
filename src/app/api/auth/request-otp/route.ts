import { NextResponse } from "next/server";
import { setOtp } from "@/lib/auth/otp-store";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getResendClient } from "@/lib/notifications/email";

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

    if (!process.env.RESEND_API_KEY) {
      const fallbackMessage =
        process.env.NODE_ENV === "production"
          ? "OTP delivery service is not configured. Please contact support."
          : `OTP generated in development mode: ${otp}. Use this code to complete verification.`;

      console.warn("RESEND_API_KEY is not configured for OTP email delivery.");
      console.info(`Development OTP code for ${normalizedEmail}: ${otp}`);

      return NextResponse.json({
        success: true,
        message: fallbackMessage,
      });
    }

    try {
      const resend = getResendClient();
      await resend.emails.send({
        from: "no-reply@bhavnagar.com",
        to: normalizedEmail,
        subject: "Your login OTP for Bhavnagar Commerce",
        text: `Your one-time passcode is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
      });
    } catch (emailError) {
      console.error("OTP email send failed", emailError);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to send OTP email at this time. Please try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent if the email is registered. Check your inbox and spam folder.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unable to generate OTP." },
      { status: 500 },
    );
  }
}
