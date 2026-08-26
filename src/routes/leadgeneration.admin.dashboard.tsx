import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Info,
  Loader2,
  Minus,
  TriangleAlert,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/data/products";
import {
  loadDashboardData,
  lossReasonLabel,
  statusLabel,
} from "@/lib/backoffice";
import {
  CONVERSION_DEFINITION,
  PERIOD_PRESETS,
  average,
  buildExitBreakdown,
  buildFunnel,
  buildPeriodRange,
  buildTimeSeries,
  commercialPerformance,
  computeKpis,
  emptyKind,
  filterByPeriod,
  filterContractsBySignedAt,
  financialSummary,
  median,
  pendingAging,
  productBreakdown,
  qualificationDelaysHours,
  type Delta,
  type PeriodPreset,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leadgeneration/admin/dashboard")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Dashboard de pilotage — MERCIKI" },
    ],
  }),
  component: AdminDashboardPage,
});

const selectClass =
  "h-11 w-full rounded-lg border border-mist bg-background px-3 text-sm text-ink sm:w-64";

const productLabel = (code: string): string =>
  PRODUCTS.find((p) => p.id === code)?.label ?? code;

const nf = new Intl.NumberFormat("fr-FR");
const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatPercent(value: number | null, digits = 1): string {
  return value === null ? "—" : `${value.toFixed(digits).replace(".", ",")} %`;
}

function formatHours(hours: number | null): string {
  if (hours === null) return "—";
  if (hours < 48) return `${hours.toFixed(1).replace(".", ",")} h`;
  return `${(hours / 24).toFixed(1).replace(".", ",")} j`;
}

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString("fr-FR") : "—";
}

/* ------------------------------------------------------------------ */

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-mist bg-background p-5 lg:p-6",
        className,
      )}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmptyState({ kind, scope }: { kind: "empty-system" | "empty-period"; scope: string }) {
  return (
    <p className="rounded-lg bg-mist/60 px-4 py-6 text-center text-sm text-slate">
      {kind === "empty-system"
        ? `Aucun ${scope} enregistré dans le système à ce jour.`
        : `Aucun ${scope} sur la période sélectionnée. Élargissez la période pour consulter l'historique.`}
    </p>
  );
}

/**
 * Variation : vert si favorable, rouge si défavorable, neutre lorsque la
 * période précédente est vide — dans ce cas aucun pourcentage n'est affiché,
 * une variation par rapport à zéro n'ayant pas de sens.
 */
function DeltaBadge({
  delta,
  unit = "%",
  higherIsBetter = true,
}: {
  delta: Delta | null;
  unit?: "%" | "pts";
  higherIsBetter?: boolean;
}) {
  if (!delta) return null;
  if (delta.neutral) {
    return (
      <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate">
        <Minus className="h-3.5 w-3.5" strokeWidth={2} />
        Aucune donnée sur la période précédente
      </span>
    );
  }
  const improving = higherIsBetter ? delta.absolute >= 0 : delta.absolute <= 0;
  const Icon = delta.absolute >= 0 ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "mt-2 inline-flex items-center gap-1 text-xs font-medium",
        delta.absolute === 0
          ? "text-slate"
          : improving
            ? "text-primary"
            : "text-destructive",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      {unit === "pts"
        ? `${delta.absolute >= 0 ? "+" : ""}${delta.absolute.toFixed(1).replace(".", ",")} pts`
        : `${delta.percent === null ? "" : `${delta.percent >= 0 ? "+" : ""}${delta.percent.toFixed(1).replace(".", ",")} % `}(${delta.absolute >= 0 ? "+" : ""}${nf.format(delta.absolute)})`}
      <span className="text-slate">vs période précédente</span>
    </span>
  );
}

function Kpi({
  label,
  value,
  hint,
  tooltip,
  children,
}: {
  label: string;
  value: string;
  hint?: string;
  tooltip?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-mist bg-background p-5">
      <div className="flex items-start gap-1.5">
        <p className="text-sm text-slate">{label}</p>
        {tooltip ? (
          <span title={tooltip} className="text-slate" aria-label={tooltip}>
            <Info className="h-4 w-4" strokeWidth={1.75} />
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate">{hint}</p> : null}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */

type SortKey =
  | "name"
  | "leads"
  | "qualified"
  | "signed"
  | "conversion"
  | "delay"
  | "last";

function AdminDashboardPage() {
  const [preset, setPreset] = useState<PeriodPreset>("30d");
  const [sortKey, setSortKey] = useState<SortKey>("leads");
  const [sortAsc, setSortAsc] = useState(false);

  // `now` figé au montage : évite que chaque rendu redécoupe les périodes.
  const now = useMemo(() => new Date(), []);
  const range = useMemo(() => buildPeriodRange(preset, now), [preset, now]);

  const sinceIso = range.previousFrom
    ? range.previousFrom.toISOString()
    : range.from
      ? range.from.toISOString()
      : null;

  const dataQuery = useQuery({
    queryKey: ["admin-dashboard", sinceIso],
    queryFn: () => loadDashboardData(sinceIso),
  });

  const result = dataQuery.data;
  const raw = result?.ok ? result.data : null;

  const computed = useMemo(() => {
    if (!raw) return null;
    const current = filterByPeriod(raw.leads, range.from, range.to);
    const previous = range.previousFrom
      ? filterByPeriod(raw.leads, range.previousFrom, range.previousTo)
      : null;
    const currentIds = new Set(current.map((l) => l.id));
    const currentEvents = raw.events.filter((e) => currentIds.has(e.lead_id));
    const contracts = filterContractsBySignedAt(
      raw.contracts,
      range.from,
      range.to,
    );

    return {
      current,
      previous,
      kpis: computeKpis(current, previous, now),
      series: buildTimeSeries(current, previous, range, now),
      products: productBreakdown(current),
      funnel: buildFunnel(current, currentEvents),
      exits: buildExitBreakdown(current),
      delays: qualificationDelaysHours(current, currentEvents),
      aging: pendingAging(current, now),
      team: commercialPerformance(current, currentEvents, raw.profiles),
      finance: financialSummary(contracts),
      leadsEmpty: emptyKind(current.length, raw.totalLeadsInSystem),
      contractsEmpty: emptyKind(contracts.length, raw.totalContractsInSystem),
    };
  }, [raw, range, now]);

  const sortedTeam = useMemo(() => {
    if (!computed) return [];
    const rows = [...computed.team];
    const dir = sortAsc ? 1 : -1;
    rows.sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name, "fr") * dir;
        case "qualified":
          return (a.qualified - b.qualified) * dir;
        case "signed":
          return (a.signed - b.signed) * dir;
        case "conversion":
          return ((a.conversion ?? -1) - (b.conversion ?? -1)) * dir;
        case "delay":
          return (
            ((a.avgQualificationHours ?? Number.MAX_SAFE_INTEGER) -
              (b.avgQualificationHours ?? Number.MAX_SAFE_INTEGER)) *
            dir
          );
        case "last":
          return ((a.lastLeadAt ?? "") < (b.lastLeadAt ?? "") ? -1 : 1) * dir;
        default:
          return (a.leads - b.leads) * dir;
      }
    });
    return rows;
  }, [computed, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  if (dataQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate">
        <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
      </div>
    );
  }

  if (!result?.ok || !computed || !raw) {
    return (
      <div className="py-10">
        <Container>
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {result && !result.ok
              ? result.error
              : "Chargement du dashboard impossible."}
          </p>
        </Container>
      </div>
    );
  }

  const k = computed.kpis;
  const overSeven = computed.aging[3]?.count ?? 0;

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-h2 text-ink">Dashboard de pilotage</h1>
            <p className="mt-1 text-sm text-slate">
              Comparaison avec la période précédente de même durée.
            </p>
          </div>
          <select
            className={selectClass}
            value={preset}
            onChange={(e) => setPreset(e.target.value as PeriodPreset)}
            aria-label="Période analysée"
          >
            {PERIOD_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {raw.truncated ? (
          <p
            role="status"
            className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink"
          >
            Affichage limité aux leads les plus récents : les agrégats
            ci-dessous sont partiels.
          </p>
        ) : null}

        {computed.leadsEmpty !== "has-data" ? (
          <div className="mt-6">
            <EmptyState kind={computed.leadsEmpty} scope="lead" />
          </div>
        ) : null}

        {/* 3. Indicateurs clés */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Leads sur la période" value={nf.format(k.leads)}>
            <DeltaBadge delta={k.leadsDelta} />
          </Kpi>
          <Kpi label="Leads signés" value={nf.format(k.signed)}>
            <DeltaBadge delta={k.signedDelta} />
          </Kpi>
          <Kpi
            label="Taux de conversion"
            value={formatPercent(k.conversion)}
            tooltip={CONVERSION_DEFINITION}
          >
            {k.conversionPoints === null ? (
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate">
                <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                Comparaison indisponible
              </span>
            ) : (
              <DeltaBadge
                delta={{
                  absolute: k.conversionPoints,
                  percent: null,
                  neutral: false,
                }}
                unit="pts"
              />
            )}
          </Kpi>
          <Kpi
            label="Leads en attente"
            value={nf.format(k.pending)}
            hint={
              k.oldestPendingDays === null
                ? "Aucun lead au statut « nouveau »"
                : `Le plus ancien attend depuis ${k.oldestPendingDays} j`
            }
          />
        </div>

        {/* 4. Volume et évolution */}
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <Card title="Volume de leads" className="xl:col-span-2">
            {computed.current.length === 0 ? (
              <EmptyState kind={computed.leadsEmpty === "empty-system" ? "empty-system" : "empty-period"} scope="lead" />
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={computed.series}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="label" fontSize={11} tickMargin={8} />
                    <YAxis allowDecimals={false} fontSize={11} width={32} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar
                      dataKey="current"
                      name="Période"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      dataKey="previous"
                      name="Période précédente"
                      stroke="hsl(var(--slate))"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Répartition par produit">
            {computed.products.length === 0 ? (
              <EmptyState kind={computed.leadsEmpty === "empty-system" ? "empty-system" : "empty-period"} scope="lead" />
            ) : (
              <ul className="space-y-3">
                {computed.products.map((p) => (
                  <li key={p.productCode}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-ink">{productLabel(p.productCode)}</span>
                      <span className="whitespace-nowrap text-slate">
                        {nf.format(p.count)} · {formatPercent(p.percent, 0)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-mist">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${p.percent}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* 5. Entonnoir et sorties */}
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <Card title="Entonnoir de conversion">
            <p className="mb-4 text-xs text-slate">
              Nombre de leads ayant ATTEINT chaque étape (historique des
              statuts), et non ceux qui s'y trouvent aujourd'hui.
            </p>
            {computed.current.length === 0 ? (
              <EmptyState kind={computed.leadsEmpty === "empty-system" ? "empty-system" : "empty-period"} scope="lead" />
            ) : (
              <ul className="space-y-3">
                {computed.funnel.map((stage) => {
                  const first = computed.funnel[0]?.reached ?? 0;
                  const width = first === 0 ? 0 : (stage.reached / first) * 100;
                  return (
                    <li key={stage.status}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-ink">{statusLabel(stage.status)}</span>
                        <span className="whitespace-nowrap text-slate">
                          {nf.format(stage.reached)}
                          {stage.passRate === null
                            ? ""
                            : ` · ${formatPercent(stage.passRate, 0)} de l'étape précédente`}
                        </span>
                      </div>
                      <div className="mt-1.5 h-3 w-full rounded-full bg-mist">
                        <div
                          className="h-3 rounded-full bg-primary/80"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title="Sorties du pipeline">
            {computed.exits.lostTotal === 0 &&
            computed.exits.withoutFollowUp === 0 &&
            computed.exits.duplicates === 0 ? (
              <EmptyState
                kind={computed.leadsEmpty === "empty-system" ? "empty-system" : "empty-period"}
                scope="lead sorti du pipeline"
              />
            ) : (
              <>
                <p className="text-sm font-medium text-ink">
                  Perdus — {nf.format(computed.exits.lostTotal)}
                </p>
                {computed.exits.lost.length > 0 ? (
                  <div className="mt-3 h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={computed.exits.lost.map((l) => ({
                          name:
                            l.reason === "non_precise"
                              ? "Non précisé"
                              : lossReasonLabel(l.reason),
                          count: l.count,
                        }))}
                        margin={{ left: 8, right: 16 }}
                      >
                        <XAxis type="number" allowDecimals={false} fontSize={11} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={140}
                          fontSize={11}
                        />
                        <RechartsTooltip />
                        <Bar
                          dataKey="count"
                          name="Leads perdus"
                          fill="hsl(var(--accent))"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate">Aucun lead perdu.</p>
                )}
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-mist/60 px-3 py-2">
                    <dt className="text-slate">Sans suite</dt>
                    <dd className="text-lg font-semibold text-ink">
                      {nf.format(computed.exits.withoutFollowUp)}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-mist/60 px-3 py-2">
                    <dt className="text-slate">Doublons</dt>
                    <dd className="text-lg font-semibold text-ink">
                      {nf.format(computed.exits.duplicates)}
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </Card>
        </div>

        {/* 6. Performance par commercial */}
        <Card title="Performance par commercial" className="mt-6">
          {sortedTeam.length === 0 ? (
            <EmptyState
              kind={computed.leadsEmpty === "empty-system" ? "empty-system" : "empty-period"}
              scope="lead remonté par un commercial actif"
            />
          ) : (
            <div className="-mx-5 overflow-x-auto px-5 lg:-mx-6 lg:px-6">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-mist text-left text-xs uppercase tracking-wide text-slate">
                    {(
                      [
                        ["name", "Commercial"],
                        ["leads", "Leads"],
                        ["qualified", "Qualifiés"],
                        ["signed", "Signés"],
                        ["conversion", "Conversion"],
                        ["delay", "Délai qualif. (moy.)"],
                        ["last", "Dernier lead"],
                      ] as [SortKey, string][]
                    ).map(([key, label]) => (
                      <th key={key} className="py-2 pr-4 font-medium">
                        <button
                          type="button"
                          onClick={() => toggleSort(key)}
                          className="inline-flex items-center gap-1 hover:text-ink"
                        >
                          {label}
                          {sortKey === key ? (sortAsc ? "▲" : "▼") : ""}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedTeam.map((row) => (
                    <tr key={row.commercialId} className="border-b border-mist/70">
                      <td className="py-2.5 pr-4 text-ink">{row.name}</td>
                      <td className="py-2.5 pr-4">{nf.format(row.leads)}</td>
                      <td className="py-2.5 pr-4">{nf.format(row.qualified)}</td>
                      <td className="py-2.5 pr-4">{nf.format(row.signed)}</td>
                      <td className="py-2.5 pr-4">{formatPercent(row.conversion)}</td>
                      <td className="py-2.5 pr-4">
                        {formatHours(row.avgQualificationHours)}
                      </td>
                      <td className="py-2.5 pr-4">{formatDate(row.lastLeadAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* 7. Délais de traitement */}
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <Card title="Délais jusqu'à la qualification">
            {computed.delays.length === 0 ? (
              <EmptyState
                kind={computed.leadsEmpty === "empty-system" ? "empty-system" : "empty-period"}
                scope="lead qualifié"
              />
            ) : (
              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-mist/60 px-3 py-3">
                  <dt className="text-sm text-slate">Moyenne</dt>
                  <dd className="text-2xl font-semibold text-ink">
                    {formatHours(average(computed.delays))}
                  </dd>
                </div>
                <div className="rounded-lg bg-mist/60 px-3 py-3">
                  <dt className="text-sm text-slate">Médiane</dt>
                  <dd className="text-2xl font-semibold text-ink">
                    {formatHours(median(computed.delays))}
                  </dd>
                </div>
              </dl>
            )}
          </Card>

          <Card title="Ancienneté des leads en attente">
            {k.pending === 0 ? (
              <EmptyState
                kind={computed.leadsEmpty === "empty-system" ? "empty-system" : "empty-period"}
                scope="lead au statut « nouveau »"
              />
            ) : (
              <>
                <ul className="space-y-2">
                  {computed.aging.map((bucket) => (
                    <li
                      key={bucket.label}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                        bucket.critical && bucket.count > 0
                          ? "bg-destructive/10 text-destructive"
                          : "bg-mist/60 text-ink",
                      )}
                    >
                      <span>{bucket.label}</span>
                      <span className="font-semibold">{nf.format(bucket.count)}</span>
                    </li>
                  ))}
                </ul>
                {overSeven > 0 ? (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-destructive">
                    <TriangleAlert className="h-4 w-4" strokeWidth={2} />
                    {nf.format(overSeven)} lead{overSeven > 1 ? "s" : ""} en
                    attente depuis plus de 7 jours
                  </p>
                ) : null}
              </>
            )}
          </Card>
        </div>

        {/* 8. Suivi financier */}
        <Card title="Suivi financier" className="mt-6">
          {computed.contractsEmpty !== "has-data" ? (
            <p className="rounded-lg bg-mist/60 px-4 py-6 text-center text-sm text-slate">
              {computed.contractsEmpty === "empty-system"
                ? "Aucun contrat enregistré à ce jour : les indicateurs financiers apparaîtront dès la première signature."
                : "Aucun contrat signé sur la période sélectionnée."}
            </p>
          ) : (
            <>
              {computed.finance.commissionRatesMissing ? (
                <p className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink">
                  Taux de commission non configurés : les montants de commission
                  ne peuvent pas encore être calculés.
                </p>
              ) : null}
              <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-lg bg-mist/60 px-3 py-3">
                  <dt className="text-sm text-slate">Contrats signés</dt>
                  <dd className="text-2xl font-semibold text-ink">
                    {nf.format(computed.finance.contracts)}
                  </dd>
                </div>
                <div className="rounded-lg bg-mist/60 px-3 py-3">
                  <dt className="text-sm text-slate">Montant annuel HT</dt>
                  <dd className="text-2xl font-semibold text-ink">
                    {money.format(computed.finance.amountAnnualHt)}
                  </dd>
                </div>
                <div className="rounded-lg bg-mist/60 px-3 py-3">
                  <dt className="text-sm text-slate">
                    Commission estimée
                    <span className="ml-1 text-xs">(non sécurisée)</span>
                  </dt>
                  <dd className="text-2xl font-semibold text-ink">
                    {computed.finance.commissionRatesMissing
                      ? "—"
                      : money.format(computed.finance.commissionEstimated)}
                  </dd>
                </div>
                <div className="rounded-lg bg-primary/10 px-3 py-3">
                  <dt className="text-sm text-slate">
                    Commission sécurisée
                    <span className="ml-1 text-xs">(confirmée ou payée)</span>
                  </dt>
                  <dd className="text-2xl font-semibold text-primary">
                    {computed.finance.commissionRatesMissing
                      ? "—"
                      : money.format(computed.finance.commissionSecured)}
                  </dd>
                </div>
                {computed.finance.commissionCancelled > 0 ? (
                  <div className="rounded-lg bg-destructive/10 px-3 py-3">
                    <dt className="text-sm text-slate">Commissions annulées</dt>
                    <dd className="text-2xl font-semibold text-destructive">
                      {money.format(computed.finance.commissionCancelled)}
                    </dd>
                  </div>
                ) : null}
                <div className="rounded-lg bg-mist/60 px-3 py-3">
                  <dt className="text-sm text-slate">
                    En délai de rétractation
                  </dt>
                  <dd className="text-2xl font-semibold text-ink">
                    {nf.format(computed.finance.withdrawalPending)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-slate">
                Les commissions estimées et sécurisées ne sont jamais
                additionnées : seule la seconde est acquise.
              </p>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
}
