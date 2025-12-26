import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Use fallback empty strings to avoid build-time errors
  // Validation will happen at runtime when the client is actually used
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

