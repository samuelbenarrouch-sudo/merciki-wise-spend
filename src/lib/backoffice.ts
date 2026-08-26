import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * Point d'accès unique en lecture/écriture pour le backoffice d'administration.
 * Aucun écran d'administration n'appelle supabase directement.
 */

export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type LossReason = Database["public"]["Enums"]["loss_reason"];
export type MandateStatus = Database["public"]["Enums"]["mandate_status"];
export type UserRole = Database["public"]["Enums"]["user_role"];

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "nouveau", label: "Nouveau" },
  { value: "qualifie", label: "Qualifié" },
  { value: "transmis_fournisseur", label: "Transmis fournisseur" },
  { value: "proposition_envoyee", label: "Proposition envoyée" },
  { value: "signe", label: "Signé" },
  { value: "perdu", label: "Perdu" },
  { value: "doublon", label: "Doublon" },
  { value: "sans_suite", label: "Sans suite" },
];

export const LOSS_REASONS: { value: LossReason; label: string }[] = [
  { value: "prix_non_competitif", label: "Prix non compétitif" },
  { value: "client_injoignable", label: "Client injoignable" },
  { value: "deja_engage_ailleurs", label: "Déjà engagé ailleurs" },
  { value: "hors_cible", label: "Hors cible" },
  { value: "dossier_incomplet", label: "Dossier incomplet" },
  { value: "client_a_renonce", label: "Le client a renoncé" },
  { value: "refus_fournisseur", label: "Refus fournisseur" },
  { value: "non_eligible", label: "Non éligible" },
  { value: "autre", label: "Autre" },
];

export const MANDATE_STATUS_LABELS: Record<MandateStatus, string> = {
  non_requis: "Non requis",
  a_envoyer: "À envoyer",
  envoye: "Envoyé",
  signe: "Signé",
  refuse: "Refusé",
};

export const statusLabel = (status: LeadStatus): string =>
  LEAD_STATUSES.find((s) => s.value === status)?.label ?? status;

export const lossReasonLabel = (reason: LossReason): string =>
  LOSS_REASONS.find((r) => r.value === reason)?.label ?? reason;

export const PAGE_SIZE = 50;

/** Messages d'erreur en français, alignés sur src/lib/leads.ts. */
function frenchError(code: string | undefined, message: string): string {
  switch (code) {
    case "42501":
      return "Vous n'êtes pas autorisé à effectuer cette opération.";
    case "PGRST301":
      return "Votre session a expiré. Reconnectez-vous.";
    case "23514":
      // Règles métier (mandat ACD, motif de perte) : le message de la base est
      // rédigé en français et reste plus précis que toute reformulation.
      return message;
    default:
      return message || "Opération impossible. Réessayez dans un instant.";
  }
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const LEAD_SELECT =
  "*, products(label, vertical, tunnel, requires_mandate), profiles!leads_commercial_id_fkey(full_name)";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

export interface LeadWithRelations extends LeadRow {
  products: {
    label: string;
    vertical: string;
    tunnel: Database["public"]["Enums"]["tunnel_type"];
    requires_mandate: boolean;
  } | null;
  profiles: { full_name: string } | null;
}

export interface LeadFilters {
  search?: string;
  productCode?: string;
  status?: LeadStatus | "";
  commercialId?: string;
  from?: string;
  to?: string;
  page?: number;
}

/** Échappe les caractères spéciaux d'un filtre PostgREST `or`. */
function sanitizeSearch(value: string): string {
  return value.replace(/[,()%*\\]/g, " ").trim();
}

export async function listLeads(
  filters: LeadFilters = {},
): Promise<Result<{ rows: LeadWithRelations[]; total: number; page: number }>> {
  const page = Math.max(0, filters.page ?? 0);

  let query = supabase
    .from("leads")
    .select(LEAD_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (filters.productCode) query = query.eq("product_code", filters.productCode);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.commercialId) query = query.eq("commercial_id", filters.commercialId);
  if (filters.from) query = query.gte("created_at", filters.from);
  if (filters.to) query = query.lte("created_at", filters.to);

  const search = sanitizeSearch(filters.search ?? "");
  if (search) {
    const like = `%${search}%`;
    query = query.or(
      [
        `prospect_last_name.ilike.${like}`,
        `prospect_first_name.ilike.${like}`,
        `prospect_phone.ilike.${like}`,
        `reference.ilike.${like}`,
        `company_name.ilike.${like}`,
      ].join(","),
    );
  }

  const { data, error, count } = await query;
  if (error) {
    console.error("[listLeads]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  return {
    ok: true,
    data: {
      rows: (data ?? []) as unknown as LeadWithRelations[],
      total: count ?? 0,
      page,
    },
  };
}

export async function getLead(leadId: string): Promise<Result<LeadWithRelations>> {
  const { data, error } = await supabase
    .from("leads")
    .select(LEAD_SELECT)
    .eq("id", leadId)
    .single();

  if (error) {
    console.error("[getLead]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  return { ok: true, data: data as unknown as LeadWithRelations };
}

export interface LeadEvent {
  id: number;
  event_type: string;
  from_status: LeadStatus | null;
  to_status: LeadStatus | null;
  changes: Database["public"]["Tables"]["lead_events"]["Row"]["changes"];
  created_at: string;
  profiles: { full_name: string } | null;
}

export async function listLeadEvents(leadId: string): Promise<Result<LeadEvent[]>> {
  const { data, error } = await supabase
    .from("lead_events")
    .select(
      "id, event_type, from_status, to_status, changes, created_at, profiles!lead_events_actor_id_fkey(full_name)",
    )
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[listLeadEvents]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  return { ok: true, data: (data ?? []) as unknown as LeadEvent[] };
}

export interface LeadAttachment {
  id: string;
  file_name: string;
  size_bytes: number | null;
  mime_type: string | null;
  document_type: string;
  created_at: string;
  /** Chemin de stockage `<lead_id>/<fichier>`, servi via /api/lead-file. */
  storage_path: string;
}

export async function listAttachments(
  leadId: string,
): Promise<Result<LeadAttachment[]>> {
  const { data, error } = await supabase
    .from("lead_attachments")
    .select("id, file_name, size_bytes, mime_type, document_type, created_at, storage_path")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[listAttachments]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }

  return { ok: true, data: (data ?? []) as LeadAttachment[] };
}

/**
 * Récupère une pièce jointe via la route relais de l'application
 * (évite les blocages d'extensions sur les URL *.supabase.co).
 * La création/libération de l'URL d'objet est laissée à l'appelant.
 */
export async function openLeadAttachment(
  storagePath: string,
): Promise<Result<Blob>> {
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
    const blob = await res.blob();
    return { ok: true, data: blob };
  } catch (e) {
    console.error("[openLeadAttachment]", e);
    return { ok: false, error: "Téléchargement impossible pour le moment." };
  }
}


export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  lossReason?: LossReason | null,
  comment?: string | null,
): Promise<Result<true>> {
  const patch: Database["public"]["Tables"]["leads"]["Update"] = { status };
  if (status === "perdu") {
    if (!lossReason) {
      return { ok: false, error: "Le motif de perte est obligatoire." };
    }
    patch.loss_reason = lossReason;
    patch.loss_comment = comment?.trim() || null;
  } else {
    patch.loss_reason = null;
    patch.loss_comment = null;
  }

  const { error } = await supabase.from("leads").update(patch).eq("id", leadId);
  if (error) {
    console.error("[updateLeadStatus]", error);
    // Message de la base affiché tel quel : il porte la règle métier
    // (mandat ACD non signé, par exemple).
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  return { ok: true, data: true };
}

export type PotentialDuplicate =
  Database["public"]["Views"]["v_potential_duplicates"]["Row"];

export async function listPotentialDuplicates(): Promise<Result<PotentialDuplicate[]>> {
  const { data, error } = await supabase
    .from("v_potential_duplicates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[listPotentialDuplicates]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  return { ok: true, data: data ?? [] };
}

export interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  manager_id: string | null;
  is_active: boolean;
  created_at: string;
  manager: { full_name: string } | null;
}

export async function listTeam(): Promise<Result<TeamMember[]>> {
  // Auto-jointure abandonnée : PostgREST ne résout pas profiles -> profiles
  // de façon fiable. On charge tous les profils à plat (ils tiennent dans une
  // seule requête) et on résout le nom du manager côté client.
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, manager_id, is_active, created_at")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[listTeam]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }

  const rows = data ?? [];
  const nameById = new Map(rows.map((row) => [row.id, row.full_name]));
  const members: TeamMember[] = rows.map((row) => ({
    ...row,
    manager: row.manager_id
      ? { full_name: nameById.get(row.manager_id) ?? "—" }
      : null,
  }));
  return { ok: true, data: members };
}


export async function updateProfile(
  userId: string,
  patch: {
    full_name?: string;
    manager_id?: string | null;
    is_active?: boolean;
    role?: UserRole;
  },
): Promise<Result<true>> {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) {
    console.error("[updateProfile]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  return { ok: true, data: true };
}

/** Liste courte des commerciaux, pour les filtres et les rattachements. */
export async function listProfilesLight(): Promise<
  Result<{ id: string; full_name: string; role: UserRole }[]>
> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[listProfilesLight]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }
  return { ok: true, data: data ?? [] };
}

export interface CreatedAccount {
  email: string;
  password: string;
  /** Succès partiel : le compte existe, mais une étape secondaire a échoué. */
  warning?: string;
}

/**
 * Création d'un compte commercial via l'Edge Function `create-commercial`
 * (la clé de service n'est disponible que dans ce runtime).
 * Le client Supabase joint automatiquement le jeton de session : aucun en-tête
 * n'est ajouté à la main.
 */
export async function createCommercialAccount(input: {
  email: string;
  fullName: string;
  managerId: string | null;
}): Promise<Result<CreatedAccount>> {
  const { data, error } = await supabase.functions.invoke<
    Partial<CreatedAccount> & { error?: string }
  >("create-commercial", {
    body: {
      email: input.email.trim(),
      fullName: input.fullName.trim(),
      managerId: input.managerId,
    },
  });

  if (error) {
    console.error("[createCommercialAccount]", error);
    return { ok: false, error: await readFunctionError(error) };
  }

  // Succès dès lors que l'email et le mot de passe sont présents : `warning`
  // signale un succès partiel (profil incomplet), jamais un échec.
  if (data && typeof data.email === "string" && typeof data.password === "string") {
    return {
      ok: true,
      data: {
        email: data.email,
        password: data.password,
        ...(typeof data.warning === "string" && data.warning
          ? { warning: data.warning }
          : {}),
      },
    };
  }

  console.error("[createCommercialAccount] réponse inattendue", { data, error });
  return {
    ok: false,
    error: data?.error ?? "Réponse inattendue du serveur. Réessayez.",
  };
}


/**
 * supabase-js masque le corps des réponses non-2xx derrière un message
 * générique en anglais. Le corps JSON `{ error: "..." }` reste accessible via
 * `error.context` (la Response brute) : on le lit pour remonter le message
 * métier en français.
 */
async function readFunctionError(error: unknown): Promise<string> {
  const fallback = "Création du compte impossible. Réessayez dans un instant.";
  const context = (error as { context?: unknown }).context;
  if (!context) return fallback;

  try {
    let payload: unknown;
    if (typeof Response !== "undefined" && context instanceof Response) {
      payload = await context.clone().json();
    } else if (typeof context === "string") {
      payload = JSON.parse(context);
    } else {
      payload = context;
    }
    const message = (payload as { error?: unknown } | null)?.error;
    return typeof message === "string" && message.trim() ? message : fallback;
  } catch {
    return fallback;
  }
}
