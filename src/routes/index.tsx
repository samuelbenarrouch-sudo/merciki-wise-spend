import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Container className="flex min-h-screen flex-col items-start justify-center py-16">
        <span className="text-label uppercase text-accent tracking-wider">
          Fondations prêtes
        </span>
        <h1 className="mt-3 text-h1 text-ink">MERCIKI</h1>
        <p className="mt-4 max-w-xl text-body text-slate">
          Optimisation des dépenses en énergie, télécoms, assurances, énergies
          renouvelables et monétique. Les pages arrivent bientôt.
        </p>
      </Container>
    </main>
  );
}
