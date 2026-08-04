import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase du projet « merciki-prod ».
 * Backend principal de l'application.
 *
 * Variables d'environnement (voir .env) :
 *  - VITE_MERCIKI_SUPABASE_URL
 *  - VITE_MERCIKI_SUPABASE_PUBLISHABLE_KEY
 */
const SUPABASE_URL = import.meta.env['VITE_MERCIKI_SUPABASE_URL'] as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env[
  'VITE_MERCIKI_SUPABASE_PUBLISHABLE_KEY'
] as string;

export const merciki: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window === "undefined" ? undefined : window.localStorage,
      persistSession: typeof window !== "undefined",
      autoRefreshToken: true,
    },
  },
);