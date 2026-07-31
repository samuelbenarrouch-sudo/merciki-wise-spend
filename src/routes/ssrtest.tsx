import { createFileRoute } from "@tanstack/react-router";
import { EnergyForm } from "@/components/forms/EnergyForm";

export const Route = createFileRoute("/ssrtest")({
  component: () => <div><h1>ssrtest</h1><EnergyForm /></div>,
});
