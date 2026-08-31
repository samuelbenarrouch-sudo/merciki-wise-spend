import { createFileRoute } from "@tanstack/react-router";
import { EnergyForm } from "@/components/forms/EnergyForm";

export const Route = createFileRoute("/_public/devformtest")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => <EnergyForm />,
});
