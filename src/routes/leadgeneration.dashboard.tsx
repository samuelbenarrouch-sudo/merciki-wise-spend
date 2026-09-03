import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/data/products";
import { useAuth } from "@/lib/auth";


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
  const { profile } = useAuth();
  const isManager = profile?.role === "manager";

  return

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

        <section className="mt-12 rounded-2xl border border-mist bg-mist/40 p-5 sm:p-6">
          <h2 className="text-label uppercase tracking-wider text-slate">Mes dossiers</h2>
          <p className="mt-2 text-small text-slate">
            Consultation en lecture seule des leads déjà enregistrés.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/leadgeneration/mes-leads"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-background px-5 text-small font-medium text-primary transition-colors hover:bg-primary-light"
            >
              <FolderOpen className="h-5 w-5" strokeWidth={1.75} />
              Mes leads
            </Link>
            {isManager && (
              <Link
                to="/leadgeneration/equipe-leads"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-background px-5 text-small font-medium text-primary transition-colors hover:bg-primary-light"
              >
                <Users className="h-5 w-5" strokeWidth={1.75} />
                Leads de mon équipe
              </Link>
            )}
          </div>
        </section>
      </Container>

    </div>
  );
}