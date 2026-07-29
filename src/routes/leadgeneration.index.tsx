import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/leadgeneration/")({
  beforeLoad: () => {
    throw redirect({ to: "/leadgeneration/dashboard" });
  },
});