import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_IDS, type ProductId } from "@/data/products";

/**
 * Point d'accès unique en écriture sur la table leads.
 * Aucun composant ne doit appeler supabase.from("leads") directement.
 */

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

  const payload: Record<string, unknown> = {
    product_code: productCode,
    commercial_id: userId,
    prospect_first_name: text(values.prospectFirstName),
    prospect_last_name: text(values.prospectLastName),
    prospect_phone: text(values.prospectPhone),
    prospect_email: text(values.prospectEmail),
    postal_code: text(values.prospectPostalCode),
    company_name: text(values.companyName),
    siren: text(values.siren),
    consent_given: true,
    consent_at: new Date().toISOString(),
    consent_version: CONSENT_VERSION,
    details,
  };

  // Énergie Pro : l'ACD déclaré comme envoyé alimente le suivi du mandat.
  if (productCode === "energie-pro" && values.acdDone === "Oui") {
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
