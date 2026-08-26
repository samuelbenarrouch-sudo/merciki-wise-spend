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
 * Reconstitue les statuts ATTEINTS par chaque lead.
 *
 * Un lead signé est passé par les étapes antérieures : compter les statuts
 * courants sous-estimerait gravement le haut de l'entonnoir. Un statut est
 * considéré comme atteint si le lead porte un événement de changement de
 * statut VERS ce statut, ou s'il s'y trouve aujourd'hui. Tout lead a par
 * ailleurs été créé au statut « nouveau » : la création vaut donc passage
 * par la première étape.
 */
export function reachedStatuses(
  leads: AnalyticsLead[],
  events: AnalyticsEvent[],
): Map<string, Set<LeadStatus>> {
  const byLead = new Map<string, Set<LeadStatus>>();
  for (const lead of leads) {
    const set = new Set<LeadStatus>(["nouveau", lead.status]);
    byLead.set(lead.id, set);
  }
  for (const event of events) {
    const set = byLead.get(event.lead_id);
    if (!set) continue; // événement hors périmètre de la période
    if (event.to_status) set.add(event.to_status);
    // `from_status` prouve également un passage par ce statut.
    if (event.from_status) set.add(event.from_status);
  }
  return byLead;
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
}

export function commercialPerformance(
  leads: AnalyticsLead[],
  events: AnalyticsEvent[],
  profiles: AnalyticsProfile[],
): CommercialPerformance[] {
  const nameById = new Map(profiles.map((p) => [p.id, p.full_name]));
  const activeIds = new Set(profiles.filter((p) => p.is_active).map((p) => p.id));
  const reached = reachedStatuses(leads, events);
  const byCommercial = new Map<string, AnalyticsLead[]>();

  for (const lead of leads) {
    // Un commercial désactivé n'a plus vocation à figurer au pilotage.
    if (!activeIds.has(lead.commercial_id)) continue;
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
    amountAnnualHt += c.amount_annual_ht ?? 0;
    if (c.retractable) withdrawalPending += 1;
    const amount = c.commission_actual ?? c.commission_expected;
    if (amount !== null && amount !== undefined) anyCommission = true;
    const value = amount ?? 0;
    if (c.commission_status === "annulee") commissionCancelled += value;
    else if (c.commission_status === "confirmee" || c.commission_status === "payee")
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
