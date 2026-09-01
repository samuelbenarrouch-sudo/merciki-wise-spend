import { formatDetailValue, resolveFieldLabel } from "@/lib/fieldLabels";
import type { LeadWithRelations } from "@/lib/backoffice";

/**
 * Construction du récapitulatif transmis au fournisseur.
 *
 * RÈGLE ABSOLUE : seules les informations du prospect et de son dossier de
 * qualification sortent d'ici. Jamais :
 *  - le commercial (profiles, commercial_id) ou quoi que ce soit le concernant ;
 *  - le statut du lead, son historique (lead_events), ses notes internes ;
 *  - les contrats, commissions et montants de rémunération.
 */

export interface TransmitRecap {
  subject: string;
  body: string;
}

function line(label: string, value: string | null | undefined): string | null {
  const v = value?.trim();
  return v ? `${label} : ${v}` : null;
}

function identityLines(lead: LeadWithRelations): string[] {
  const nom = [lead.prospect_first_name, lead.prospect_last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return [
    line("Nom", nom),
    line("Société", lead.company_name),
    line("SIREN", lead.siren),
    line("Téléphone", lead.prospect_phone),
    line("Email", lead.prospect_email),
    line("Code postal", lead.postal_code),
  ].filter((l): l is string => l !== null);
}

/** Corps complet : identité + qualification avec libellés résolus. */
export function buildTransmitRecap(lead: LeadWithRelations): TransmitRecap {
  const productLabel = lead.products?.label ?? lead.product_code;
  const subject = `[MERCIKI] Dossier ${productLabel} — ${lead.reference}`;

  const details = (lead.details ?? {}) as Record<string, unknown>;
  const qualification = Object.keys(details).flatMap((key) => {
    const values = formatDetailValue(lead.product_code, key, details[key]);
    if (values.length === 0 || (values.length === 1 && values[0] === "—")) {
      return [];
    }
    return [`${resolveFieldLabel(lead.product_code, key)} : ${values.join(", ")}`];
  });

  const body = [
    "PROSPECT",
    "",
    ...identityLines(lead),
    "",
    "QUALIFICATION",
    "",
    ...(qualification.length > 0 ? qualification : ["Aucune information complémentaire."]),
  ].join("\n");

  return { subject, body };
}

/**
 * Corps réduit pour les clients mail qui tronquent les liens mailto:
 * identité seule + consigne de collage du récapitulatif complet.
 */
export function buildShortBody(lead: LeadWithRelations): string {
  return [
    "PROSPECT",
    "",
    ...identityLines(lead),
    "",
    "Récapitulatif complet à coller ici (bouton Copier).",
  ].join("\n");
}

/** Seuil de sécurité : au-delà, plusieurs messageries tronquent sans avertir. */
export const MAILTO_BODY_LIMIT = 1800;

/** Lien mailto: sans destinataire, corps raccourci si nécessaire. */
export function buildMailto(lead: LeadWithRelations): {
  href: string;
  truncated: boolean;
} {
  const { subject, body } = buildTransmitRecap(lead);
  const truncated = encodeURIComponent(body).length > MAILTO_BODY_LIMIT;
  const effectiveBody = truncated ? buildShortBody(lead) : body;
  const href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(effectiveBody)}`;
  return { href, truncated };
}
