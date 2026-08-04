import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS, LEADGEN_AUTH_KEY } from "@/data/products";

export const Route = createFileRoute("/_public/produits/")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(LEADGEN_AUTH_KEY) !== "true") {
      throw redirect({ to: "/leadgeneration/login" });
    }
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Parcours produits — MERCIKI" },
      {
        name: "description",
        content:
          "Accédez aux parcours de qualification et de soumission de dossier MERCIKI.",
      },
      { property: "og:title", content: "Parcours produits — MERCIKI" },
      {
        property: "og:description",
        content: "Parcours de qualification et de soumission de dossier MERCIKI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProduitsIndex,
});

function ProduitsIndex() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        <h1 className="text-h1 text-ink">Parcours produits</h1>
        <p className="mt-3 max-w-2xl text-body text-slate">
          Sélectionnez un parcours pour démarrer une qualification ou soumettre
          un dossier.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            const isPro = p.id === "energie-pro";
            const card = (
              <>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-accent">
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </span>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <h2 className="text-h3 text-ink">
                    {isPro ? "Énergie Pro" : p.label}
                  </h2>
                  {isPro && (
                    <Badge variant="accent-soft">Interne / Commerciaux</Badge>
                  )}
                </div>
                <p className="mt-2 flex-1 text-small text-slate">
                  {isPro
                    ? "Soumission de dossier énergie pour les professionnels."
                    : p.description}
                </p>
                <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary">
                  {isPro ? "Soumettre un dossier" : "Démarrer un lead"}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </>
            );
            return isPro ? (
              <Link
                key={p.id}
                to="/produits/energie-pro"
                className="flex flex-col rounded-2xl bg-background p-6 shadow-soft transition-shadow hover:shadow-medium"
              >
                {card}
              </Link>
            ) : (
              <Link
                key={p.id}
                to="/leadgeneration/product/$productId"
                params={{ productId: p.id }}
                className="flex flex-col rounded-2xl bg-background p-6 shadow-soft transition-shadow hover:shadow-medium"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}