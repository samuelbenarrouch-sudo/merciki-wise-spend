import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contractStatusLabel,
  listSuppliersForProduct,
  commissionStatusLabel,
  createContract,
  listContractsForLead,
  suggestCommission,
} from "@/lib/backoffice";

const inputClass = "h-11 rounded-lg";
const labelClass = "text-small text-slate";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

function formatDay(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR");
}

function toNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

interface Props {
  leadId: string;
  productCode: string;
}

/** Section « Contrats » de la fiche lead : liste + saisie d'un contrat. */
export function LeadContracts({ leadId, productCode }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [supplierId, setSupplierId] = useState("");
  const [reference, setReference] = useState("");
  const [signedAt, setSignedAt] = useState(today());
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState("");
  const [share, setShare] = useState("");
  const [notes, setNotes] = useState("");

  const contractsQuery = useQuery({
    queryKey: ["admin-lead-contracts", leadId],
    queryFn: () => listContractsForLead(leadId),
  });

  // Fournisseurs actifs rattachés au produit du lead. Sans rattachement, on
  // propose tous les fournisseurs actifs : la saisie n'est jamais bloquée.
  const suppliersQuery = useQuery({
    queryKey: ["admin-suppliers-product", productCode],
    queryFn: () => listSuppliersForProduct(productCode),
  });
  const suppliers = suppliersQuery.data?.ok
    ? suppliersQuery.data.data.suppliers
    : [];
  const supplierFallback = suppliersQuery.data?.ok
    ? suppliersQuery.data.data.fallbackAllActive
    : false;

  const reset = () => {
    setSupplierId("");
    setReference("");
    setSignedAt(today());
    setStartDate("");
    setDuration("");
    setAmount("");
    setCommission("");
    setShare("");
    setNotes("");
    setError(null);
  };

  /** Pré-remplissage indicatif : les montants restent librement modifiables. */
  const handleAmountBlur = async () => {
    const value = toNumber(amount);
    if (value === null) return;
    const res = await suggestCommission(productCode, value);
    if (!res.ok) return;
    if (res.data.commission !== null) setCommission(String(res.data.commission));
    if (res.data.commercialShare !== null)
      setShare(String(res.data.commercialShare));
  };

  const handleSave = async () => {
    if (saving) return;
    const selected = suppliers.find((s) => s.id === supplierId);
    if (!selected || !signedAt) {
      setError("Le fournisseur et la date de signature sont obligatoires.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await createContract({
      lead_id: leadId,
      supplier_id: selected.id,
      // La colonne texte `supplier` est obsolète depuis la migration 012
      // (nullable) : seul `supplier_id` fait foi. Elle n'est plus alimentée,
      // la vue ne s'en sert qu'en repli pour les contrats antérieurs.
      reference: reference.trim() || null,
      signed_at: signedAt,
      start_date: startDate || null,
      duration_months: toNumber(duration),
      amount_annual_ht: toNumber(amount),
      commission_expected: toNumber(commission),
      commercial_share: toNumber(share),
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (!res.ok) {
      // Message de la base affiché tel quel : il porte la règle métier
      // (mandat ACD non signé, par exemple) et le contrat n'a pas été créé.
      setError(res.error);
      return;
    }
    reset();
    setOpen(false);
    await queryClient.invalidateQueries({
      queryKey: ["admin-lead-contracts", leadId],
    });
    await queryClient.invalidateQueries({ queryKey: ["admin-lead", leadId] });
    await queryClient.invalidateQueries({
      queryKey: ["admin-lead-events", leadId],
    });
  };

  const rows = contractsQuery.data?.ok ? contractsQuery.data.data : [];

  return (
    <div>
      {contractsQuery.isLoading ? (
        <p className="text-small text-slate">Chargement…</p>
      ) : contractsQuery.data && !contractsQuery.data.ok ? (
        <p className="text-small text-destructive">{contractsQuery.data.error}</p>
      ) : rows.length === 0 ? (
        <p className="text-small text-slate">Aucun contrat pour ce lead.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((c) => (
            <li key={c.id} className="rounded-lg border border-mist p-3">
              <p className="text-small font-medium text-ink">
                {c.supplier} {c.reference ? `· ${c.reference}` : ""}
              </p>
              <p className="mt-1 text-small text-slate">
                Signé le {formatDay(c.signed_at)} ·{" "}
                {c.status ? contractStatusLabel(c.status) : "—"} · Montant{" "}
                {formatMoney(c.amount_annual_ht)}
              </p>
              <p className="text-small text-slate">
                Commission {formatMoney(c.commission_expected)} (
                {c.commission_status
                  ? commissionStatusLabel(c.commission_status)
                  : "—"}
                ) · Part commercial {formatMoney(c.commercial_share)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!open ? (
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Ajouter un contrat
        </Button>
      ) : (
        <div className="mt-4 space-y-3 rounded-xl border border-mist bg-mist/30 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className={labelClass}>Fournisseur *</span>
              <select
                className="h-11 w-full rounded-lg border border-mist bg-background px-3 text-sm text-ink"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">Sélectionner un fournisseur</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {supplierFallback && suppliers.length > 0 ? (
                <span className="block text-xs text-slate">
                  Aucun fournisseur n'est rattaché à ce produit : tous les
                  fournisseurs actifs sont proposés. Complétez les rattachements
                  dans l'écran Fournisseurs.
                </span>
              ) : null}
              {suppliers.length === 0 ? (
                <span className="block text-xs text-slate">
                  Aucun fournisseur actif : créez-en un dans l'écran
                  Fournisseurs.
                </span>
              ) : null}
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Référence</span>
              <Input
                className={inputClass}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Date de signature *</span>
              <Input
                type="date"
                className={inputClass}
                value={signedAt}
                onChange={(e) => setSignedAt(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Date de démarrage</span>
              <Input
                type="date"
                className={inputClass}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Durée (mois)</span>
              <Input
                type="number"
                inputMode="numeric"
                className={inputClass}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Montant annuel HT (€)</span>
              <Input
                type="number"
                inputMode="decimal"
                className={inputClass}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={() => void handleAmountBlur()}
              />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Commission estimée (€)</span>
              <Input
                type="number"
                inputMode="decimal"
                className={inputClass}
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Part du commercial (€)</span>
              <Input
                type="number"
                inputMode="decimal"
                className={inputClass}
                value={share}
                onChange={(e) => setShare(e.target.value)}
              />
            </label>
          </div>

          <label className="block space-y-1">
            <span className={labelClass}>Notes</span>
            <Textarea
              className="min-h-20 rounded-lg"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <p className="text-small text-slate">
            À l'enregistrement, le lead passera automatiquement en « Signé ».
          </p>

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-small text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <Button type="button" disabled={saving} onClick={() => void handleSave()}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                  Enregistrement…
                </>
              ) : (
                "Enregistrer le contrat"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
