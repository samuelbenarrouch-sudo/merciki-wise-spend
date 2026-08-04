import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { EnergieProForm } from "@/components/forms/EnergieProForm";

export const Route = createFileRoute("/_public/produits/energie-pro")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Soumission dossier Énergie pour les Pros — MERCIKI" },
      {
        name: "description",
        content:
          "Formulaire réservé aux commerciaux MERCIKI : transmettez le dossier énergie complet de votre client professionnel.",
      },
      {
        property: "og:title",
        content: "Soumission dossier Énergie pour les Pros — MERCIKI",
      },
      {
        property: "og:description",
        content:
          "Formulaire interne de soumission de dossier énergie professionnel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EnergieProPage,
});

function EnergieProPage() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        <div className="max-w-3xl">
          <Badge variant="accent-soft">Interne / Commerciaux</Badge>
          <h1 className="mt-4 text-h1 text-ink">
            Soumission dossier Énergie pour les Pros
          </h1>
          <p className="mt-3 text-body text-slate">
            Formulaire réservé aux commerciaux Merciki — transmettez le dossier
            complet de votre client professionnel.
          </p>
        </div>
        <div className="mt-10 max-w-3xl">
          <EnergieProForm />
        </div>
      </Container>
    </div>
  );
}