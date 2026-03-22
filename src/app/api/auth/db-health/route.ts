import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function getGitInfo() {
  const branch =
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GIT_BRANCH ||
    process.env.BRANCH ||
    "unknown";
  const commit =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GIT_COMMIT_SHA ||
    process.env.COMMIT_SHA ||
    "unknown";
  return { branch, commit };
}

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data: rows, error: selectError } = await supabase
      .from("otps")
      .select("id")
      .limit(1);

    if (selectError) {
      if (selectError.message?.includes("Could not find the table 'public.otps'")) {
        return NextResponse.json(
          {
            healthy: false,
            db: "unhealthy",
            migrationRequired: true,
            error: "otps table missing. Please run database migrations (supabase/migrations/20260311_add_otps_table.sql).",
            timestamp: new Date().toISOString(),
            ...getGitInfo(),
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          healthy: false,
          db: "unhealthy",
          dbError: selectError.message,
          timestamp: new Date().toISOString(),
          ...getGitInfo(),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      healthy: true,
      db: "ok",
      sampleOtps: rows?.length ?? 0,
      migrationRequired: false,
      timestamp: new Date().toISOString(),
      ...getGitInfo(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        healthy: false,
        db: "exception",
        error: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString(),
        ...getGitInfo(),
      },
      { status: 500 },
    );
  }
}
