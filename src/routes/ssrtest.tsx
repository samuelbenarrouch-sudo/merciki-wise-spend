import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ssrtest")({
  component: () => <h1>ssrtest base</h1>,
});
