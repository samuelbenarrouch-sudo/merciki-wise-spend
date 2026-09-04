import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Inbox, Loader2, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { LeadStatusPill } from "@/components/leads/lead-status-pill";
import { LeadsTable, type LeadTableRow } from "@/components/leads/leads-table";
import { PRODUCTS } from "@/data/products";
import { useAuth } from "@/lib/auth";
import {
  MY_LEADS_PAGE_SIZE,
  MY_LEAD_STATUSES,
  listMyLeads,
  type LeadStatus,
} from "@/lib/myLeads";

const selectClass =
  "h-11 w-full rounded-lg border border-mist bg-background px-3 text-sm text-ink";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function MyLeadsList() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isManager = profile?.role === "manager";
  const scope = isManager ? "team" : "mine";
  const title = isManager ? "Leads de mon équipe" : "Mes leads";
  const intro = isManager
    ? "Tous les dossiers que vous pouvez consulter, y compris les vôtres. Lecture seule."
    : "Consultez les dossiers que vous avez enregistrés. Lecture seule.";

  const [search, setSearch] = useState("");
  const [productCode, setProductCode] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [commercialId, setCommercialId] = useState("");
  const [page, setPage] = useState(0);

  const leadsQuery = useQuery({
    queryKey: ["my-leads", scope, search, productCode, status, commercialId, page],
    queryFn: () =>
      listMyLeads({
        scope,
        search,
        productCode: productCode || undefined,
        status,
        commercialId: isManager ? commercialId || undefined : undefined,
        page,
      }),
  });

  const result = leadsQuery.data;
  const rows = useMemo(() => (result?.ok ? result.data.rows : []), [result]);
  const total = result?.ok ? result.data.total : 0;
  const lastPage = Math.max(0, Math.ceil(total / MY_LEADS_PAGE_SIZE) - 1);
  const hasFilters =
    search !== "" || productCode !== "" || status !== "" || commercialId !== "";

  // Liste des commerciaux construite à partir des leads réellement affichés,
  // jamais d'une lecture de `profiles`.
  const [knownCommercials, setKnownCommercials] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    if (!isManager || rows.length === 0) return;
    setKnownCommercials((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      for (const lead of rows) {
        if (!map.has(lead.commercial_id)) {
          map.set(lead.commercial_id, {
            id: lead.commercial_id,
            name: lead.profiles?.full_name ?? "Sans nom",
          });
        }
      }
      const next = [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
      return next.length === prev.length ? prev : next;
    });
  }, [rows, isManager]);

  const tableRows: LeadTableRow[] = rows.map((lead) => ({
    id: lead.id,
    reference: lead.reference,
    dateLabel: formatDate(lead.created_at),
    productLabel: lead.products?.label ?? lead.product_code,
    prospectName: `${lead.prospect_last_name} ${lead.prospect_first_name}`,
    phone: lead.prospect_phone,
    postalCode: lead.postal_code,
    commercialName: lead.profiles?.full_name ?? "—",
    status: <LeadStatusPill status={lead.status} />,
  }));

  const resetPage = () => setPage(0);

  const openLead = (leadId: string) => {
    void navigate({ to: "/leadgeneration/lead/$leadId", params: { leadId } });
  };

  return (
    <div className="py-8 lg:py-12">
      <Container>
        <h1 className="text-h2 text-ink">{title}</h1>
        <p className="mt-2 text-body text-slate">{intro}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
              strokeWidth={1.75}
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Nom, téléphone, référence"
              className="h-11 pl-9"
              aria-label="Recherche"
            />
          </div>

          <select
            className={selectClass}
            value={productCode}
            onChange={(e) => {
              setProductCode(e.target.value);
              resetPage();
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
              setStatus(e.target.value as LeadStatus | "");
              resetPage();
            }}
            aria-label="Statut"
          >
            <option value="">Tous les statuts</option>
            {MY_LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {isManager && (
            <select
              className={selectClass}
              value={commercialId}
              onChange={(e) => {
                setCommercialId(e.target.value);
                resetPage();
              }}
              aria-label="Commercial"
            >
              <option value="">Tous les commerciaux</option>
              {knownCommercials.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {leadsQuery.isLoading && (
          <div className="mt-10 flex items-center gap-3 text-slate">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
            <span className="text-small">Chargement de vos dossiers…</span>
          </div>
        )}

        {result && !result.ok && (
          <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {result.error}
          </p>
        )}

        {result?.ok && rows.length === 0 && (
          <div className="mt-10 rounded-2xl border border-mist bg-background p-8 text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Inbox className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <p className="mt-4 text-h3 text-ink">
              {hasFilters ? "Aucun dossier ne correspond" : "Aucun dossier pour l'instant"}
            </p>
            <p className="mt-2 text-small text-slate">
              {hasFilters
                ? "Modifiez vos filtres pour élargir la recherche."
                : "Vos prochains leads apparaîtront ici dès leur enregistrement. Bonne prospection !"}
            </p>
          </div>
        )}

        {result?.ok && rows.length > 0 && (
          <>
            <p className="mt-6 text-small text-slate">
              {total} dossier{total > 1 ? "s" : ""}
            </p>

            <LeadsTable
              rows={tableRows}
              showCommercial={isManager}
              onRowClick={openLead}
            />

            {lastPage > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-1 rounded-lg border border-mist px-4 text-small text-ink disabled:opacity-40"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} /> Précédent
                </button>
                <span className="text-small text-slate">
                  Page {page + 1} / {lastPage + 1}
                </span>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-1 rounded-lg border border-mist px-4 text-small text-ink disabled:opacity-40"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                >
                  Suivant <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
