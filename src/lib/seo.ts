/** Domaine canonique du site. À modifier ici uniquement. */
export const SITE_URL = "https://merciki.fr";

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Balises canonical + og:url pour une route feuille. */
export function canonical(path: string) {
  return {
    meta: [{ property: "og:url", content: absoluteUrl(path) }],
    links: [{ rel: "canonical", href: absoluteUrl(path) }],
  };
}
