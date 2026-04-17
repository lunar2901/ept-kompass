import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for Route Handlers and Server Components.
 * Respects RLS — uses the anon key and the authenticated user's session.
 *
 * Auth is skipped at MVP (anonymous dev); RLS allows unauthenticated
 * reads of content tables via a public read policy in a follow-up
 * migration (see 0002_public_reads.sql). Per-user tables remain locked.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component; ignore. Middleware refreshes
            // the session cookie in a request that can write cookies.
          }
        },
      },
    },
  );
}

/**
 * Service-role client — bypasses RLS. Use only in seed scripts and
 * server-only routes. NEVER expose to the browser.
 */
export function createServiceClient() {
  return createSupabaseClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v)
    throw new Error(
      `Missing env var: ${name}. Copy .env.example to .env.local and fill in.`,
    );
  return v;
}
