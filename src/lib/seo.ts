import { SITE_URL } from "@/config/site";

export { SITE_URL };

/** Normalise un chemin : minuscules, sans query, sans slash final (sauf racine). */
function normalizePath(path: string) {
  const clean = (path.split("?")[0] ?? "").split("#")[0] ?? "";
  const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
  const lowered = withSlash.toLowerCase();
  if (lowered === "/") return "/";
  return lowered.replace(/\/+$/, "");
}

export const absoluteUrl = (path: string) => `${SITE_URL}${normalizePath(path)}`;

/** Balises canonical + og:url pour une route feuille. */
export function canonical(path: string) {
  return {
    meta: [{ property: "og:url", content: absoluteUrl(path) }],
    links: [{ rel: "canonical", href: absoluteUrl(path) }],
  };
}
