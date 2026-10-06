import { createFileRoute } from "@tanstack/react-router";
import { AudienceHubPage } from "@/components/pages/audience-hub-page";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/_public/particuliers/")({
  component: () => <AudienceHubPage audience="particuliers" />,
  head: () => ({
    meta: [
      { title: "Particuliers — Énergie, télécoms, mutuelle, assurance | « Merciki ? »" },
      {
        name: "description",
        content:
          "« Merciki ? » compare et négocie pour vous vos contrats d'énergie, télécoms, mutuelle santé, assurance de prêt et vos travaux de rénovation. Service 100 % gratuit et sans engagement.",
      },
      { property: "og:title", content: "Particuliers — « Merciki ? »" },
      {
        property: "og:description",
        content:
          "Vos dépenses du quotidien, enfin sous contrôle. Nous comparons et négocions pour vous, gratuitement.",
      },
      { property: "og:type", content: "website" },
      ...canonical("/particuliers").meta,
    ],
    links: canonical("/particuliers").links,
  }),
});