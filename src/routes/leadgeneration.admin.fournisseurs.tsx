import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createSupplier,
  listProductsLight,
  listSuppliers,
  setSupplierProducts,
  updateSupplier,
  type SupplierWithProducts,
} from "@/lib/backoffice";

export const Route = createFileRoute("/leadgeneration/admin/fournisseurs")({
  component: AdminSuppliersPage,
});

const inputClass = "h-11 rounded-lg";
const labelClass = "text-small text-slate";

interface FormState {
  name: string;
  billingContact: string;
  billingEmail: string;
  accountReference: string;
  paymentTerms: string;
  notes: string;
  isActive: boolean;
  productCodes: string[];
}

const emptyForm: FormState = {
  name: "",
  billingContact: "",
  billingEmail: "",
  accountReference: "",
  paymentTerms: "",
  notes: "",
  isActive: true,
  productCodes: [],
};

function toNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function AdminSuppliersPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suppliersQuery = useQuery({
    queryKey: ["admin-suppliers"],
    queryFn: () => listSuppliers(),
  });
  const productsQuery = useQuery({
    queryKey: ["admin-products-light"],
    queryFn: () => listProductsLight(),
  });

  const suppliers = suppliersQuery.data?.ok ? suppliersQuery.data.data : [];
  const products = productsQuery.data?.ok ? productsQuery.data.data : [];

  const productLabel = (code: string) =>
    products.find((p) => p.code === code)?.label ?? code;

  const openNew = () => {
    setForm(emptyForm);
    setError(null);
    setEditing("new");
  };

  const openEdit = (s: SupplierWithProducts) => {
    setForm({
      name: s.name,
      billingContact: s.billing_contact ?? "",
      billingEmail: s.billing_email ?? "",
      accountReference: s.account_reference ?? "",
      paymentTerms: s.payment_terms_days === null ? "" : String(s.payment_terms_days),
      notes: s.notes ?? "",
      isActive: s.is_active,
      productCodes: s.productCodes,
    });
    setError(null);
    setEditing(s.id);
  };

  const toggleProduct = (code: string) => {
    setForm((f) => ({
      ...f,
      productCodes: f.productCodes.includes(code)
        ? f.productCodes.filter((c) => c !== code)
        : [...f.productCodes, code],
    }));
  };

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-suppliers"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-suppliers-product"] });
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.name.trim()) {
      setError("Le nom du fournisseur est obligatoire.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      billing_contact: form.billingContact.trim() || null,
      billing_email: form.billingEmail.trim() || null,
      account_reference: form.accountReference.trim() || null,
      payment_terms_days: toNumber(form.paymentTerms),
      notes: form.notes.trim() || null,
      is_active: form.isActive,
    };
    const res =
      editing === "new"
        ? await createSupplier(payload, form.productCodes)
        : await (async () => {
            const updated = await updateSupplier(editing as string, payload);
            if (!updated.ok) return updated;
            return setSupplierProducts(editing as string, form.productCodes);
          })();
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setEditing(null);
    await refresh();
  };

  const toggleActive = async (s: SupplierWithProducts) => {
    const res = await updateSupplier(s.id, { is_active: !s.is_active });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await refresh();
  };

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-h2 text-ink">Fournisseurs</h1>
            <p className="mt-1 text-small text-slate">
              Un fournisseur ne se supprime jamais : des contrats y font
              référence. Désactivez-le — il disparaît des listes de saisie mais
              reste lisible sur les contrats existants.
            </p>
          </div>
          <Button type="button" onClick={openNew}>
            <Plus className="h-4 w-4" strokeWidth={1.75} />
            Nouveau fournisseur
          </Button>
        </div>

        {editing ? (
          <div className="mt-6 space-y-3 rounded-xl border border-mist bg-mist/30 p-4">
            <h2 className="text-h4 text-ink">
              {editing === "new" ? "Nouveau fournisseur" : "Modifier le fournisseur"}
            </h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-1">
                <span className={labelClass}>Nom *</span>
                <Input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Contact facturation</span>
                <Input
                  className={inputClass}
                  value={form.billingContact}
                  onChange={(e) =>
                    setForm({ ...form, billingContact: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Email de facturation</span>
                <Input
                  type="email"
                  className={inputClass}
                  value={form.billingEmail}
                  onChange={(e) =>
                    setForm({ ...form, billingEmail: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Référence de compte</span>
                <Input
                  className={inputClass}
                  value={form.accountReference}
                  onChange={(e) =>
                    setForm({ ...form, accountReference: e.target.value })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className={labelClass}>Délai de règlement (jours)</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  className={inputClass}
                  value={form.paymentTerms}
                  onChange={(e) =>
                    setForm({ ...form, paymentTerms: e.target.value })
                  }
                />
              </label>
              <label className="flex items-center gap-2 pt-6">
                <Checkbox
                  checked={form.isActive}
                  onCheckedChange={(v) =>
                    setForm({ ...form, isActive: v === true })
                  }
                />
                <span className={labelClass}>Fournisseur actif</span>
              </label>
            </div>

            <div className="space-y-2">
              <span className={labelClass}>Produits rattachés</span>
              <div className="flex flex-wrap gap-3">
                {products.map((p) => (
                  <label
                    key={p.code}
                    className="inline-flex items-center gap-2 rounded-lg border border-mist bg-background px-3 py-2"
                  >
                    <Checkbox
                      checked={form.productCodes.includes(p.code)}
                      onCheckedChange={() => toggleProduct(p.code)}
                    />
                    <span className="text-small text-ink">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="block space-y-1">
              <span className={labelClass}>Notes</span>
              <Textarea
                className="min-h-20 rounded-lg"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>

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
                  "Enregistrer"
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Annuler
              </Button>
            </div>
          </div>
        ) : null}

        <div className="mt-6 overflow-x-auto rounded-xl border border-mist">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-mist/50 text-slate">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Produits rattachés</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Délai</th>
                <th className="px-4 py-3 font-medium">Actif</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliersQuery.isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-slate">
                    Chargement…
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-slate">
                    Aucun fournisseur enregistré pour le moment.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr
                    key={s.id}
                    className={`border-t border-mist ${s.is_active ? "" : "opacity-50"}`}
                  >
                    <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
                    <td className="px-4 py-3 text-slate">
                      {s.productCodes.length === 0
                        ? "Aucun rattachement"
                        : s.productCodes.map(productLabel).join(", ")}
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {s.billing_contact ?? "Non renseigné"}
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {s.billing_email ?? "Non renseigné"}
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {s.account_reference ?? "Non renseignée"}
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {s.payment_terms_days === null
                        ? "Non renseigné"
                        : `${s.payment_terms_days} j`}
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {s.is_active ? "Oui" : "Non"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(s)}
                        >
                          Modifier
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => void toggleActive(s)}
                        >
                          {s.is_active ? "Désactiver" : "Réactiver"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}
