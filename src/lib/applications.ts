import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * Point d'accès unique en écriture sur la table applications.
 * Aucun composant ne doit appeler supabase.from("applications") directement.
 */

type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];
type SalesExperience = Database["public"]["Enums"]["sales_experience"];
type CurrentSituation = Database["public"]["Enums"]["current_situation"];
type Availability = Database["public"]["Enums"]["availability"];

export type Department = Database["public"]["Tables"]["departments"]["Row"];

/** Version du texte de consentement affiché sur /recrutement. */
const CONSENT_VERSION = "recrutement-v1-2026-09";

export interface ApplicationFormValues {
  firstName: unknown;
  lastName: unknown;
  email: unknown;
  phone: unknown;
  departments: unknown;
  productCodes: unknown;
  experience: unknown;
  situation?: unknown;
  availability?: unknown;
  link?: unknown;
  message?: unknown;
  consent: unknown;
}

export type SubmitApplicationResult =
  | { ok: true }
  | { ok: false; error: string };

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v !== "");
}

function frenchError(
  code: string | undefined,
  message: string,
  details: string | null,
  hint: string | null,
): string {
  // Journal complet pour diagnostic : message, code, details et hint.
  console.error("[submitApplication] échec insertion", { code, message, details, hint });
  switch (code) {
    case "23505":
      // La base renvoie ici un message français explicite (candidature déjà envoyée).
      return message;
    case "23514":
      return "Certaines informations sont invalides. Vérifiez les champs obligatoires.";
    case "22P02":
      // Valeur fautive présente dans details/message : journalisée ci-dessus.
      return "Valeur non reconnue dans un champ à choix. Signalez ce message.";
    case "42501":
      return "Envoi refusé par le serveur.";
    default:
      return `Envoi impossible. Réessayez dans un instant. (${message})`;
  }
}

/** Liste des départements, triée par code. */
export async function listDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from("departments")
    .select("code, name")
    .order("code", { ascending: true });

  if (error) {
    throw new Error(
      `Chargement des départements impossible. Réessayez dans un instant. (${error.message})`,
    );
  }
  return data ?? [];
}

export async function submitApplication(
  values: ApplicationFormValues,
): Promise<SubmitApplicationResult> {
  // Aucune valeur de repli : un champ manquant produit une erreur explicite.
  const firstName = text(values.firstName);
  const lastName = text(values.lastName);
  const email = text(values.email);
  const phone = text(values.phone);
  const departments = stringList(values.departments);
  const productCodes = stringList(values.productCodes);
  const experience = text(values.experience) as SalesExperience | null;

  const missing: string[] = [];
  if (firstName === null) missing.push("prénom");
  if (lastName === null) missing.push("nom");
  if (email === null) missing.push("email");
  if (phone === null) missing.push("téléphone");
  if (departments.length === 0) missing.push("département");
  if (productCodes.length === 0) missing.push("produit");
  if (experience === null) missing.push("expérience en vente terrain");

  if (missing.length > 0) {
    console.error(
      "[submitApplication] champs obligatoires manquants",
      missing,
      "clés reçues :",
      Object.keys(values),
    );
    return {
      ok: false,
      error: `Informations manquantes : ${missing.join(", ")}.`,
    };
  }

  if (values.consent !== true) {
    return { ok: false, error: "Votre consentement est obligatoire." };
  }

  const situation = text(values.situation) as CurrentSituation | null;
  const availability = text(values.availability) as Availability | null;

  const payload: ApplicationInsert = {
    first_name: firstName!,
    last_name: lastName!,
    email: email!,
    phone: phone!,
    departments,
    product_codes: productCodes,
    experience: experience!,
    situation,
    availability,
    link: text(values.link),
    message: text(values.message),
    consent_given: true,
    consent_at: new Date().toISOString(),
    consent_version: CONSENT_VERSION,
  };

  const { error } = await supabase.from("applications").insert(payload);

  if (error) {
    return {
      ok: false,
      error: frenchError(error.code, error.message, error.details ?? null, error.hint ?? null),
    };
  }

  return { ok: true };
}
