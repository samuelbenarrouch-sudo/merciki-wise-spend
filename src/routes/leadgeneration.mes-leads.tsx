import { createFileRoute } from "@tanstack/react-router";
import { MyLeadsList } from "@/components/leads/my-leads-list";

export const Route = createFileRoute("/leadgeneration/mes-leads")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Mes leads — Espace commercial MERCIKI" },
    ],
  }),
  component: MyLeadsPage,
});

function MyLeadsPage() {
  return <MyLeadsList />;
}
