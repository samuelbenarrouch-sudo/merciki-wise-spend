import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_IDS, type ProductId } from "@/data/products";
import type { Database } from "@/integrations/supabase/types";

/**
 * Point d'accès unique en écriture sur la table leads.
 * Aucun composant ne doit appeler supabase.from("leads") directement.
 */

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

/** Champs reconnus comme colonnes. Tout le reste part dans details. */
export const COMMON_FIELD_KEYS = [
  "prospectFirstName",
  "prospectLastName",
  "prospectPhone",
  "prospectEmail",
  "prospectPostalCode",
  "companyName",
  "siren",
  "consent",
] as const;

/** Version du texte de consentement affiché. À incrémenter si le libellé change. */
const CONSENT_VERSION = "v1-2026-08";

/**
 * Champ portant le montant mensuel actuel, par parcours.
 * Recopié dans details.montant_mensuel_actuel pour alimenter la colonne
 * générée leads.amount_current, qui sert aux agrégats du dashboard.
 * Sans cette normalisation, la colonne resterait vide.
 */
const AMOUNT_FIELD_BY_PRODUCT: Record<ProductId, string | null> = {
  "energie": "monthlyAmount",
  "telecoms": "monthlyAmount",
  "mutuelle-sante": "currentPremium",
  "sante-animale": "currentPremium",
  "emprunteur": "currentPremium",
  "enr": null,
  "monetique": "monthlyFees",
  "energie-pro": null,
  "assurances-pro": null,
};

export type LeadFormValues = Record<string, unknown>;

export type CreateLeadResult =
  | { ok: true; id: string; reference: string }
  | { ok: false; error: string };

function text(value: unknown): string | null {
  if (typeof value === "number") return String(value);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Comparaison insensible à la casse et aux espaces. */
function isYes(value: unknown): boolean {
  return typeof value === "string" && value.trim().toLowerCase() === "oui";
}

function frenchError(code: string | undefined, message: string): string {
  switch (code) {
    case "42501":
      return "Vous n'êtes pas autorisé à enregistrer ce lead. Reconnectez-vous, et contactez votre référent si le problème persiste.";
    case "23503":
      return "Produit inconnu. Signalez ce message à votre référent.";
    case "23505":
      return "Ce lead semble déjà enregistré.";
    case "23514":
      return "Certaines informations sont invalides : vérifiez le code postal (5 chiffres) et le consentement.";
    case "PGRST301":
      return "Votre session a expiré. Reconnectez-vous.";
    default:
      return `Enregistrement impossible. Réessayez dans un instant. (${message})`;
  }
}

export async function createLead(
  productCode: ProductId,
  values: LeadFormValues,
): Promise<CreateLeadResult> {
  if (!PRODUCT_IDS.includes(productCode)) {
    return { ok: false, error: "Produit inconnu." };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    return { ok: false, error: "Votre session a expiré. Reconnectez-vous pour enregistrer ce lead." };
  }

  if (values.consent !== true) {
    return { ok: false, error: "Le consentement du prospect est obligatoire." };
  }

  // Tout champ non reconnu part dans details, tel quel.
  const details: Record<string, unknown> = {};
  const common = COMMON_FIELD_KEYS as readonly string[];
  for (const [key, value] of Object.entries(values)) {
    if (common.includes(key)) continue;
    if (value === undefined || value === null || value === "") continue;
    details[key] = value;
  }

  // Normalisation du montant, pour la colonne générée amount_current.
  const amountField = AMOUNT_FIELD_BY_PRODUCT[productCode];
  if (amountField) {
    const raw = text(values[amountField]);
    if (raw) details.montant_mensuel_actuel = raw.replace(",", ".");
  }

  const payload: LeadInsert = {
    product_code: productCode,
    commercial_id: userId,
    prospect_first_name: text(values.prospectFirstName) ?? "",
    prospect_last_name: text(values.prospectLastName) ?? "",
    prospect_phone: text(values.prospectPhone) ?? "",
    prospect_email: text(values.prospectEmail),
    postal_code: text(values.prospectPostalCode) ?? "",
    company_name: text(values.companyName),
    siren: text(values.siren),
    consent_given: true,
    consent_at: new Date().toISOString(),
    consent_version: CONSENT_VERSION,
    details: details as LeadInsert["details"],
  };

  // Énergie Pro : l'ACD déclaré comme envoyé alimente le suivi du mandat.
  if (productCode === "energie-pro" && isYes(values.acdDone)) {
    payload.mandate_status = "envoye";
  }

  const { data, error } = await supabase
    .from("leads")
    .insert(payload)
    .select("id, reference")
    .single();

  if (error) {
    console.error("[createLead]", error);
    return { ok: false, error: frenchError(error.code, error.message) };
  }

  return { ok: true, id: data.id, reference: data.reference };
}

/** Contraintes de téléversement — doivent rester alignées sur celles du bucket. */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
export const MAX_FILES = 5;
export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export type UploadLeadFilesResult =
  | { ok: true; uploaded: number }
  | { ok: false; error: string; uploaded: number };

/** Nettoie un nom de fichier pour un usage sûr comme chemin de stockage. */
function safeFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(-120);
}

/**
 * Dépose des fichiers rattachés à un lead EXISTANT.
 * Le chemin suit la convention <lead_id>/<fichier> imposée par les règles de
 * sécurité du bucket : le droit de déposer découle du droit de voir le lead.
 *
 * Renvoie le nombre de fichiers effectivement envoyés, y compris en cas
 * d'échec : l'appelant peut ainsi ne relancer que ceux qui restent.
 */
export async function uploadLeadFiles(
  leadId: string,
  files: File[],
  documentType: "facture" | "mandat" | "contrat" | "piece_identite" | "autre" = "facture",
): Promise<UploadLeadFilesResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    return { ok: false, error: "Votre session a expiré. Reconnectez-vous.", uploaded: 0 };
  }

  if (files.length > MAX_FILES) {
    return { ok: false, error: `${MAX_FILES} fichiers maximum.`, uploaded: 0 };
  }

  let uploaded = 0;

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false, error: `« ${file.name} » dépasse 10 Mo.`, uploaded };
    }

    const path = `${leadId}/${Date.now()}-${safeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("lead-files")
      .upload(path, file, { contentType: file.type || undefined, upsert: false });

    if (uploadError) {
      console.error("[uploadLeadFiles] storage", uploadError);
      return {
        ok: false,
        error: `Envoi de « ${file.name} » impossible : ${uploadError.message}`,
        uploaded,
      };
    }

    const { error: rowError } = await supabase.from("lead_attachments").insert({
      lead_id: leadId,
      storage_path: path,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
      uploaded_by: userId,
      document_type: documentType,
    });

    if (rowError) {
      // Le fichier est déposé mais non référencé : on le retire pour ne pas
      // laisser d'orphelin invisible dans le bucket.
      await supabase.storage.from("lead-files").remove([path]);
      console.error("[uploadLeadFiles] attachment", rowError);
      return {
        ok: false,
        error: `Enregistrement de « ${file.name} » impossible : ${rowError.message}`,
        uploaded,
      };
    }

    uploaded++;
  }

  return { ok: true, uploaded };
}
