import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";

const missingEnvMessage =
  "Supabase URL and public API key are required.\n" +
  "Set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY in your environment.\n" +
  "See README / docs for configuration details.";

type SupabaseClientType = ReturnType<typeof createBrowserClient>;

function createMissingClient(): SupabaseClientType {
  const handler: ProxyHandler<object> = {
    get() {
      throw new Error(missingEnvMessage);
    },
    apply() {
      throw new Error(missingEnvMessage);
    },
    construct() {
      throw new Error(missingEnvMessage);
    },
  };

  return new Proxy(() => undefined, handler) as unknown as SupabaseClientType;
}

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    return createMissingClient();
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
