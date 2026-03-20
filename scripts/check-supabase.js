#!/usr/bin/env node

/**
 * Simple health check for Supabase connectivity.
 *
 * Usage:
 *   node scripts/check-supabase.js
 *   npm run check:supabase
 *
 * This script validates the required Supabase env vars are present and attempts
 * to query a small dataset to confirm the connection.
 */

try {
  // Load .env.local for local development.
  require("dotenv").config({ path: ".env.local" });
} catch {
  // noop
}

const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!url || !anonKey) {
  console.warn("Supabase config missing - skipping health check.\n" +
    "To enable validation, set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.");
  process.exit(0);
}

const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
  global: { headers: { "x-application-name": "bhavnagar-healthcheck" } },
});

(async () => {
  try {
    const { data, error } = await supabase.from("profiles").select("id").limit(1);
    if (error) {
      console.error("Supabase query failed:", error.message);
      process.exit(1);
    }

    console.log("Supabase connection is healthy.");
    if (Array.isArray(data)) {
      console.log(`Found ${data.length} profile(s) (query successful).`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Unexpected error checking Supabase:", error);
    process.exit(1);
  }
})();
