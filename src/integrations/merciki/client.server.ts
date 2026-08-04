import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase « merciki-prod » côté serveur (clé publique, pas de session).
 * À utiliser uniquement dans les handlers de server functions / server routes.
 */
export function createMercikiServerClient(): SupabaseClient {
  const url = process.env['MERCIKI_SUPABASE_URL']!;
  const key = process.env['MERCIKI_SUPABASE_PUBLISHABLE_KEY']!;

  return createClient(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      // Les clés opaques `sb_*` ne sont pas des JWT : on n'envoie que `apikey`.
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}