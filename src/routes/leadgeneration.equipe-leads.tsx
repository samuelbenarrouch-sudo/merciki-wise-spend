import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { MyLeadsList } from "@/components/leads/my-leads-list";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/leadgeneration/equipe-leads")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Leads de mon équipe — Espace commercial MERCIKI" },
    ],
  }),
  component: TeamLeadsPage,
});

function TeamLeadsPage() {
  const { profile, status } = useAuth();
  const navigate = useNavigate();
  const isManager = profile?.role === "manager";

  useEffect(() => {
    if (status === "authenticated" && !isManager) {
      navigate({ to: "/leadgeneration/dashboard", replace: true });
    }
  }, [status, isManager, navigate]);

  if (status !== "authenticated" || !isManager) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate">
        <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <MyLeadsList
      scope="team"
      title="Leads de mon équipe"
      intro="Tous les dossiers que vous pouvez consulter, y compris les vôtres. Lecture seule."
    />
  );
}
