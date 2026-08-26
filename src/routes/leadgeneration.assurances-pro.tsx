import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";
import { AssurancesProForm } from "@/components/forms/AssurancesProForm";

export const Route = createFileRoute("/leadgeneration/assurances-pro")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Soumission dossier Assurances Professionnelles — MERCIKI" },
      {
        name: "description",
        content:
          "Formulaire interne réservé aux commerciaux MERCIKI : RC Pro, RC Exploitation, Garantie Décennale.",
      },
      {
        property: "og:title",
        content: "Soumission dossier Assurances Professionnelles — MERCIKI",
      },
      {
        property: "og:description",
        content: "Formulaire interne de soumission de dossier assurances professionnelles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssurancesProPage,
});

function AssurancesProPage() {
  return (
    <div className="py-12 lg:py-16">
      <Container>
        <div className="max-w-3xl">
          <Badge variant="accent-soft">Interne / Commerciaux</Badge>
          <h1 className="mt-4 text-h1 text-ink">
            Soumission dossier Assurances Professionnelles
          </h1>
          <p className="mt-3 text-body text-slate">
            RC Pro, RC Exploitation, Garantie Décennale
          </p>
        </div>
        <div className="mt-10 max-w-3xl">
          <AssurancesProForm />
        </div>
      </Container>
    </div>
  );
}
