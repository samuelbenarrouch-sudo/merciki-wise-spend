import { createFileRoute } from "@tanstack/react-router";
import { FormTextField } from "@/components/forms/FormFields";

export const Route = createFileRoute("/ssrtest")({
  component: () => <h1>ssrtest {FormTextField ? "ok2" : "no"}</h1>,
});
