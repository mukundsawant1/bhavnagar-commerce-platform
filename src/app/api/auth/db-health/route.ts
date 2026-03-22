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
    const { data, error } = await supabase.from("otps").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        {
          healthy: false,
          db: "unhealthy",
          dbError: error.message,
          timestamp: new Date().toISOString(),
          ...getGitInfo(),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      healthy: true,
      db: "ok",
      sampleOtps: data?.length ?? 0,
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
