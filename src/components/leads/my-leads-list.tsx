import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Inbox, Loader2, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { LeadStatusPill } from "@/components/leads/lead-status-pill";
import { PRODUCTS } from "@/data/products";
import {
  MY_LEADS_PAGE_SIZE,
  MY_LEAD_STATUSES,
  listMyLeads,
  listMyTeamCommercials,
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

export function MyLeadsList({
  scope,
  title,
  intro,
}: {
  scope: "mine" | "team";
  title: string;
  intro: string;
}) {
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
        commercialId: scope === "team" ? commercialId || undefined : undefined,
        page,
      }),
  });

  const commercialsQuery = useQuery({
    queryKey: ["my-team-commercials"],
    queryFn: listMyTeamCommercials,
    enabled: scope === "team",
  });

  const result = leadsQuery.data;
  const rows = result?.ok ? result.data.rows : [];
  const total = result?.ok ? result.data.total : 0;
  const lastPage = Math.max(0, Math.ceil(total / MY_LEADS_PAGE_SIZE) - 1);
  const hasFilters =
    search !== "" || productCode !== "" || status !== "" || commercialId !== "";

  const resetPage = () => setPage(0);

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

          {scope === "team" && (
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
              {(commercialsQuery.data?.ok ? commercialsQuery.data.data : []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name ?? "Sans nom"}
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

            <ul className="mt-3 grid gap-3">
              {rows.map((lead) => (
                <li key={lead.id}>
                  <Link
                    to="/leadgeneration/lead/$leadId"
                    params={{ leadId: lead.id }}
                    className="block rounded-2xl border border-mist bg-background p-4 shadow-soft transition-shadow hover:shadow-medium"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-label uppercase tracking-wider text-slate">
                        {lead.reference}
                      </span>
                      <LeadStatusPill status={lead.status} />
                    </div>
                    <p className="mt-2 text-h3 text-ink">
                      {lead.prospect_first_name} {lead.prospect_last_name}
                    </p>
                    <p className="mt-1 text-small text-slate">
                      {lead.products?.label ?? lead.product_code} · {formatDate(lead.created_at)} ·{" "}
                      {lead.postal_code}
                    </p>
                    {scope === "team" && (
                      <p className="mt-1 text-small text-slate">
                        Commercial : {lead.profiles?.full_name ?? "—"}
                      </p>
                    )}
                    <a
                      href={`tel:${lead.prospect_phone.replace(/\s/g, "")}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-block text-small font-medium text-primary underline underline-offset-4"
                    >
                      {lead.prospect_phone}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>

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
