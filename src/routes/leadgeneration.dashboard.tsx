import { createFileRoute, Link } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/data/products";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/leadgeneration/dashboard")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Tableau de bord — Espace commercial MERCIKI" },
    ],
  }),
  component: CommercialDashboard,
});

function CommercialDashboard() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-h2 text-ink">Bienvenue dans votre espace commercial.</h1>
          <p className="mt-4 text-body text-slate">
            Sélectionnez une verticale pour commencer à qualifier un lead.
            Les données seront automatiquement enregistrées dans votre feuille de suivi.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            const isPro = p.id === "energie-pro";
            if (p.id === "assurances-pro") {
              return (
                <Link
                  key={p.id}
                  to="/leadgeneration/assurances-pro"
                  className="group flex flex-col items-center rounded-2xl bg-background p-6 text-center shadow-soft transition-shadow hover:shadow-medium"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-accent">
                    <Icon className="h-8 w-8" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-h3 text-ink">Assurances Pro</h3>
                  <Badge variant="accent-soft" className="mt-2">
                    Interne / Commerciaux
                  </Badge>
                  <p className="mt-2 flex-1 text-small text-slate">
                    RC Pro, RC Exploitation, Garantie Décennale
                  </p>
                  <Button variant="primary" size="sm" className="mt-5">
                    Soumettre un dossier
                  </Button>
                </Link>
              );
            }
            if (isPro) {
              return (
                <Link
                  key={p.id}
                  to="/leadgeneration/product/$productId"
                  params={{ productId: p.id }}
                  className="group flex flex-col items-center rounded-2xl bg-background p-6 text-center shadow-soft transition-shadow hover:shadow-medium"
                >
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-accent">
                    <Icon className="h-8 w-8" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 text-h3 text-ink">Énergie Pro</h3>
                  <Badge variant="accent-soft" className="mt-2">
                    Interne / Commerciaux
                  </Badge>
                  <p className="mt-2 flex-1 text-small text-slate">
                    Soumission de dossier énergie pour les professionnels
                  </p>
                  <Button variant="primary" size="sm" className="mt-5">
                    Soumettre un dossier
                  </Button>
                </Link>
              );
            }
            return (
              <Link
                key={p.id}
                to="/leadgeneration/product/$productId"
                params={{ productId: p.id }}
                className="group flex flex-col items-center rounded-2xl bg-background p-6 text-center shadow-soft transition-shadow hover:shadow-medium"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-accent">
                  <Icon className="h-8 w-8" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-h3 text-ink">{p.label}</h3>
                <p className="mt-2 flex-1 text-small text-slate">{p.description}</p>
                <Button variant="primary" size="sm" className="mt-5">
                  Démarrer un lead
                </Button>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}