import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      if (error.message?.includes("Could not find the table 'public.otps'")) {
        return NextResponse.json(
          {
            healthy: false,
            error: "otps table missing. Please run your database migrations (supabase/migrations/20260311_add_otps_table.sql).",
            migrationRequired: true,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({ healthy: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ healthy: true, sampleProfiles: data?.length ?? 0 });
  } catch (err) {
    return NextResponse.json(
      { healthy: false, error: err instanceof Error ? err.message : "Unknown" },
      { status: 500 },
    );
  }
}
