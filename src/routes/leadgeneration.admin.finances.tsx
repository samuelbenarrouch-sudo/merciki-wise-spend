import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Copy, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { formatMoney } from "@/components/admin/lead-contracts";
import {
  listProductsLight,
  loadFinanceContracts,
  markCommercialInvoiceReceived,
  markCommercialPaid,
  markCommissionInvoiced,
  markCommissionPaid,
} from "@/lib/backoffice";
import {
  BILLING_OVERDUE_DAYS,
  FINANCE_PERIOD_PRESETS,
  computeFinanceTotals,
  daysSince,
  filterBillingPending,
  filterFinanceByProducts,
  filterPayoutPending,
  filterRealized,
  financeByProduct,
  groupBillingByProductSupplier,
  groupPayoutByCommercial,
  isBillingOverdue,
  payoutSummaryText,
  resolveFinanceRange,
  type FinancePeriodPreset,
  type FinanceRow,
} from "@/lib/analytics";

export const Route = createFileRoute("/leadgeneration/admin/finances")({
  component: AdminFinancePage,
});

const selectClass =
  "h-11 w-full rounded-lg border border-mist bg-background px-3 text-sm text-ink";
const inputClass = "h-11 rounded-lg";

function formatDay(value: string | null): string {
  if (!value) return "Non renseignée";
  return new Date(value).toLocaleDateString("fr-FR");
}

function formatRate(rate: number | null): string {
  if (rate === null) return "Non calculable";
  return `${(rate * 100).toFixed(1)} %`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function Kpi({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${accent ? "border-primary/40 bg-primary/5" : "border-mist bg-background"}`}
    >
      <p className="text-small text-slate">{label}</p>
      <p className="mt-1 text-h3 text-ink">{value}</p>
      <p className="mt-1 text-xs text-slate">{hint}</p>
    </div>
  );
}

function AdminFinancePage() {
  const queryClient = useQueryClient();
  const [preset, setPreset] = useState<FinancePeriodPreset>("current-month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [productCodes, setProductCodes] = useState<string[]>([]);

  const financeQuery = useQuery({
    queryKey: ["admin-finance"],
    queryFn: () => loadFinanceContracts(),
  });
  const productsQuery = useQuery({
    queryKey: ["admin-products-light"],
    queryFn: () => listProductsLight(),
  });

  const products = productsQuery.data?.ok ? productsQuery.data.data : [];
  const result = financeQuery.data;
  const allRows: FinanceRow[] = result?.ok ? result.data.rows : [];
  const totalInSystem = result?.ok ? result.data.totalContractsInSystem : 0;
  const truncated = result?.ok ? result.data.truncated : false;

  const now = useMemo(() => new Date(), []);
  const range = useMemo(
    () => resolveFinanceRange(preset, now, { from: customFrom, to: customTo }),
    [preset, now, customFrom, customTo],
  );

  const rows = useMemo(
    () => filterFinanceByProducts(allRows, productCodes),
    [allRows, productCodes],
  );

  const realized = useMemo(
    () => (range ? filterRealized(rows, range) : []),
    [rows, range],
  );
  const totals = useMemo(() => computeFinanceTotals(realized), [realized]);
  const byProduct = useMemo(() => financeByProduct(realized), [realized]);

  const billingRows = useMemo(() => filterBillingPending(rows), [rows]);
  const billingGroups = useMemo(
    () => groupBillingByProductSupplier(billingRows),
    [billingRows],
  );
  const payoutRows = useMemo(() => filterPayoutPending(rows), [rows]);
  const payoutGroups = useMemo(() => groupPayoutByCommercial(payoutRows), [payoutRows]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-finance"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-contracts"] });
  };

  const toggleProduct = (code: string) =>
    setProductCodes((codes) =>
      codes.includes(code) ? codes.filter((c) => c !== code) : [...codes, code],
    );

  if (financeQuery.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate" strokeWidth={1.75} />
      </div>
    );
  }

  if (result && !result.ok) {
    return (
      <div className="py-8">
        <Container>
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {result.error}
          </p>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <h1 className="text-h2 text-ink">Finances</h1>
        <p className="mt-1 text-small text-slate">
          MERCIKI est apporteur d'affaires : son chiffre d'affaires est la
          commission encaissée, jamais le volume d'affaires apporté.
        </p>

        {/* En-tête : période + produits */}
        <div className="mt-6 grid gap-3 lg:grid-cols-4">
          <select
            className={selectClass}
            value={preset}
            onChange={(e) => setPreset(e.target.value as FinancePeriodPreset)}
            aria-label="Période"
          >
            {FINANCE_PERIOD_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {preset === "custom" ? (
            <>
              <Input
                type="date"
                className={inputClass}
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                aria-label="Début de période"
              />
              <Input
                type="date"
                className={inputClass}
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                aria-label="Fin de période"
              />
            </>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {products.map((p) => (
            <label
              key={p.code}
              className="inline-flex items-center gap-2 rounded-lg border border-mist bg-background px-3 py-2"
            >
              <Checkbox
                checked={productCodes.includes(p.code)}
                onCheckedChange={() => toggleProduct(p.code)}
              />
              <span className="text-small text-ink">{p.label}</span>
            </label>
          ))}
        </div>

        {truncated ? (
          <p className="mt-4 rounded-lg border border-accent/40 bg-accent/10 p-3 text-small text-ink">
            Affichage tronqué : tous les contrats ne sont pas chargés, les
            totaux ci-dessous sont partiels.
          </p>
        ) : null}

        {/* SECTION A */}
        <section className="mt-10">
          <h2 className="text-h3 text-ink">
            Réalisé sur la période{range ? ` — ${range.label}` : ""}
          </h2>
          <p className="mt-1 text-small text-slate">
            Contrats dont la commission a été encaissée sur la période.
          </p>

          {!range ? (
            <p className="mt-4 text-small text-slate">
              Sélectionnez une plage de dates complète pour afficher le réalisé.
            </p>
          ) : totalInSystem === 0 ? (
            <p className="mt-4 text-small text-slate">
              Aucun contrat dans le système : rien à consolider pour l'instant.
            </p>
          ) : rows.length === 0 ? (
            <p className="mt-4 text-small text-slate">
              Aucun contrat ne correspond aux produits sélectionnés.
            </p>
          ) : realized.length === 0 ? (
            <p className="mt-4 rounded-lg border border-mist bg-mist/30 p-3 text-small text-ink">
              Aucune commission encaissée sur cette période. Des contrats
              existent, mais aucun encaissement n'y est rattaché.
            </p>
          ) : (
            <>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Kpi
                  label="Volume d'affaires apporté"
                  value={formatMoney(totals.volumeClientHt)}
                  hint="Indicateur d'activité — ce n'est PAS le chiffre d'affaires de MERCIKI."
                />
                <Kpi
                  accent
                  label="CA MERCIKI"
                  value={formatMoney(totals.revenueHt)}
                  hint="Commissions encaissées : le revenu réel."
                />
                <Kpi
                  label="Coûts commerciaux"
                  value={formatMoney(totals.commercialCostHt)}
                  hint="Parts dues ou versées aux commerciaux."
                />
                <Kpi
                  label="Marge nette"
                  value={formatMoney(totals.marginHt)}
                  hint={`Taux de marge : ${formatRate(totals.marginRate)}`}
                />
              </div>

              <div className="mt-6 overflow-x-auto rounded-xl border border-mist">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="bg-mist/50 text-slate">
                    <tr>
                      <th className="px-4 py-3 font-medium">Produit</th>
                      <th className="px-4 py-3 font-medium">Contrats</th>
                      <th className="px-4 py-3 font-medium">Volume apporté</th>
                      <th className="px-4 py-3 font-medium">CA MERCIKI</th>
                      <th className="px-4 py-3 font-medium">Coûts</th>
                      <th className="px-4 py-3 font-medium">Marge</th>
                      <th className="px-4 py-3 font-medium">Taux</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byProduct.map((p) => (
                      <tr key={p.productCode} className="border-t border-mist">
                        <td className="px-4 py-3 font-medium text-ink">
                          {p.productLabel}
                        </td>
                        <td className="px-4 py-3 text-slate">{p.contracts}</td>
                        <td className="px-4 py-3 text-slate">
                          {formatMoney(p.volumeClientHt)}
                        </td>
                        <td className="px-4 py-3 text-ink">
                          {formatMoney(p.revenueHt)}
                        </td>
                        <td className="px-4 py-3 text-slate">
                          {formatMoney(p.commercialCostHt)}
                        </td>
                        <td className="px-4 py-3 text-ink">
                          {formatMoney(p.marginHt)}
                        </td>
                        <td className="px-4 py-3 text-slate">
                          {formatRate(p.marginRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* SECTION B */}
        <BillingSection
          groups={billingGroups}
          totalInSystem={totalInSystem}
          hasRows={rows.length > 0}
          onDone={refresh}
        />

        {/* SECTION C */}
        <PayoutSection
          groups={payoutGroups}
          totalInSystem={totalInSystem}
          hasRows={rows.length > 0}
          onDone={refresh}
        />
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section B — à facturer aux fournisseurs                             */
/* ------------------------------------------------------------------ */

function BillingSection({
  groups,
  totalInSystem,
  hasRows,
  onDone,
}: {
  groups: ReturnType<typeof groupBillingByProductSupplier>;
  totalInSystem: number;
  hasRows: boolean;
  onDone: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [date, setDate] = useState(today());
  const [invoiceRef, setInvoiceRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleOpen = (key: string) =>
    setOpen((o) => (o.includes(key) ? o.filter((x) => x !== key) : [...o, key]));

  const run = async (action: "invoiced" | "paid", ids: string[]) => {
    if (busy || ids.length === 0) return;
    setBusy(true);
    setError(null);
    const res =
      action === "invoiced"
        ? await markCommissionInvoiced(ids, date, invoiceRef.trim() || null)
        : await markCommissionPaid(ids, date);
    setBusy(false);
    if (!res.ok) {
      // Message de la base affiché tel quel : il porte la règle métier.
      setError(res.error);
      return;
    }
    setSelected([]);
    await onDone();
  };

  return (
    <section className="mt-12">
      <h2 className="text-h3 text-ink">À facturer aux fournisseurs</h2>
      <p className="mt-1 text-small text-slate">
        Toutes périodes confondues — le filtre de période ne s'applique pas ici :
        une commission non facturée depuis plusieurs mois doit rester visible.
      </p>

      {totalInSystem === 0 ? (
        <p className="mt-4 text-small text-slate">
          Aucun contrat dans le système.
        </p>
      ) : !hasRows ? (
        <p className="mt-4 text-small text-slate">
          Aucun contrat ne correspond aux produits sélectionnés.
        </p>
      ) : groups.length === 0 ? (
        <p className="mt-4 text-small text-slate">
          Rien à facturer : toutes les commissions sont encaissées ou non encore
          éligibles.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-mist bg-mist/30 p-4">
            <label className="space-y-1">
              <span className="text-small text-slate">Date</span>
              <Input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className="text-small text-slate">Référence de facture</span>
              <Input
                className={inputClass}
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                placeholder="Commune au lot"
              />
            </label>
            <Button
              type="button"
              disabled={busy || selected.length === 0}
              onClick={() => void run("invoiced", selected)}
            >
              Marquer facturé ({selected.length})
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy || selected.length === 0}
              onClick={() => void run("paid", selected)}
            >
              Marquer encaissé ({selected.length})
            </Button>
          </div>

          {error ? (
            <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-small text-destructive">
              {error}
            </p>
          ) : null}

          <div className="mt-4 space-y-4">
            {groups.map((product) => (
              <div key={product.productCode} className="rounded-xl border border-mist">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-mist bg-mist/40 px-4 py-3">
                  <p className="font-medium text-ink">{product.productLabel}</p>
                  <p className="text-small text-slate">
                    {product.contracts} contrat(s) · {formatMoney(product.totalHt)}
                    {product.overdueCount > 0
                      ? ` · ${product.overdueCount} en retard`
                      : ""}
                  </p>
                </div>
                {product.suppliers.map((supplier) => {
                  const key = `${product.productCode}:${supplier.supplierId}`;
                  const isOpen = open.includes(key);
                  const ids = supplier.rows
                    .map((r) => r.contract_id)
                    .filter((id): id is string => !!id);
                  return (
                    <div key={key} className="border-t border-mist first:border-t-0">
                      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-left text-ink"
                          onClick={() => toggleOpen(key)}
                        >
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
                          ) : (
                            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                          )}
                          <span className="font-medium">{supplier.supplierName}</span>
                        </button>
                        <p className="text-small text-slate">
                          {supplier.contracts} contrat(s) ·{" "}
                          {formatMoney(supplier.totalHt)} · à facturer{" "}
                          {formatMoney(supplier.toInvoiceHt)} (
                          {supplier.toInvoiceCount}) · facturé en attente de
                          règlement {formatMoney(supplier.invoicedHt)} (
                          {supplier.invoicedCount})
                          {supplier.overdueCount > 0 ? (
                            <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                              {supplier.overdueCount} &gt; {BILLING_OVERDUE_DAYS} j
                            </span>
                          ) : null}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setSelected((s) => [
                              ...s.filter((id) => !ids.includes(id)),
                              ...ids,
                            ])
                          }
                        >
                          Tout sélectionner
                        </Button>
                      </div>

                      {isOpen ? (
                        <div className="overflow-x-auto border-t border-mist">
                          <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-background text-slate">
                              <tr>
                                <th className="px-4 py-2 font-medium"> </th>
                                <th className="px-4 py-2 font-medium">Référence</th>
                                 <th className="px-4 py-2 font-medium">Signé le</th>
                                 <th className="px-4 py-2 font-medium">
                                   Confirmée le
                                 </th>
                                 <th className="px-4 py-2 font-medium">
                                   Ancienneté
                                 </th>
                                 <th className="px-4 py-2 font-medium">Prospect</th>
                                 <th className="px-4 py-2 font-medium">Commission</th>
                                 <th className="px-4 py-2 font-medium">État</th>
                                 <th className="px-4 py-2 font-medium">Actions</th>
                               </tr>
                             </thead>
                             <tbody>
                               {supplier.rows.map((r) => {
                                 const id = r.contract_id ?? "";
                                 // Deux retards distincts : encours non facturé
                                 // (à nous d'émettre la facture) et facture non
                                 // payée (fournisseur à relancer).
                                 const toInvoice = r.billing_state === "a_facturer";
                                 const ownOverdue = isBillingOverdue(r);
                                 const supplierOverdue = isPaymentOverdue(r);
                                 return (
                                   <tr key={id} className="border-t border-mist">
                                     <td className="px-4 py-2">
                                       <Checkbox
                                         checked={selected.includes(id)}
                                         onCheckedChange={() => toggle(id)}
                                         aria-label="Sélectionner le contrat"
                                       />
                                     </td>
                                     <td className="px-4 py-2 text-ink">
                                       {r.contract_reference ?? r.lead_reference ?? "—"}
                                     </td>
                                     <td className="px-4 py-2 text-slate">
                                       {formatDay(r.signed_at)}
                                     </td>
                                     <td className="px-4 py-2 text-slate">
                                       {formatDay(r.commission_confirmed_at)}
                                     </td>
                                     <td className="px-4 py-2">
                                       {toInvoice ? (
                                         <div className="flex flex-col gap-1">
                                           <span className="text-slate">
                                             Facturable depuis{" "}
                                             {r.jours_encours ?? "—"} j
                                           </span>
                                           {ownOverdue ? (
                                             <span className="inline-flex w-fit items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                                               Facture à émettre (nous)
                                             </span>
                                           ) : null}
                                         </div>
                                       ) : (
                                         <div className="flex flex-col gap-1">
                                           <span className="text-slate">
                                             Facturée depuis{" "}
                                             {r.jours_depuis_facturation ?? "—"} j
                                           </span>
                                           {supplierOverdue ? (
                                             <span className="inline-flex w-fit items-center rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-foreground">
                                               Fournisseur à relancer
                                             </span>
                                           ) : null}
                                         </div>
                                       )}
                                     </td>
                                     <td className="px-4 py-2 text-slate">
                                       {r.prospect_display ?? "Non renseigné"}
                                     </td>
                                    <td className="px-4 py-2 text-ink">
                                      {r.commission_ht === null
                                        ? "Non renseignée"
                                        : formatMoney(r.commission_ht)}
                                    </td>
                                    <td className="px-4 py-2 text-slate">
                                      {r.billing_state === "a_facturer"
                                        ? "À facturer"
                                        : `Facturé le ${formatDay(r.commission_invoiced_at)}`}
                                    </td>
                                    <td className="px-4 py-2">
                                      <div className="flex gap-2">
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          disabled={busy}
                                          onClick={() => void run("invoiced", [id])}
                                        >
                                          Facturé
                                        </Button>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          disabled={busy}
                                          onClick={() => void run("paid", [id])}
                                        >
                                          Encaissé
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section C — à régler aux commerciaux                                */
/* ------------------------------------------------------------------ */

function PayoutSection({
  groups,
  totalInSystem,
  hasRows,
  onDone,
}: {
  groups: ReturnType<typeof groupPayoutByCommercial>;
  totalInSystem: number;
  hasRows: boolean;
  onDone: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [date, setDate] = useState(today());
  const [invoiceRef, setInvoiceRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleOpen = (key: string) =>
    setOpen((o) => (o.includes(key) ? o.filter((x) => x !== key) : [...o, key]));

  const run = async (action: "received" | "paid", ids: string[]) => {
    if (busy || ids.length === 0) return;
    setBusy(true);
    setError(null);
    const res =
      action === "received"
        ? await markCommercialInvoiceReceived(ids, date, invoiceRef.trim() || null)
        : await markCommercialPaid(ids, date);
    setBusy(false);
    if (!res.ok) {
      // Contrainte de base (règlement avant encaissement MERCIKI) : son
      // message est affiché tel quel, sans reformulation.
      setError(res.error);
      return;
    }
    setSelected([]);
    await onDone();
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(payoutSummaryText(groups));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copie impossible : sélectionnez et copiez le tableau à la main.");
    }
  };

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-h3 text-ink">À régler aux commerciaux</h2>
          <p className="mt-1 text-small text-slate">
            Toutes périodes confondues — le filtre de période ne s'applique pas
            ici.
          </p>
        </div>
        {groups.length > 0 ? (
          <Button type="button" variant="outline" onClick={() => void copySummary()}>
            <Copy className="h-4 w-4" strokeWidth={1.75} />
            {copied ? "Récapitulatif copié" : "Copier le récapitulatif"}
          </Button>
        ) : null}
      </div>

      {totalInSystem === 0 ? (
        <p className="mt-4 text-small text-slate">Aucun contrat dans le système.</p>
      ) : !hasRows ? (
        <p className="mt-4 text-small text-slate">
          Aucun contrat ne correspond aux produits sélectionnés.
        </p>
      ) : groups.length === 0 ? (
        <p className="mt-4 text-small text-slate">
          Rien à régler : aucune part commerciale en attente.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-mist bg-mist/30 p-4">
            <label className="space-y-1">
              <span className="text-small text-slate">Date</span>
              <Input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className="text-small text-slate">Référence de facture</span>
              <Input
                className={inputClass}
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                placeholder="Facture du commercial"
              />
            </label>
            <Button
              type="button"
              disabled={busy || selected.length === 0}
              onClick={() => void run("received", selected)}
            >
              Facture reçue ({selected.length})
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy || selected.length === 0}
              onClick={() => void run("paid", selected)}
            >
              Marquer réglé ({selected.length})
            </Button>
          </div>

          {error ? (
            <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-small text-destructive">
              {error}
            </p>
          ) : null}

          <div className="mt-4 space-y-4">
            {groups.map((g) => {
              const isOpen = open.includes(g.commercialId);
              const ids = g.rows
                .map((r) => r.contract_id)
                .filter((id): id is string => !!id);
              return (
                <div
                  key={g.commercialId}
                  className={`rounded-xl border border-mist ${g.isActive ? "" : "opacity-60"}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-ink"
                      onClick={() => toggleOpen(g.commercialId)}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
                      ) : (
                        <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                      )}
                      <span className="font-medium">
                        {g.commercialName}
                        {g.isActive ? "" : " (compte désactivé)"}
                      </span>
                    </button>
                    <p className="text-small text-slate">
                      {g.contracts} contrat(s) · total dû {formatMoney(g.totalHt)} ·
                      facture à recevoir {formatMoney(g.invoiceAwaitedHt)} (
                      {g.invoiceAwaitedCount}) · facture reçue, à régler{" "}
                      {formatMoney(g.toPayHt)} ({g.toPayCount})
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setSelected((s) => [
                          ...s.filter((id) => !ids.includes(id)),
                          ...ids,
                        ])
                      }
                    >
                      Tout sélectionner
                    </Button>
                  </div>

                  {isOpen ? (
                    <div className="overflow-x-auto border-t border-mist">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-background text-slate">
                          <tr>
                            <th className="px-4 py-2 font-medium"> </th>
                            <th className="px-4 py-2 font-medium">Référence</th>
                            <th className="px-4 py-2 font-medium">Produit</th>
                            <th className="px-4 py-2 font-medium">Prospect</th>
                            <th className="px-4 py-2 font-medium">
                              Encaissé par MERCIKI
                            </th>
                            <th className="px-4 py-2 font-medium">Part due</th>
                            <th className="px-4 py-2 font-medium">État</th>
                            <th className="px-4 py-2 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {g.rows.map((r) => {
                            const id = r.contract_id ?? "";
                            return (
                              <tr key={id} className="border-t border-mist">
                                <td className="px-4 py-2">
                                  <Checkbox
                                    checked={selected.includes(id)}
                                    onCheckedChange={() => toggle(id)}
                                    aria-label="Sélectionner le contrat"
                                  />
                                </td>
                                <td className="px-4 py-2 text-ink">
                                  {r.contract_reference ?? r.lead_reference ?? "—"}
                                </td>
                                <td className="px-4 py-2 text-slate">
                                  {r.product_label ?? r.product_code ?? "—"}
                                </td>
                                <td className="px-4 py-2 text-slate">
                                  {r.prospect_name ?? "Non renseigné"}
                                </td>
                                <td className="px-4 py-2 text-slate">
                                  {formatDay(r.commission_paid_at)}
                                </td>
                                <td className="px-4 py-2 text-ink">
                                  {r.commercial_share_ht === null
                                    ? "Non renseignée"
                                    : formatMoney(r.commercial_share_ht)}
                                </td>
                                <td className="px-4 py-2 text-slate">
                                  {r.payout_state === "facture_a_recevoir"
                                    ? "Facture à recevoir"
                                    : `Facture reçue le ${formatDay(r.commercial_invoice_received_at)}`}
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      disabled={busy}
                                      onClick={() => void run("received", [id])}
                                    >
                                      Facture reçue
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="ghost"
                                      disabled={busy}
                                      onClick={() => void run("paid", [id])}
                                    >
                                      Réglé
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
