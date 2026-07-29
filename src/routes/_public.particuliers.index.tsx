import { createFileRoute } from "@tanstack/react-router";
import { AudienceHubPage } from "@/components/pages/audience-hub-page";

export const Route = createFileRoute("/_public/particuliers/")({
  component: () => <AudienceHubPage audience="particuliers" />,
  head: () => ({
    meta: [
      { title: "Particuliers — Énergie, télécoms, mutuelle, assurance | MERCIKI" },
      {
        name: "description",
        content:
          "MERCIKI compare et négocie pour vous vos contrats d'énergie, télécoms, mutuelle santé, assurance de prêt et vos travaux de rénovation. Service 100 % gratuit et sans engagement.",
      },
      { property: "og:title", content: "Particuliers — MERCIKI" },
      {
        property: "og:description",
        content:
          "Vos dépenses du quotidien, enfin sous contrôle. Nous comparons et négocions pour vous, gratuitement.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/particuliers" },
    ],
    links: [{ rel: "canonical", href: "/particuliers" }],
  }),
});