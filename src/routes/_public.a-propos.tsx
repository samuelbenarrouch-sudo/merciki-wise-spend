import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";

export const Route = createFileRoute("/_public/a-propos")({
  component: () => (
    <Container className="py-16 md:py-24">
      <h1 className="text-h1 text-ink">À propos</h1>
    </Container>
  ),
});