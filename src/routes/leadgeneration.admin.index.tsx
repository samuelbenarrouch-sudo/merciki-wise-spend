import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { LeadsTable } from "@/components/leads/leads-table";

import { PRODUCTS } from "@/data/products";
import {
  LEAD_STATUSES,
  PAGE_SIZE,
  listLeads,
  listProfilesLight,
  type LeadFilters,
  type LeadStatus,
} from "@/lib/backoffice";

export const Route = createFileRoute("/leadgeneration/admin/")({
  component: AdminLeadsPage,
});

const selectClass =
  "h-11 w-full rounded-lg border border-mist bg-background px-3 text-sm text-ink";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function AdminLeadsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [productCode, setProductCode] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [commercialId, setCommercialId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);

  const filters: LeadFilters = useMemo(
    () => ({
      search,
      productCode,
      status,
      commercialId,
      from: from ? new Date(from).toISOString() : undefined,
      to: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
      page,
    }),
    [search, productCode, status, commercialId, from, to, page],
  );

  const leadsQuery = useQuery({
    queryKey: ["admin-leads", filters],
    queryFn: () => listLeads(filters),
  });

  const teamQuery = useQuery({
    queryKey: ["admin-profiles-light"],
    queryFn: () => listProfilesLight(),
  });

  const result = leadsQuery.data;
  const rows = result?.ok ? result.data.rows : [];
  const total = result?.ok ? result.data.total : 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const applySearch = () => {
    setPage(0);
    setSearch(searchInput);
  };

  const openLead = (leadId: string) => {
    void navigate({
      to: "/leadgeneration/admin/lead/$leadId",
      params: { leadId },
    });
  };

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <h1 className="text-h2 text-ink">Leads</h1>

        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex gap-2">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
                placeholder="Nom, téléphone, référence, société"
                className="h-11 rounded-lg"
              />
              <Button type="button" onClick={applySearch} className="h-11 px-4">
                <Search className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </div>
          </div>

          <select
            className={selectClass}
            value={productCode}
            onChange={(e) => {
              setPage(0);
              setProductCode(e.target.value);
            }}
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
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value as LeadStatus | "");
            }}
            aria-label="Statut"
          >
            <option value="">Tous les statuts</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={commercialId}
            onChange={(e) => {
              setPage(0);
              setCommercialId(e.target.value);
            }}
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
              onChange={(e) => {
                setPage(0);
                setFrom(e.target.value);
              }}
              aria-label="Date de début"
            />
            <input
              type="date"
              className={selectClass}
              value={to}
              onChange={(e) => {
                setPage(0);
                setTo(e.target.value);
              }}
              aria-label="Date de fin"
            />
          </div>
        </div>

        {leadsQuery.isLoading ? (
          <div className="flex items-center gap-2 py-16 text-slate">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
            <span className="text-small">Chargement des leads…</span>
          </div>
        ) : result && !result.ok ? (
          <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {result.error}
          </p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-mist bg-mist/40 p-10 text-center">
            <p className="text-body font-medium text-ink">Aucun lead ne correspond</p>
            <p className="mt-1 text-small text-slate">
              Élargissez la période ou retirez un filtre.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-6 text-small text-slate">
              {total} résultat{total > 1 ? "s" : ""}
            </p>

            <LeadsTable
              rows={rows.map((lead) => ({
                id: lead.id,
                reference: lead.reference,
                dateLabel: formatDate(lead.created_at),
                productLabel: lead.products?.label ?? lead.product_code,
                prospectName: `${lead.prospect_last_name} ${lead.prospect_first_name}`,
                phone: lead.prospect_phone,
                postalCode: lead.postal_code,
                commercialName: lead.profiles?.full_name ?? "—",
                status: <StatusBadge status={lead.status} />,
              }))}
              onRowClick={openLead}
            />


            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Précédent
              </Button>
              <span className="text-small text-slate">
                Page {page + 1} sur {pageCount}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={page + 1 >= pageCount}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
