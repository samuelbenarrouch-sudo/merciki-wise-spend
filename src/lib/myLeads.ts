import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * Module de LECTURE SEULE pour l'espace commercial (commerciaux et managers).
 *
 * Volontairement autonome : il n'importe rien de src/lib/backoffice.ts, afin
 * que le code d'administration (contrats, commissions, comptes) ne parte
 * jamais dans le navigateur d'un commercial.
 *
 * Aucune écriture. Aucune lecture de : notes, duplicate_of, contracts,
 * product_commissions, v_* d'administration, RPC suggest_commission.
 */

export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type LossReason = Database["public"]["Enums"]["loss_reason"];
export type MandateStatus = Database["public"]["Enums"]["mandate_status"];

export const MY_LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "nouveau", label: "Nouveau" },
  { value: "qualifie", label: "Qualifié" },
  { value: "transmis_fournisseur", label: "Transmis fournisseur" },
  { value: "proposition_envoyee", label: "Proposition envoyée" },
  { value: "signe", label: "Signé" },
  { value: "perdu", label: "Perdu" },
  { value: "doublon", label: "Doublon" },
  { value: "sans_suite", label: "Sans suite" },
];

const LOSS_REASON_LABELS: Record<LossReason, string> = {
  prix_non_competitif: "Prix non compétitif",
  client_injoignable: "Client injoignable",
  deja_engage_ailleurs: "Déjà engagé ailleurs",
  hors_cible: "Hors cible",
  dossier_incomplet: "Dossier incomplet",
  client_a_renonce: "Le client a renoncé",
  refus_fournisseur: "Refus fournisseur",
  non_eligible: "Non éligible",
  autre: "Autre",
};

export const MANDATE_LABELS: Record<MandateStatus, string> = {
  non_requis: "Non requis",
  a_envoyer: "À envoyer",
  envoye: "Envoyé",
  signe: "Signé",
  refuse: "Refusé",
};

export const myStatusLabel = (status: LeadStatus): string =>
  MY_LEAD_STATUSES.find((s) => s.value === status)?.label ?? status;

export const myLossReasonLabel = (reason: LossReason): string =>
  LOSS_REASON_LABELS[reason] ?? reason;

export const MY_LEADS_PAGE_SIZE = 50;

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Messages d'erreur en français, alignés sur les autres modules. */
function frenchError(code: string | undefined, message: string): string {
  switch (code) {
    case "42501":
      return "Accès refusé : vous n'avez pas les droits sur ces données.";
    case "PGRST116":
      return "Lead introuvable.";
    case "22P02":
      return "Valeur non reconnue dans un filtre. Signalez ce message.";
    default:
      return `Lecture impossible pour le moment (${message}).`;
  }
}

/** Neutralise les caractères réservés du filtre `or` de PostgREST. */
function sanitizeSearch(value: string): string {
  return value.trim().replace(/[,()%*]/g, " ").replace(/\s+/g, " ").trim();
}

/** Colonnes explicitement sélectionnées : ni `notes`, ni `duplicate_of`. */
const LIST_SELECT =
  "id, reference, created_at, status, product_code, commercial_id, " +
  "prospect_first_name, prospect_last_name, prospect_phone, postal_code, " +
  "company_name, products(label), profiles!leads_commercial_id_fkey(full_name)";

const DETAIL_SELECT =
  "id, reference, created_at, status, product_code, commercial_id, " +
  "prospect_first_name, prospect_last_name, prospect_phone, prospect_email, " +
  "postal_code, company_name, siren, details, loss_reason, loss_comment, " +
  "mandate_status, mandate_sent_at, mandate_signed_at, " +
  "products(label, requires_mandate), profiles!leads_commercial_id_fkey(full_name)";

export interface MyLeadRow {
  id: string;
  reference: string;
  created_at: string;
  status: LeadStatus;
  product_code: string;
  commercial_id: string;
  prospect_first_name: string;
  prospect_last_name: string;
  prospect_phone: string;
  postal_code: string;
  company_name: string | null;
  products: { label: string } | null;
  profiles: { full_name: string | null } | null;
}

export interface MyLeadDetail extends MyLeadRow {
  prospect_email: string | null;
  siren: string | null;
  details: Record<string, unknown>;
  loss_reason: LossReason | null;
  loss_comment: string | null;
  mandate_status: MandateStatus;
  mandate_sent_at: string | null;
  mandate_signed_at: string | null;
  products: { label: string; requires_mandate: boolean } | null;
}

export interface MyLeadAttachment {
  id: string;
  lead_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  document_type: string;
  created_at: string;
}

export interface MyLeadsFilters {
  /** "mine" = mes leads uniquement ; "team" = tout ce que je peux voir (managers). */
  scope: "mine" | "team";
  search?: string;
  productCode?: string;
  status?: LeadStatus | "";
  commercialId?: string;
  page?: number;
}

export async function listMyLeads(
  filters: MyLeadsFilters,
): Promise<Result<{ rows: MyLeadRow[]; total: number; page: number }>> {
  const page = Math.max(0, filters.page ?? 0);

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { ok: false, error: "Session expirée, reconnectez-vous." };

  let query = supabase
    .from("leads")
    .select(LIST_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(
      page * MY_LEADS_PAGE_SIZE,
      page * MY_LEADS_PAGE_SIZE + MY_LEADS_PAGE_SIZE - 1,
    );

  // Deuxième barrière, en plus de la RLS : le filtre est explicite dans le code.
  if (filters.scope === "mine") {
    query = query.eq("commercial_id", userId);
  } else if (filters.commercialId) {
    query = query.eq("commercial_id", filters.commercialId);
  }

  if (filters.productCode) query = query.eq("product_code", filters.productCode);
  if (filters.status) query = query.eq("status", filters.status);

  const search = sanitizeSearch(filters.search ?? "");
  if (search) {
    const like = `%${search}%`;
    query = query.or(
      [
        `prospect_last_name.ilike.${like}`,
        `prospect_first_name.ilike.${like}`,
        `prospect_phone.ilike.${like}`,
        `reference.ilike.${like}`,
      ].join(","),
    );
  }

  const { data, error, count } = await query;
  if (error) {
    console.error("[listMyLeads]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }

  return {
    ok: true,
    data: {
      rows: (data ?? []) as unknown as MyLeadRow[],
      total: count ?? 0,
      page,
    },
  };
}

export async function getMyLead(leadId: string): Promise<Result<MyLeadDetail>> {
  const { data, error } = await supabase
    .from("leads")
    .select(DETAIL_SELECT)
    .eq("id", leadId)
    .maybeSingle();

  if (error) {
    console.error("[getMyLead]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  if (!data) return { ok: false, error: "Lead introuvable." };

  return { ok: true, data: data as unknown as MyLeadDetail };
}

export async function listMyLeadAttachments(
  leadId: string,
): Promise<Result<MyLeadAttachment[]>> {
  const { data, error } = await supabase
    .from("lead_attachments")
    .select(
      "id, lead_id, storage_path, file_name, mime_type, size_bytes, document_type, created_at",
    )
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[listMyLeadAttachments]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  return { ok: true, data: (data ?? []) as MyLeadAttachment[] };
}

/** Récupère le fichier via la route relais authentifiée /api/lead-file. */
export async function fetchMyLeadFile(storagePath: string): Promise<Result<Blob>> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return { ok: false, error: "Session expirée, reconnectez-vous." };

  try {
    const res = await fetch(`/api/lead-file?path=${encodeURIComponent(storagePath)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return {
        ok: false,
        error:
          res.status === 404
            ? "Fichier indisponible."
            : "Téléchargement impossible pour le moment.",
      };
    }
    return { ok: true, data: await res.blob() };
  } catch (e) {
    console.error("[fetchMyLeadFile]", e);
    return { ok: false, error: "Téléchargement impossible pour le moment." };
  }
}
