/**
 * Fonctions PURES de calcul des indicateurs du dashboard.
 *
 * Ce module ne connaît ni Supabase ni React : il reçoit des tableaux de lignes
 * brutes et renvoie des agrégats. C'est volontaire — les indicateurs sont la
 * partie du projet où une erreur passe le plus facilement inaperçue ; isolés
 * ici, ils restent lisibles et vérifiables sans monter d'environnement.
 *
 * L'agrégation est faite côté client, sur les données brutes de la période :
 * à ce volume, les filtres deviennent instantanés et aucun aller-retour
 * serveur n'est nécessaire.
 * ATTENTION : au-delà de quelques milliers de leads, cette agrégation devra
 * basculer en SQL (vues matérialisées ou fonctions d'agrégation côté base).
 */

import type { Database } from "@/integrations/supabase/types";

export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type LossReason = Database["public"]["Enums"]["loss_reason"];
export type MandateStatus = Database["public"]["Enums"]["mandate_status"];

export interface AnalyticsLead {
  id: string;
  reference: string;
  created_at: string;
  status: LeadStatus;
  loss_reason: LossReason | null;
  product_code: string;
  commercial_id: string;
  mandate_status: MandateStatus;
}

export interface AnalyticsEvent {
  lead_id: string;
  event_type: string;
  from_status: LeadStatus | null;
  to_status: LeadStatus | null;
  created_at: string;
}

export interface AnalyticsProfile {
  id: string;
  full_name: string;
  role: Database["public"]["Enums"]["user_role"];
  is_active: boolean;
}

export interface AnalyticsContract {
  id: string | null;
  signed_at: string | null;
  amount_annual_ht: number | null;
  commission_expected: number | null;
  commission_actual: number | null;
  commission_status: Database["public"]["Enums"]["commission_status"] | null;
  status: Database["public"]["Enums"]["contract_status"] | null;
  retractable: boolean | null;
  /**
   * Règle d'éligibilité financière calculée EN BASE (contrat rétracté,
   * résilié ou annulé, ou commission annulée → false). Les agrégats
   * filtrent dessus et ne redérivent jamais la condition des statuts.
   */
  is_billable: boolean | null;
}

/* ------------------------------------------------------------------ */
/* Périodes                                                            */
/* ------------------------------------------------------------------ */

export type PeriodPreset = "30d" | "90d" | "12m" | "all";

export const PERIOD_PRESETS: { value: PeriodPreset; label: string }[] = [
  { value: "30d", label: "30 derniers jours" },
  { value: "90d", label: "90 derniers jours" },
  { value: "12m", label: "12 derniers mois" },
  { value: "all", label: "Tout l'historique" },
];

export type Granularity = "day" | "week" | "month";

export interface PeriodRange {
  preset: PeriodPreset;
  /** Début inclus de la période courante (null = tout l'historique). */
  from: Date | null;
  /** Fin exclue de la période courante. */
  to: Date;
  /** Début inclus de la période précédente, de MÊME DURÉE (null si non comparable). */
  previousFrom: Date | null;
  /** Fin exclue de la période précédente. */
  previousTo: Date | null;
  granularity: Granularity;
}

const DAY_MS = 86_400_000;

/**
 * Construit la période courante et la période précédente de MÊME DURÉE.
 * On ne compare jamais « mois en cours contre mois précédent » : la
 * comparaison serait fausse tant que le mois n'est pas terminé.
 */
export function buildPeriodRange(preset: PeriodPreset, now: Date): PeriodRange {
  const to = now;
  if (preset === "all") {
    return {
      preset,
      from: null,
      to,
      previousFrom: null,
      previousTo: null,
      granularity: "month",
    };
  }

  const days = preset === "30d" ? 30 : preset === "90d" ? 90 : 365;
  const from = new Date(to.getTime() - days * DAY_MS);
  const previousTo = from;
  const previousFrom = new Date(from.getTime() - days * DAY_MS);
  const granularity: Granularity =
    preset === "30d" ? "day" : preset === "90d" ? "week" : "month";

  return { preset, from, to, previousFrom, previousTo, granularity };
}

/** Filtre par date de création : `from` inclus, `to` exclu. */
export function filterByPeriod<T extends { created_at: string }>(
  rows: T[],
  from: Date | null,
  to: Date | null,
): T[] {
  return rows.filter((row) => {
    const t = new Date(row.created_at).getTime();
    if (from && t < from.getTime()) return false;
    if (to && t >= to.getTime()) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Indicateurs clés                                                    */
/* ------------------------------------------------------------------ */

/**
 * TAUX DE CONVERSION = signés / (total de la période MOINS les doublons).
 *
 * Un doublon est une saisie en double, pas une perte commerciale : l'inclure
 * au dénominateur dégraderait artificiellement le taux.
 * Renvoie `null` quand le dénominateur est nul : un taux sur zéro lead n'a
 * aucun sens et ne doit pas être affiché comme « 0 % ».
 */
export function conversionRate(leads: AnalyticsLead[]): number | null {
  const eligible = leads.filter((lead) => lead.status !== "doublon").length;
  if (eligible === 0) return null;
  const signed = leads.filter((lead) => lead.status === "signe").length;
  return (signed / eligible) * 100;
}

export const CONVERSION_DEFINITION =
  "Taux de conversion = leads signés ÷ (leads de la période − leads marqués « doublon »). Un doublon est une saisie en double, pas une perte commerciale.";

export interface Delta {
  /** Variation en valeur absolue (courant − précédent). */
  absolute: number;
  /** Variation en %, `null` si la période précédente est vide. */
  percent: number | null;
  /** `true` si aucune comparaison n'est possible (période précédente vide). */
  neutral: boolean;
}

export function computeDelta(current: number, previous: number): Delta {
  if (previous === 0) {
    return { absolute: current, percent: null, neutral: true };
  }
  return {
    absolute: current - previous,
    percent: ((current - previous) / previous) * 100,
    neutral: false,
  };
}

export interface DashboardKpis {
  leads: number;
  leadsDelta: Delta | null;
  signed: number;
  signedDelta: Delta | null;
  conversion: number | null;
  previousConversion: number | null;
  /** Variation du taux de conversion, exprimée en POINTS. `null` si incomparable. */
  conversionPoints: number | null;
  pending: number;
  /** Ancienneté en jours du plus ancien lead au statut « nouveau ». */
  oldestPendingDays: number | null;
}

export function computeKpis(
  current: AnalyticsLead[],
  previous: AnalyticsLead[] | null,
  now: Date,
): DashboardKpis {
  const signed = current.filter((l) => l.status === "signe").length;
  const conversion = conversionRate(current);

  const previousSigned = previous?.filter((l) => l.status === "signe").length ?? 0;
  const previousConversion = previous ? conversionRate(previous) : null;

  const pendingLeads = current.filter((l) => l.status === "nouveau");
  const oldest = pendingLeads.reduce<number | null>((acc, lead) => {
    const days = Math.floor(
      (now.getTime() - new Date(lead.created_at).getTime()) / DAY_MS,
    );
    return acc === null || days > acc ? days : acc;
  }, null);

  return {
    leads: current.length,
    leadsDelta: previous ? computeDelta(current.length, previous.length) : null,
    signed,
    signedDelta: previous ? computeDelta(signed, previousSigned) : null,
    conversion,
    previousConversion,
    conversionPoints:
      conversion !== null && previousConversion !== null
        ? conversion - previousConversion
        : null,
    pending: pendingLeads.length,
    oldestPendingDays: oldest,
  };
}

/* ------------------------------------------------------------------ */
/* Volume et évolution                                                 */
/* ------------------------------------------------------------------ */

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function bucketStart(date: Date, granularity: Granularity): Date {
  if (granularity === "month") {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  if (granularity === "week") {
    const d = startOfDay(date);
    // Semaine ISO : lundi comme premier jour.
    const shift = (d.getDay() + 6) % 7;
    return new Date(d.getTime() - shift * DAY_MS);
  }
  return startOfDay(date);
}

function nextBucket(date: Date, granularity: Granularity): Date {
  if (granularity === "month") {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }
  return new Date(date.getTime() + (granularity === "week" ? 7 : 1) * DAY_MS);
}

export interface SeriesPoint {
  /** Début de l'intervalle, au format ISO court (YYYY-MM-DD). */
  key: string;
  label: string;
  current: number;
  /** Volume de l'intervalle correspondant de la période précédente. */
  previous: number | null;
}

function bucketKey(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function bucketLabel(d: Date, granularity: Granularity): string {
  if (granularity === "month") {
    return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
  }
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

/**
 * Série temporelle du volume de leads, avec superposition de la période
 * précédente. Les intervalles des deux périodes sont appariés par RANG
 * (1er intervalle courant ↔ 1er intervalle précédent), les deux périodes
 * ayant la même durée.
 */
export function buildTimeSeries(
  current: AnalyticsLead[],
  previous: AnalyticsLead[] | null,
  range: PeriodRange,
  now: Date,
): SeriesPoint[] {
  const start =
    range.from ??
    (current.length > 0
      ? new Date(
          Math.min(...current.map((l) => new Date(l.created_at).getTime())),
        )
      : now);

  const counts = countByBucket(current, range.granularity);
  const previousCounts = previous
    ? countByBucket(previous, range.granularity)
    : null;
  const previousKeys = previousCounts ? [...previousCounts.keys()].sort() : [];

  const points: SeriesPoint[] = [];
  let cursor = bucketStart(start, range.granularity);
  let index = 0;
  while (cursor.getTime() < range.to.getTime()) {
    const key = bucketKey(cursor);
    const previousKey = previousKeys[index];
    points.push({
      key,
      label: bucketLabel(cursor, range.granularity),
      current: counts.get(key) ?? 0,
      previous:
        previousCounts && previousKey !== undefined
          ? (previousCounts.get(previousKey) ?? 0)
          : previousCounts
            ? 0
            : null,
    });
    cursor = nextBucket(cursor, range.granularity);
    index += 1;
  }
  return points;
}

function countByBucket(
  leads: AnalyticsLead[],
  granularity: Granularity,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const lead of leads) {
    const key = bucketKey(bucketStart(new Date(lead.created_at), granularity));
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

export interface ProductShare {
  productCode: string;
  count: number;
  percent: number;
}

export function productBreakdown(leads: AnalyticsLead[]): ProductShare[] {
  const map = new Map<string, number>();
  for (const lead of leads) {
    map.set(lead.product_code, (map.get(lead.product_code) ?? 0) + 1);
  }
  const total = leads.length;
  return [...map.entries()]
    .map(([productCode, count]) => ({
      productCode,
      count,
      percent: total === 0 ? 0 : (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

/* ------------------------------------------------------------------ */
/* Entonnoir                                                           */
/* ------------------------------------------------------------------ */

export const FUNNEL_STAGES: LeadStatus[] = [
  "nouveau",
  "qualifie",
  "transmis_fournisseur",
  "proposition_envoyee",
  "signe",
];

export interface FunnelStage {
  status: LeadStatus;
  /** Nombre de leads ayant ATTEINT l'étape (et non ceux qui s'y trouvent). */
  reached: number;
  /** Taux de passage depuis l'étape précédente, `null` pour la première. */
  passRate: number | null;
}

/**
 * Reconstitue les statuts ATTEINTS par chaque lead, EXCLUSIVEMENT à partir de
 * lead_events (`to_status` et `from_status`).
 *
 * Le déclencheur d'audit écrit un événement « created » à chaque insertion :
 * le passage par « nouveau » est donc toujours tracé. Le statut courant du
 * lead n'est volontairement PAS réintégré — cela masquerait les trous du
 * journal d'audit au lieu de les révéler (voir `countAuditGaps`).
 */
export function reachedStatuses(
  leads: AnalyticsLead[],
  events: AnalyticsEvent[],
): Map<string, Set<LeadStatus>> {
  const byLead = new Map<string, Set<LeadStatus>>();
  for (const lead of leads) byLead.set(lead.id, new Set<LeadStatus>());
  for (const event of events) {
    const set = byLead.get(event.lead_id);
    if (!set) continue; // événement hors périmètre de la période
    if (event.to_status) set.add(event.to_status);
    // `from_status` prouve également un passage par ce statut.
    if (event.from_status) set.add(event.from_status);
  }
  return byLead;
}

/**
 * Contrôle de cohérence : nombre de leads dont le statut ACTUEL n'apparaît pas
 * dans leur historique d'événements. En temps normal ce compteur vaut zéro ;
 * une valeur non nulle signale un trou du journal d'audit, que l'on affiche
 * plutôt que de le corriger silencieusement.
 */
export function countAuditGaps(
  leads: AnalyticsLead[],
  events: AnalyticsEvent[],
): number {
  const reached = reachedStatuses(leads, events);
  return leads.filter((lead) => !reached.get(lead.id)?.has(lead.status)).length;
}

export function buildFunnel(
  leads: AnalyticsLead[],
  events: AnalyticsEvent[],
): FunnelStage[] {
  const reached = reachedStatuses(leads, events);
  const counts = FUNNEL_STAGES.map(
    (status) =>
      [...reached.values()].filter((set) => set.has(status)).length,
  );

  return FUNNEL_STAGES.map((status, i) => {
    const previous = i === 0 ? null : counts[i - 1];
    const value = counts[i] ?? 0;
    return {
      status,
      reached: value,
      passRate:
        previous === null || previous === undefined || previous === 0
          ? null
          : (value / previous) * 100,
    };
  });
}

export interface ExitBreakdown {
  lost: { reason: LossReason | "non_precise"; count: number }[];
  lostTotal: number;
  withoutFollowUp: number;
  duplicates: number;
}

export function buildExitBreakdown(leads: AnalyticsLead[]): ExitBreakdown {
  const map = new Map<LossReason | "non_precise", number>();
  let lostTotal = 0;
  let withoutFollowUp = 0;
  let duplicates = 0;

  for (const lead of leads) {
    if (lead.status === "perdu") {
      lostTotal += 1;
      const key = lead.loss_reason ?? "non_precise";
      map.set(key, (map.get(key) ?? 0) + 1);
    } else if (lead.status === "sans_suite") withoutFollowUp += 1;
    else if (lead.status === "doublon") duplicates += 1;
  }

  return {
    lost: [...map.entries()]
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count),
    lostTotal,
    withoutFollowUp,
    duplicates,
  };
}

/* ------------------------------------------------------------------ */
/* Délais de traitement                                                */
/* ------------------------------------------------------------------ */

/**
 * Délai en heures entre la création du lead et son premier passage en
 * « qualifié », d'après lead_events. Les leads jamais qualifiés sont exclus.
 */
export function qualificationDelaysHours(
  leads: AnalyticsLead[],
  events: AnalyticsEvent[],
): number[] {
  const createdAt = new Map(leads.map((l) => [l.id, new Date(l.created_at).getTime()]));
  const first = new Map<string, number>();

  for (const event of events) {
    if (event.to_status !== "qualifie") continue;
    const created = createdAt.get(event.lead_id);
    if (created === undefined) continue;
    const t = new Date(event.created_at).getTime();
    const known = first.get(event.lead_id);
    if (known === undefined || t < known) first.set(event.lead_id, t);
  }

  const delays: number[] = [];
  for (const [leadId, qualifiedAt] of first) {
    const created = createdAt.get(leadId);
    if (created === undefined) continue;
    const hours = (qualifiedAt - created) / 3_600_000;
    if (hours >= 0) delays.push(hours);
  }
  return delays;
}

export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Médiane. Affichée EN PLUS de la moyenne : un seul lead traité trois mois
 * plus tard suffit à rendre une moyenne inexploitable.
 */
export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] as number;
  return (((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2);
}

export interface AgingBucket {
  label: string;
  count: number;
  /** Signale la tranche critique (> 7 jours). */
  critical: boolean;
}

export function pendingAging(leads: AnalyticsLead[], now: Date): AgingBucket[] {
  const buckets = [
    { label: "Moins de 24 h", count: 0, critical: false },
    { label: "1 à 3 jours", count: 0, critical: false },
    { label: "3 à 7 jours", count: 0, critical: false },
    { label: "Plus de 7 jours", count: 0, critical: true },
  ];

  for (const lead of leads) {
    if (lead.status !== "nouveau") continue;
    const days = (now.getTime() - new Date(lead.created_at).getTime()) / DAY_MS;
    if (days < 1) (buckets[0] as AgingBucket).count += 1;
    else if (days < 3) (buckets[1] as AgingBucket).count += 1;
    else if (days < 7) (buckets[2] as AgingBucket).count += 1;
    else (buckets[3] as AgingBucket).count += 1;
  }
  return buckets;
}

/* ------------------------------------------------------------------ */
/* Performance par commercial                                          */
/* ------------------------------------------------------------------ */

export interface CommercialPerformance {
  commercialId: string;
  name: string;
  leads: number;
  qualified: number;
  signed: number;
  /** Taux de conversion, même définition que l'indicateur global. */
  conversion: number | null;
  /** Délai moyen jusqu'à la qualification, en heures. */
  avgQualificationHours: number | null;
  /** Date du dernier lead remonté (ISO). */
  lastLeadAt: string | null;
  /** Compte désactivé : la ligne reste affichée, grisée. */
  isActive: boolean;
}

export function commercialPerformance(
  leads: AnalyticsLead[],
  events: AnalyticsEvent[],
  profiles: AnalyticsProfile[],
): CommercialPerformance[] {
  const nameById = new Map(profiles.map((p) => [p.id, p.full_name]));
  const activeById = new Map(profiles.map((p) => [p.id, p.is_active]));
  const reached = reachedStatuses(leads, events);
  const byCommercial = new Map<string, AnalyticsLead[]>();

  // Aucun commercial n'est exclu, pas même un compte désactivé : sa production
  // a eu lieu et compte dans les totaux. La somme des lignes du tableau est
  // donc TOUJOURS égale au nombre de leads de la période.
  for (const lead of leads) {
    const list = byCommercial.get(lead.commercial_id) ?? [];
    list.push(lead);
    byCommercial.set(lead.commercial_id, list);
  }

  return [...byCommercial.entries()]
    .map(([commercialId, own]) => {
      const delays = qualificationDelaysHours(own, events);
      const lastLeadAt = own.reduce<string | null>(
        (acc, lead) =>
          acc === null || lead.created_at > acc ? lead.created_at : acc,
        null,
      );
      return {
        commercialId,
        name: nameById.get(commercialId) ?? "—",
        leads: own.length,
        qualified: own.filter((l) => reached.get(l.id)?.has("qualifie")).length,
        signed: own.filter((l) => l.status === "signe").length,
        conversion: conversionRate(own),
        avgQualificationHours: average(delays),
        lastLeadAt,
        isActive: activeById.get(commercialId) ?? true,
      };
    })
    .sort((a, b) => b.leads - a.leads);
}

/* ------------------------------------------------------------------ */
/* Suivi financier                                                     */
/* ------------------------------------------------------------------ */

export interface FinancialSummary {
  contracts: number;
  amountAnnualHt: number;
  /** Commission ESTIMÉE — jamais additionnée à la commission sécurisée. */
  commissionEstimated: number;
  /** Commission SÉCURISÉE : confirmée ou payée. */
  commissionSecured: number;
  commissionCancelled: number;
  withdrawalPending: number;
  /** Vrai si aucun contrat ne porte de montant de commission renseigné. */
  commissionRatesMissing: boolean;
}

export function financialSummary(contracts: AnalyticsContract[]): FinancialSummary {
  let amountAnnualHt = 0;
  let commissionEstimated = 0;
  let commissionSecured = 0;
  let commissionCancelled = 0;
  let withdrawalPending = 0;
  let anyCommission = false;

  for (const c of contracts) {
    if (c.retractable) withdrawalPending += 1;
    const amount = c.commission_actual ?? c.commission_expected;
    if (amount !== null && amount !== undefined) anyCommission = true;
    const value = amount ?? 0;
    if (c.commission_status === "annulee") {
      commissionCancelled += value;
      continue;
    }
    // Seuls les contrats éligibles (is_billable, règle portée par la base)
    // entrent dans les montants et les commissions estimées/sécurisées.
    if (c.is_billable !== true) continue;
    amountAnnualHt += c.amount_annual_ht ?? 0;
    if (c.commission_status === "confirmee" || c.commission_status === "payee")
      commissionSecured += value;
    else commissionEstimated += value;
  }

  return {
    contracts: contracts.length,
    amountAnnualHt,
    commissionEstimated,
    commissionSecured,
    commissionCancelled,
    withdrawalPending,
    commissionRatesMissing: contracts.length > 0 && !anyCommission,
  };
}

export function filterContractsBySignedAt(
  contracts: AnalyticsContract[],
  from: Date | null,
  to: Date | null,
): AnalyticsContract[] {
  return contracts.filter((c) => {
    if (!c.signed_at) return false;
    const t = new Date(c.signed_at).getTime();
    if (from && t < from.getTime()) return false;
    if (to && t >= to.getTime()) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* États vides                                                         */
/* ------------------------------------------------------------------ */

/**
 * Deux situations à ne jamais confondre :
 *  - "empty-system"  : aucune donnée du tout dans le système
 *  - "empty-period"  : des données existent, mais aucune sur la période
 */
export type EmptyKind = "empty-system" | "empty-period" | "has-data";

export function emptyKind(periodCount: number, systemCount: number): EmptyKind {
  if (systemCount === 0) return "empty-system";
  if (periodCount === 0) return "empty-period";
  return "has-data";
}

/* ------------------------------------------------------------------ */
/* Finances — calculs PURS sur la vue v_finance_contracts              */
/* ------------------------------------------------------------------ */

/**
 * Ligne financière : la vue `v_finance_contracts` telle quelle. Depuis la
 * migration 012 elle expose `prospect_display` et les anciennetés calculées :
 * rien n'est recomposé côté client.
 */
export type FinanceRow =
  Database["public"]["Views"]["v_finance_contracts"]["Row"];

export type FinancePeriodPreset =
  | "current-month"
  | "previous-month"
  | "quarter"
  | "year"
  | "custom";

export const FINANCE_PERIOD_PRESETS: {
  value: FinancePeriodPreset;
  label: string;
}[] = [
  { value: "current-month", label: "Mois en cours" },
  { value: "previous-month", label: "Mois précédent" },
  { value: "quarter", label: "Trimestre en cours" },
  { value: "year", label: "Année en cours" },
  { value: "custom", label: "Plage personnalisée" },
];

export interface FinanceRange {
  /** Début inclus. */
  from: Date;
  /** Fin EXCLUE. */
  to: Date;
  label: string;
}

/** Résout un préréglage en plage de dates. Fonction pure : `now` est injecté. */
export function resolveFinanceRange(
  preset: FinancePeriodPreset,
  now: Date,
  custom?: { from: string; to: string },
): FinanceRange | null {
  const y = now.getFullYear();
  const m = now.getMonth();
  switch (preset) {
    case "current-month":
      return {
        from: new Date(y, m, 1),
        to: new Date(y, m + 1, 1),
        label: "Mois en cours",
      };
    case "previous-month":
      return {
        from: new Date(y, m - 1, 1),
        to: new Date(y, m, 1),
        label: "Mois précédent",
      };
    case "quarter": {
      const q = Math.floor(m / 3) * 3;
      return {
        from: new Date(y, q, 1),
        to: new Date(y, q + 3, 1),
        label: "Trimestre en cours",
      };
    }
    case "year":
      return {
        from: new Date(y, 0, 1),
        to: new Date(y + 1, 0, 1),
        label: "Année en cours",
      };
    case "custom": {
      if (!custom?.from || !custom.to) return null;
      const from = new Date(`${custom.from}T00:00:00`);
      const to = new Date(`${custom.to}T00:00:00`);
      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
      if (to.getTime() < from.getTime()) return null;
      // Borne haute inclusive côté utilisateur, exclusive côté calcul.
      to.setDate(to.getDate() + 1);
      return { from, to, label: "Plage personnalisée" };
    }
  }
}

/** Filtre par produit (sélection multiple ; vide = tous les produits). */
export function filterFinanceByProducts(
  rows: FinanceRow[],
  productCodes: string[],
): FinanceRow[] {
  if (productCodes.length === 0) return rows;
  const set = new Set(productCodes);
  return rows.filter((r) => r.product_code !== null && set.has(r.product_code));
}

/**
 * Contrats dont la commission a été ENCAISSÉE dans la plage, éligibles
 * financièrement. L'éligibilité (`is_billable`) est lue telle quelle : la
 * règle « rétracté / résilié / annulé ⇒ aucune commission » vit en base.
 */
export function filterRealized(
  rows: FinanceRow[],
  range: FinanceRange,
): FinanceRow[] {
  return rows.filter((r) => {
    if (r.is_billable !== true) return false;
    if (!r.commission_paid_at) return false;
    const t = new Date(r.commission_paid_at).getTime();
    return t >= range.from.getTime() && t < range.to.getTime();
  });
}

export interface FinanceTotals {
  contracts: number;
  /** Volume d'affaires apporté au fournisseur : indicateur d'ACTIVITÉ. */
  volumeClientHt: number;
  /** CA MERCIKI : la commission encaissée — le seul vrai revenu. */
  revenueHt: number;
  /** Coûts commerciaux : parts reversées aux commerciaux. */
  commercialCostHt: number;
  /** Marge nette = CA MERCIKI − coûts commerciaux. */
  marginHt: number;
  /** Taux de marge = marge / CA. `null` quand le CA est nul (non calculable). */
  marginRate: number | null;
}

/** Somme des indicateurs financiers d'un ensemble de contrats. */
export function computeFinanceTotals(rows: FinanceRow[]): FinanceTotals {
  let volumeClientHt = 0;
  let revenueHt = 0;
  let commercialCostHt = 0;
  for (const r of rows) {
    volumeClientHt += r.volume_client_ht ?? 0;
    revenueHt += r.commission_ht ?? 0;
    commercialCostHt += r.commercial_share_ht ?? 0;
  }
  const marginHt = revenueHt - commercialCostHt;
  return {
    contracts: rows.length,
    volumeClientHt,
    revenueHt,
    commercialCostHt,
    marginHt,
    // Un CA nul rend le taux indéfini : on renvoie null plutôt que 0 %.
    marginRate: revenueHt === 0 ? null : marginHt / revenueHt,
  };
}

export interface FinanceProductBreakdown extends FinanceTotals {
  productCode: string;
  productLabel: string;
}

/** Ventilation par produit, triée par CA MERCIKI décroissant. */
export function financeByProduct(rows: FinanceRow[]): FinanceProductBreakdown[] {
  const groups = new Map<string, { label: string; rows: FinanceRow[] }>();
  for (const r of rows) {
    const code = r.product_code ?? "—";
    const group = groups.get(code) ?? {
      label: r.product_label ?? code,
      rows: [],
    };
    group.rows.push(r);
    groups.set(code, group);
  }
  return [...groups.entries()]
    .map(([productCode, g]) => ({
      productCode,
      productLabel: g.label,
      ...computeFinanceTotals(g.rows),
    }))
    .sort((a, b) => b.revenueHt - a.revenueHt);
}

/* --- Section B : à facturer aux fournisseurs ---------------------- */

export const BILLING_STATES = ["a_facturer", "facture"] as const;

/** Nombre de jours écoulés depuis une date (pure : `now` injecté). */
export function daysSince(value: string | null, now: Date): number | null {
  if (!value) return null;
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((now.getTime() - t) / 86_400_000);
}

export const BILLING_OVERDUE_DAYS = 60;

/**
 * Retard imputable à MERCIKI : la commission est facturable depuis plus de
 * 60 jours et la facture n'a toujours pas été émise. `jours_encours` vient de
 * la vue.
 */
export function isBillingOverdue(row: FinanceRow): boolean {
  if (row.billing_state !== "a_facturer") return false;
  return row.jours_encours !== null && row.jours_encours > BILLING_OVERDUE_DAYS;
}

/**
 * Retard imputable au fournisseur : la facture est émise depuis plus de
 * 60 jours et n'est pas encaissée. `jours_depuis_facturation` vient de la vue.
 */
export function isPaymentOverdue(row: FinanceRow): boolean {
  if (row.billing_state !== "facture") return false;
  return (
    row.jours_depuis_facturation !== null &&
    row.jours_depuis_facturation > BILLING_OVERDUE_DAYS
  );
}

export interface SupplierBillingGroup {
  supplierId: string;
  supplierName: string;
  rows: FinanceRow[];
  contracts: number;
  /** Total des commissions à facturer ET déjà facturées non encaissées. */
  totalHt: number;
  toInvoiceHt: number;
  invoicedHt: number;
  toInvoiceCount: number;
  invoicedCount: number;
  /** Encours facturables depuis > 60 j : facture à émettre par MERCIKI. */
  overdueCount: number;
  /** Factures émises depuis > 60 j et non encaissées : fournisseur à relancer. */
  paymentOverdueCount: number;
}

export interface ProductBillingGroup {
  productCode: string;
  productLabel: string;
  contracts: number;
  totalHt: number;
  overdueCount: number;
  paymentOverdueCount: number;
  suppliers: SupplierBillingGroup[];
}

export function filterBillingPending(rows: FinanceRow[]): FinanceRow[] {
  return rows.filter(
    (r) =>
      // Ceinture et bretelles : billing_state vaut déjà « annule » pour ces
      // contrats, mais on filtre aussi sur l'éligibilité portée par la base.
      r.is_billable === true &&
      (r.billing_state === "a_facturer" || r.billing_state === "facture"),
  );
}

/** Regroupement à deux niveaux : produit, puis fournisseur. */
export function groupBillingByProductSupplier(
  rows: FinanceRow[],
): ProductBillingGroup[] {
  const byProduct = new Map<string, FinanceRow[]>();
  const labels = new Map<string, string>();
  for (const r of rows) {
    const code = r.product_code ?? "—";
    labels.set(code, r.product_label ?? code);
    byProduct.set(code, [...(byProduct.get(code) ?? []), r]);
  }

  const products: ProductBillingGroup[] = [];
  for (const [productCode, productRows] of byProduct) {
    const bySupplier = new Map<string, FinanceRow[]>();
    const names = new Map<string, string>();
    for (const r of productRows) {
      const key = r.supplier_id ?? r.supplier_name ?? "—";
      names.set(key, r.supplier_name ?? "Fournisseur non renseigné");
      bySupplier.set(key, [...(bySupplier.get(key) ?? []), r]);
    }
    const suppliers: SupplierBillingGroup[] = [...bySupplier.entries()]
      .map(([supplierId, supplierRows]) => {
        let toInvoiceHt = 0;
        let invoicedHt = 0;
        let toInvoiceCount = 0;
        let invoicedCount = 0;
        let overdueCount = 0;
        let paymentOverdueCount = 0;
        for (const r of supplierRows) {
          const amount = r.commission_ht ?? 0;
          if (r.billing_state === "a_facturer") {
            toInvoiceHt += amount;
            toInvoiceCount += 1;
            if (isBillingOverdue(r)) overdueCount += 1;
          } else {
            invoicedHt += amount;
            invoicedCount += 1;
            if (isPaymentOverdue(r)) paymentOverdueCount += 1;
          }
        }
        return {
          supplierId,
          supplierName: names.get(supplierId) ?? "—",
          rows: supplierRows,
          contracts: supplierRows.length,
          totalHt: toInvoiceHt + invoicedHt,
          toInvoiceHt,
          invoicedHt,
          toInvoiceCount,
          invoicedCount,
          overdueCount,
          paymentOverdueCount,
        };
      })
      .sort((a, b) => b.totalHt - a.totalHt);

    products.push({
      productCode,
      productLabel: labels.get(productCode) ?? productCode,
      contracts: productRows.length,
      totalHt: suppliers.reduce((sum, s) => sum + s.totalHt, 0),
      overdueCount: suppliers.reduce((sum, s) => sum + s.overdueCount, 0),
      paymentOverdueCount: suppliers.reduce(
        (sum, s) => sum + s.paymentOverdueCount,
        0,
      ),
      suppliers,
    });
  }
  return products.sort((a, b) => b.totalHt - a.totalHt);
}

/* --- Section C : à régler aux commerciaux ------------------------- */

export function filterPayoutPending(rows: FinanceRow[]): FinanceRow[] {
  return rows.filter(
    (r) =>
      // Même garde que filterBillingPending : un contrat non éligible n'a
      // rien à faire dans les montants à régler.
      r.is_billable === true &&
      (r.payout_state === "facture_a_recevoir" || r.payout_state === "a_regler"),
  );
}

export interface CommercialPayoutGroup {
  commercialId: string;
  commercialName: string;
  isActive: boolean;
  rows: FinanceRow[];
  contracts: number;
  totalHt: number;
  invoiceAwaitedHt: number;
  toPayHt: number;
  invoiceAwaitedCount: number;
  toPayCount: number;
}

export function groupPayoutByCommercial(
  rows: FinanceRow[],
): CommercialPayoutGroup[] {
  const groups = new Map<string, FinanceRow[]>();
  for (const r of rows) {
    const key = r.commercial_id ?? "—";
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  return [...groups.entries()]
    .map(([commercialId, groupRows]) => {
      let invoiceAwaitedHt = 0;
      let toPayHt = 0;
      let invoiceAwaitedCount = 0;
      let toPayCount = 0;
      for (const r of groupRows) {
        const amount = r.commercial_share_ht ?? 0;
        if (r.payout_state === "facture_a_recevoir") {
          invoiceAwaitedHt += amount;
          invoiceAwaitedCount += 1;
        } else {
          toPayHt += amount;
          toPayCount += 1;
        }
      }
      const first = groupRows[0];
      return {
        commercialId,
        commercialName: first?.commercial_name ?? "Commercial inconnu",
        isActive: first?.commercial_is_active !== false,
        rows: groupRows,
        contracts: groupRows.length,
        totalHt: invoiceAwaitedHt + toPayHt,
        invoiceAwaitedHt,
        toPayHt,
        invoiceAwaitedCount,
        toPayCount,
      };
    })
    .sort((a, b) => b.totalHt - a.totalHt);
}

/** Récapitulatif copiable : nom, nombre de contrats, total dû. */
export function payoutSummaryText(groups: CommercialPayoutGroup[]): string {
  const lines = ["Commercial\tContrats\tTotal dû HT"];
  for (const g of groups) {
    lines.push(
      `${g.commercialName}\t${g.contracts}\t${g.totalHt.toFixed(2)} €`,
    );
  }
  return lines.join("\n");
}
