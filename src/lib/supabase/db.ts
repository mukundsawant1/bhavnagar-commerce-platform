// NOTE: This code path is kept server-only and must not be bundled into client-side code.
// The app relies on Supabase migrations to create required tables for security and operational predictability.

export async function ensureOtpTable(): Promise<void> {
  throw new Error(
    "Missing otps table. Run Supabase migrations (supabase/migrations/20260311_add_otps_table.sql) and redeploy. " +
      "Auto-create via direct pg client is disabled to avoid including native DB drivers in Next.js serverless builds.",
  );
}

