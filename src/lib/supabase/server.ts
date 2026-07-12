import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Resolve URL — Vercel integration injects SUPABASE_URL (no NEXT_PUBLIC_ prefix)
function getUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    ""
  );
}

// For server API routes — use service role key if available (bypasses RLS, always works)
// Vercel integration auto-injects SUPABASE_SERVICE_ROLE_KEY
function getKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ""
  );
}

// Use in API routes that don't need cookie-based auth
export function createAdminClient() {
  const url = getUrl();
  const key = getKey();
  if (!url || !key) {
    console.error("[supabase/server] Missing URL or key. URL:", url ? "ok" : "MISSING", "Key:", key ? "ok" : "MISSING");
  }
  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
}

// Use in pages/components that need cookie-based session
export async function createClient() {
  const cookieStore = await cookies();
  const url = getUrl();
  const key = getKey();
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}
