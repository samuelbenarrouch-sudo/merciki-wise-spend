import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRODUCTS } from "@/data/products";
import { formatMoney } from "@/components/admin/lead-contracts";
import {
  COMMISSION_STATUSES,
  CONTRACTS_MAX_ROWS,
  CONTRACT_STATUSES,
  commissionStatusLabel,
  contractStatusLabel,
  isCommissionSecured,
  listContracts,
  listProfilesLight,
  updateContract,
  type CommissionStatus,
  type ContractFilters,
  type ContractRow,
  type ContractStatus,
} from "@/lib/backoffice";

export const Route = createFileRoute("/leadgeneration/admin/contrats")({
  component: AdminContractsPage,
});

const selectClass =
  "h-11 w-full rounded-lg border border-mist bg-background px-3 text-sm text-ink";

function formatDay(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR");
}

function AdminContractsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ContractStatus | "">("");
  const [commissionStatus, setCommissionStatus] = useState<CommissionStatus | "">("");
  const [productCode, setProductCode] = useState("");
  const [commercialId, setCommercialId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const filters: ContractFilters = useMemo(
    () => ({ status, commissionStatus, productCode, commercialId, from, to }),
    [status, commissionStatus, productCode, commercialId, from, to],
  );

  const contractsQuery = useQuery({
    queryKey: ["admin-contracts", filters],
    queryFn: () => listContracts(filters),
  });
  const teamQuery = useQuery({
    queryKey: ["admin-profiles-light"],
    queryFn: () => listProfilesLight(),
  });

  const result = contractsQuery.data;
  const rows: ContractRow[] = result?.ok ? result.data.rows : [];
  const truncated = result?.ok ? result.data.truncated : false;
  const total = result?.ok ? result.data.total : 0;


  // Les totaux ne comptent que les contrats éligibles : la règle
  // « rétracté / résilié / annulé ⇒ aucune commission ni part » est portée
  // par la base et lue via is_billable — jamais redérivée des statuts ici.
  const totals = useMemo(() => {
    let estimated = 0;
    let secured = 0;
    let shareTotal = 0;
    for (const row of rows) {
      if (row.is_billable !== true) continue;
      const amount = row.commission_actual ?? row.commission_expected ?? 0;
      if (isCommissionSecured(row.commission_status)) secured += amount;
      else if (row.commission_status === "estimee") estimated += amount;
      shareTotal += row.commercial_share ?? 0;
    }
    return { estimated, secured, shareTotal };
  }, [rows]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-contracts"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
  };

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <h1 className="text-h2 text-ink">Contrats et commissions</h1>

        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <select
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as ContractStatus | "")}
            aria-label="Statut du contrat"
          >
            <option value="">Tous les contrats</option>
            {CONTRACT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={commissionStatus}
            onChange={(e) =>
              setCommissionStatus(e.target.value as CommissionStatus | "")
            }
            aria-label="Statut de commission"
          >
            <option value="">Toutes les commissions</option>
            {COMMISSION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            aria-label="Produit"
          >
            <option value="">Tous les produits</option>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={commercialId}
            onChange={(e) => setCommercialId(e.target.value)}
            aria-label="Commercial"
          >
            <option value="">Tous les commerciaux</option>
            {(teamQuery.data?.ok ? teamQuery.data.data : []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              className={selectClass}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="Signé à partir du"
            />
            <input
              type="date"
              className={selectClass}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="Signé jusqu'au"
            />
          </div>
        </div>

        {/*
          Troncature : les totaux sont calculés sur les lignes rapatriées.
          Dès que la base en compte davantage, on le dit avant de les afficher.
        */}
        {truncated ? (
          <p
            role="status"
            className="mt-6 rounded-xl border border-accent/40 bg-accent/10 p-4 text-small font-medium text-ink"
          >
            Affichage limité à {CONTRACTS_MAX_ROWS} contrats sur {total}. Les
            totaux ci-dessous sont partiels.
          </p>
        ) : null}

        {/* Totaux : estimé et sécurisé restent toujours séparés. */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-mist bg-mist/40 p-4">
            <p className="text-label uppercase tracking-wider text-slate">
              Commission estimée
            </p>
            <p className="mt-1 text-h3 text-ink">{formatMoney(totals.estimated)}</p>
            <p className="text-xs text-slate">Statut « estimée » uniquement</p>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-label uppercase tracking-wider text-primary">
              Commission sécurisée
            </p>
            <p className="mt-1 text-h3 text-ink">{formatMoney(totals.secured)}</p>
            <p className="text-xs text-slate">Confirmée ou payée</p>
          </div>
          <div className="rounded-xl border border-mist bg-mist/40 p-4">
            <p className="text-label uppercase tracking-wider text-slate">
              Part commerciale
            </p>
            <p className="mt-1 text-h3 text-ink">{formatMoney(totals.shareTotal)}</p>
            <p className="text-xs text-slate">Contrats éligibles uniquement</p>
          </div>
        </div>

        {contractsQuery.isLoading ? (
          <div className="flex items-center gap-2 py-16 text-slate">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
            <span className="text-small">Chargement des contrats…</span>
          </div>
        ) : result && !result.ok ? (
          <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {result.error}
          </p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-mist bg-mist/40 p-10 text-center">
            <p className="text-body font-medium text-ink">Aucun contrat</p>
            <p className="mt-1 text-small text-slate">
              Ajustez les filtres ou saisissez un contrat depuis une fiche lead.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-mist">
            <table className="w-full min-w-[1100px] border-collapse text-small">
              <thead className="bg-mist/50 text-left text-slate">
                <tr>
                  <th className="px-3 py-3 font-medium">Référence</th>
                  <th className="px-3 py-3 font-medium">Signé le</th>
                  <th className="px-3 py-3 font-medium">Produit</th>
                  <th className="px-3 py-3 font-medium">Prospect</th>
                  <th className="px-3 py-3 font-medium">Fournisseur</th>
                  <th className="px-3 py-3 font-medium">Montant HT</th>
                  <th className="px-3 py-3 font-medium">Contrat</th>
                  <th className="px-3 py-3 font-medium">Commission</th>
                  <th className="px-3 py-3 font-medium">Montant</th>
                  <th className="px-3 py-3 font-medium">Part commercial</th>
                  <th className="px-3 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <ContractLine
                    key={row.id}
                    row={row}
                    editing={editing === row.id}
                    onToggle={() => setEditing(editing === row.id ? null : row.id)}
                    onSaved={refresh}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </div>
  );
}

function ContractLine({
  row,
  editing,
  onToggle,
  onSaved,
}: {
  row: ContractRow;
  editing: boolean;
  onToggle: () => void;
  onSaved: () => Promise<void>;
}) {
  const [status, setStatus] = useState<ContractStatus>(row.status ?? "en_attente");
  const [commissionStatus, setCommissionStatus] = useState<CommissionStatus>(
    row.commission_status ?? "estimee",
  );
  const [actual, setActual] = useState(
    row.commission_actual !== null && row.commission_actual !== undefined
      ? String(row.commission_actual)
      : "",
  );
  const [paidAt, setPaidAt] = useState(row.commission_paid_at ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!row.id || saving) return;
    if (commissionStatus === "payee" && !paidAt) {
      setError("La date de paiement est obligatoire pour une commission payée.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await updateContract(row.id, {
      status,
      commission_status: commissionStatus,
      commission_actual: actual.trim() === "" ? null : Number(actual),
      commission_paid_at: paidAt || null,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await onSaved();
    onToggle();
  };

  return (
    <>
      <tr
        className={`border-t border-mist align-top${
          row.is_billable === true ? "" : " opacity-60"
        }`}
      >
        <td className="px-3 py-3 text-ink">{row.reference ?? "—"}</td>
        <td className="px-3 py-3 text-slate">{formatDay(row.signed_at)}</td>
        <td className="px-3 py-3 text-slate">{row.product_label ?? "—"}</td>
        <td className="px-3 py-3 text-ink">
          {row.lead_id ? (
            <Link
              to="/leadgeneration/admin/lead/$leadId"
              params={{ leadId: row.lead_id }}
              className="text-primary hover:underline"
            >
              {row.prospect_first_name} {row.prospect_last_name}
            </Link>
          ) : (
            `${row.prospect_first_name ?? ""} ${row.prospect_last_name ?? ""}`
          )}
        </td>
        <td className="px-3 py-3 text-slate">{row.supplier ?? "—"}</td>
        <td className="px-3 py-3 text-ink">{formatMoney(row.amount_annual_ht)}</td>
        <td className="px-3 py-3 text-slate">
          {row.status ? contractStatusLabel(row.status) : "—"}
        </td>
        <td className="px-3 py-3 text-slate">
          {row.commission_status
            ? commissionStatusLabel(row.commission_status)
            : "—"}
        </td>
        <td className="px-3 py-3 text-ink">
          {formatMoney(row.commission_actual ?? row.commission_expected)}
          {row.is_billable !== true ? (
            <span className="block text-xs text-slate">
              Ne compte pas dans les totaux
            </span>
          ) : null}
        </td>
        <td className="px-3 py-3 text-ink">{formatMoney(row.commercial_share)}</td>
        <td className="px-3 py-3">
          <button
            type="button"
            onClick={onToggle}
            className="text-small font-medium text-primary hover:underline"
          >
            {editing ? "Fermer" : "Modifier"}
          </button>
        </td>
      </tr>
      {editing ? (
        <tr className="border-t border-mist bg-mist/30">
          <td colSpan={11} className="px-3 py-4">
            <div className="grid gap-3 md:grid-cols-4">
              <select
                className={selectClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as ContractStatus)}
                aria-label="Statut du contrat"
              >
                {CONTRACT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                className={selectClass}
                value={commissionStatus}
                onChange={(e) =>
                  setCommissionStatus(e.target.value as CommissionStatus)
                }
                aria-label="Statut de commission"
              >
                {COMMISSION_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                inputMode="decimal"
                className="h-11 rounded-lg"
                placeholder="Commission réelle (€)"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
              />
              <Input
                type="date"
                className="h-11 rounded-lg"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                aria-label="Date de paiement"
              />
            </div>
            {commissionStatus === "payee" && !paidAt ? (
              <p className="mt-2 text-small text-slate">
                La date de paiement est obligatoire pour une commission payée.
              </p>
            ) : null}
            {error ? (
              <p className="mt-2 text-small text-destructive">{error}</p>
            ) : null}
            <Button
              type="button"
              className="mt-3"
              disabled={saving}
              onClick={() => void save()}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </td>
        </tr>
      ) : null}
    </>
  );
}
