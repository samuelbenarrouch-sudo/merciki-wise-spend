import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SITE_URL } from "@/config/site";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-5">
      <div className="max-w-md text-center">
        <p className="text-label uppercase text-accent tracking-wider">Erreur 404</p>
        <h1 className="mt-3 text-h1 text-ink">Page introuvable</h1>
        <p className="mt-4 text-body text-slate">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-5">
      <div className="max-w-md text-center">
        <h1 className="text-h2 text-ink">
          Cette page n'a pas pu se charger
        </h1>
        <p className="mt-3 text-body text-slate">
          Une erreur s'est produite. Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-primary bg-transparent px-6 text-base font-medium text-primary transition-colors hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MERCIKI — Optimisez vos dépenses" },
      {
        name: "description",
        content:
          "MERCIKI aide particuliers et professionnels à réduire leurs dépenses : énergie, télécoms, assurances, énergies renouvelables et monétique.",
      },
      { name: "author", content: "MERCIKI" },
      {
        name: "keywords",
        content:
          "énergie, télécoms, assurances, énergies renouvelables, monétique, économies, comparateur",
      },
      { property: "og:site_name", content: "MERCIKI" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:title", content: "MERCIKI — Optimisez vos dépenses" },
      {
        property: "og:description",
        content:
          "MERCIKI aide particuliers et professionnels à réduire leurs dépenses : énergie, télécoms, assurances, énergies renouvelables et monétique.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MERCIKI — Optimisez vos dépenses" },
      { name: "twitter:description", content: "MERCIKI aide particuliers et professionnels à réduire leurs dépenses : énergie, télécoms, assurances, énergies renouvelables et monétique." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1b3ac121-a71f-4342-8b25-dd1ab52ab717/id-preview-3ae99f70--e7b9f07b-7e1e-446b-beab-ff90bdcee9f6.lovable.app-1785323307490.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1b3ac121-a71f-4342-8b25-dd1ab52ab717/id-preview-3ae99f70--e7b9f07b-7e1e-446b-beab-ff90bdcee9f6.lovable.app-1785323307490.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "MERCIKI",
        url: SITE_URL,
        description:
          "MERCIKI aide les particuliers et professionnels à optimiser leurs dépenses contraintes : énergie, télécoms, assurances, énergies renouvelables et monétique.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+33-7-56-90-63-70",
          contactType: "Customer Service",
          areaServed: "FR",
          availableLanguage: "French",
        },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
