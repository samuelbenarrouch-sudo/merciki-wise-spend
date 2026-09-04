import { createFileRoute } from "@tanstack/react-router";
import { AudienceHubPage } from "@/components/pages/audience-hub-page";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/_public/professionnels/")({
  component: () => <AudienceHubPage audience="professionnels" />,
  head: () => ({
    meta: [
      { title: "Professionnels — Énergie, monétique et assurances | MERCIKI" },
      {
        name: "description",
        content:
          "MERCIKI négocie vos contrats d'énergie professionnels et met en concurrence les solutions d'encaissement pour votre entreprise. Service 100 % gratuit et sans interruption d'activité.",
      },
      { property: "og:title", content: "Professionnels — MERCIKI" },
      {
        property: "og:description",
        content:
          "Moins de charges, un meilleur encaissement. Un interlocuteur unique pour vos contrats d'entreprise.",
      },
      { property: "og:type", content: "website" },
      ...canonical("/professionnels").meta,
    ],
    links: canonical("/professionnels").links,
  }),
});