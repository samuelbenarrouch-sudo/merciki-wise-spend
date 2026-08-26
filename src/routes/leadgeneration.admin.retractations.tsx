import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/components/admin/lead-contracts";
import {
  CONTRACTS_MAX_ROWS,
  listWithdrawalPending,
  updateContract,
} from "@/lib/backoffice";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leadgeneration/admin/retractations")({
  component: AdminWithdrawalsPage,
});

function formatDay(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR");
}

function AdminWithdrawalsPage() {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: () => listWithdrawalPending(),
  });

  const rows = query.data?.ok ? query.data.data.rows : [];
  const truncated = query.data?.ok ? query.data.data.truncated : false;
  const total = query.data?.ok ? query.data.data.total : 0;

  const act = async (id: string, status: "actif" | "retracte") => {
    setPending(id);
    setError(null);
    const res = await updateContract(id, { status });
    setPending(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-contracts"] });
  };

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <h1 className="text-h2 text-ink">Rétractations en cours</h1>
        <p className="mt-2 max-w-2xl text-small text-slate">
          Contrats encore dans le délai légal de 14 jours, les plus urgents en
          premier.
        </p>

        {/* Troncature signalée : la liste ne doit jamais paraître exhaustive. */}
        {truncated ? (
          <p
            role="status"
            className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-4 text-small font-medium text-ink"
          >
            Affichage limité à {CONTRACTS_MAX_ROWS} contrats sur {total}. Les
            totaux ci-dessous sont partiels.
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {error}
          </p>
        ) : null}

        {query.isLoading ? (
          <div className="flex items-center gap-2 py-16 text-slate">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
            <span className="text-small">Chargement…</span>
          </div>
        ) : query.data && !query.data.ok ? (
          <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {query.data.error}
          </p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-mist bg-mist/40 p-10 text-center">
            <ShieldCheck
              className="mx-auto h-8 w-8 text-primary"
              strokeWidth={1.5}
            />
            <p className="mt-3 text-body font-medium text-ink">
              Aucun contrat en attente
            </p>
            <p className="mt-1 text-small text-slate">
              Tous les délais de rétractation sont purgés : c'est la situation
              normale.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {rows.map((row) => {
              const days = row.jours_restants ?? 0;
              const urgent = days <= 3;
              return (
                <li
                  key={row.id}
                  className={cn(
                    "rounded-2xl border p-4",
                    urgent
                      ? "border-destructive/40 bg-destructive/5"
                      : "border-mist bg-background",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-body font-medium text-ink">
                        {row.prospect_first_name} {row.prospect_last_name}
                        {row.company_name ? ` · ${row.company_name}` : ""}
                      </p>
                      <p className="mt-1 text-small text-slate">
                        {row.product_label ?? "—"} · {row.supplier ?? "—"} ·
                        signé le {formatDay(row.signed_at)} · échéance{" "}
                        {formatDay(row.withdrawal_deadline)}
                      </p>
                      <p className="text-small text-slate">
                        Montant {formatMoney(row.amount_annual_ht)} · commission
                        estimée {formatMoney(row.commission_expected)}
                      </p>
                      {row.lead_id ? (
                        <Link
                          to="/leadgeneration/admin/lead/$leadId"
                          params={{ leadId: row.lead_id }}
                          className="mt-1 inline-block text-small font-medium text-primary hover:underline"
                        >
                          Ouvrir la fiche {row.lead_reference ?? ""}
                        </Link>
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                        urgent
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : "border-mist bg-mist text-slate",
                      )}
                    >
                      {days} jour{days > 1 ? "s" : ""} restant
                      {days > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      disabled={pending === row.id || !row.id}
                      onClick={() => row.id && void act(row.id, "actif")}
                    >
                      <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                      Marquer actif
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending === row.id || !row.id}
                      onClick={() => row.id && void act(row.id, "retracte")}
                    >
                      Client rétracté
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </div>
  );
}
