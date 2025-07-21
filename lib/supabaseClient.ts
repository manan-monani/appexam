import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Initializes Supabase client for database and auth operations
// Reference: HackerRank Clone document, Section 3.1 (Supabase Integration)

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}