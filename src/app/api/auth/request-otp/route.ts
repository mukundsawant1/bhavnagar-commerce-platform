import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendOTPEmail } from "@/lib/email";
import { saveOtpCache } from "@/lib/otp-store";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email address is required to request OTP." }, { status: 400 });
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

    const supabase = getSupabaseAdminClient();

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

      const isTableMissing = insertError.message?.includes("Could not find the table 'public.otps'");
      if (isTableMissing) {
        if (process.env.NODE_ENV !== "production") {
          saveOtpCache(normalizedEmail, {
            code: otp,
            expires_at: expiresAt,
            attempts: 0,
            consumed: false,
          });
          console.warn("OTP table missing; using fallback cache for local development.");

          try {
            await sendOTPEmail(normalizedEmail, otp);
          } catch (emailError) {
            console.error("OTP email send failed", emailError);
            return NextResponse.json(
              { error: "Unable to send OTP email. Check email configuration." },
              { status: 500 },
            );
          }

          return NextResponse.json({
            success: true,
            message:
              "OTP sent via fallback cache (local dev only). Run database migrations to persist OTP table (supabase/migrations/20260311_add_otps_table.sql).",
            migrationRequired: true,
          });
        }

        return NextResponse.json(
          {
            error:
              "OTP table missing. Please apply database migrations and restart the app. See supabase/migrations/20260311_add_otps_table.sql.",
            migrationRequired: true,
          },
          { status: 500 },
        );
      }

      if (process.env.NODE_ENV !== "production") {
        saveOtpCache(normalizedEmail, {
          code: otp,
          expires_at: expiresAt,
          attempts: 0,
          consumed: false,
        });
        console.warn("Stored OTP in fallback cache for local dev, but DB insert failed.");
      }

      return NextResponse.json(
        { error: "Unable to store OTP. Please retry after a moment." },
        { status: 500 },
      );
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
