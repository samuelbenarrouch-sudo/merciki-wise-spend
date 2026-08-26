import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const PATH_RE =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/[^/]+$/;

function isValidPath(path: string | null): path is string {
  if (!path) return false;
  if (path.startsWith("/")) return false;
  if (path.includes("..")) return false;
  if (!PATH_RE.test(path)) return false;
  const name = path.split("/")[1];
  return Boolean(name && name.trim().length > 0);
}

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

export const Route = createFileRoute("/api/lead-file")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = authHeader.slice("Bearer ".length).trim();
        if (!token) return new Response("Unauthorized", { status: 401 });

        const path = new URL(request.url).searchParams.get("path");
        if (!isValidPath(path)) {
          return new Response("Paramètre path invalide", { status: 400 });
        }

        const SUPABASE_URL = process.env["SUPABASE_URL"];
        const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return new Response("Configuration serveur incomplète", { status: 500 });
        }

        // Client utilisateur (clé publiable + jeton porteur) : les politiques
        // de stockage s'appliquent. Aucune clé de service ici.
        const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: {
            headers: { Authorization: `Bearer ${token}` },
            fetch: (input, init) => {
              const headers = new Headers(
                typeof Request !== "undefined" && input instanceof Request
                  ? input.headers
                  : undefined,
              );
              if (init?.headers) {
                new Headers(init.headers).forEach((v, k) => headers.set(k, v));
              }
              if (
                isNewSupabaseApiKey(SUPABASE_PUBLISHABLE_KEY) &&
                headers.get("Authorization") === `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
              ) {
                headers.delete("Authorization");
              }
              headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
              headers.set("Authorization", `Bearer ${token}`);
              return fetch(input, { ...init, headers });
            },
          },
          auth: {
            storage: undefined,
            persistSession: false,
            autoRefreshToken: false,
          },
        });

        const { data, error } = await supabase.storage.from("lead-files").download(path);
        if (error || !data) {
          return new Response("Fichier introuvable", { status: 404 });
        }

        const fileName = path.split("/")[1] ?? "document";
        const safeName = fileName.replace(/["\\\r\n]/g, "_");

        return new Response(data, {
          status: 200,
          headers: {
            "Content-Type": data.type || "application/octet-stream",
            "Content-Disposition": `inline; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
            "Cache-Control": "private, no-store",
          },
        });
      },
    },
  },
});
