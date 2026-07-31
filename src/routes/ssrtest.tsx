import { createFileRoute } from "@tanstack/react-router";
import { energySteps } from "@/data/formConfig/energySteps";

export const Route = createFileRoute("/ssrtest")({
  component: () => <h1>ssrtest {energySteps.length}</h1>,
});
