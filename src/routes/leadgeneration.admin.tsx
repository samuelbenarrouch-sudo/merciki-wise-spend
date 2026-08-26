import { useEffect } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { listWithdrawalPending, loadFinanceContracts } from "@/lib/backoffice";
import { filterBillingPending, filterPayoutPending } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leadgeneration/admin")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Administration — MERCIKI" },
    ],
  }),
  component: AdminLayout,
});

const TABS = [
  { to: "/leadgeneration/admin/dashboard", label: "Dashboard", exact: false },
  { to: "/leadgeneration/admin", label: "Leads", exact: true },
  { to: "/leadgeneration/admin/contrats", label: "Contrats", exact: false },
  { to: "/leadgeneration/admin/finances", label: "Finances", exact: false },
  {
    to: "/leadgeneration/admin/fournisseurs",
    label: "Fournisseurs",
    exact: false,
  },
  {
    to: "/leadgeneration/admin/retractations",
    label: "Rétractations",
    exact: false,
  },
  { to: "/leadgeneration/admin/doublons", label: "Doublons", exact: false },
  { to: "/leadgeneration/admin/equipe", label: "Équipe", exact: false },
] as const;


function AdminLayout() {
  const { status, profile } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isAdmin = profile?.role === "admin" && profile.is_active === true;

  const withdrawalsQuery = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: () => listWithdrawalPending(),
    enabled: isAdmin,
  });
  const withdrawalCount = withdrawalsQuery.data?.ok
    ? withdrawalsQuery.data.data.total
    : 0;

  // Pastille Finances : contrats en attente d'action, à facturer ou à régler.
  const financeQuery = useQuery({
    queryKey: ["admin-finance"],
    queryFn: () => loadFinanceContracts(),
    enabled: isAdmin,
  });
  const financeRows = financeQuery.data?.ok ? financeQuery.data.data.rows : [];
  const financeCount =
    filterBillingPending(financeRows).length +
    filterPayoutPending(financeRows).length;





  useEffect(() => {
    if (status === "authenticated" && !isAdmin) {
      navigate({ to: "/leadgeneration/dashboard", replace: true });
    }
  }, [status, isAdmin, navigate]);

  if (status !== "authenticated" || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate">
          <Loader2 className="h-8 w-8 animate-spin" strokeWidth={1.75} />
          <p className="text-small">Vérification de vos droits…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate">
          <Loader2 className="h-8 w-8 animate-spin" strokeWidth={1.75} />
          <p className="text-small">Redirection…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="border-b border-mist bg-mist/50">
        <div className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-5 lg:px-8">
          {TABS.map((tab) => {
            const active = tab.exact
              ? pathname === tab.to
              : pathname.startsWith(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-slate hover:text-ink",
                )}
              >
                {tab.label}
                {tab.to === "/leadgeneration/admin/retractations" &&
                withdrawalCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-foreground">
                    {withdrawalCount}
                  </span>
                ) : null}
              </Link>

            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
