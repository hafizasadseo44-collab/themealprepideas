import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous, cookie-less client for public reads (published posts, categories).
 * Safe to use anywhere, including generateStaticParams/generateMetadata, where
 * Next.js forbids calling cookies() (the session-aware client in server.ts
 * needs cookies() and can only run inside an actual request).
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
