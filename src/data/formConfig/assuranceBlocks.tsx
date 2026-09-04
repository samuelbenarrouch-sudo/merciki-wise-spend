import { z } from "zod";
import type { Control } from "react-hook-form";
import {
  FormDecimalField,
  FormNumberField,
  FormRadioGroup,
  FormSelectField,
  FormTextField,
} from "@/components/forms/FormFields";

/**
 * Blocs de questions partagés par les parcours Assurance Auto, Moto et
 * Habitation. Écrits UNE SEULE FOIS puis réutilisés : toute évolution
 * s'applique à l'ensemble des parcours concernés.
 *
 * Périmètre RGPD : aucune question relative au permis (suspension,
 * annulation, alcoolémie) — données de l'article 10 hors périmètre d'un
 * apporteur d'affaires.
 */

const requiredMsg = "Ce champ est requis";

/* ------------------------------------------------------------------ */
/* Bloc « antécédents » — Auto et Moto                                  */
/* ------------------------------------------------------------------ */

export const antecedentsDefaultValues = {
  bonusMalus: "",
  claimsLast3Years: "",
  terminatedByInsurer: "",
};

export const antecedentsFields = [
  "bonusMalus",
  "claimsLast3Years",
  "terminatedByInsurer",
];

export const antecedentsShape = {
  bonusMalus: z.coerce
    .number({ invalid_type_error: requiredMsg })
    .min(0.5, "Minimum 0,50")
    .max(3.5, "Maximum 3,50"),
  claimsLast3Years: z.coerce
    .number({ invalid_type_error: requiredMsg })
    .int("Nombre entier attendu")
    .min(0, "Minimum 0")
    .max(10, "Maximum 10"),
  terminatedByInsurer: z.string().min(1, requiredMsg),
};

export function renderAntecedents(control: Control<any>) {
  return (
    <>
      <FormDecimalField
        control={control}
        name="bonusMalus"
        label="Coefficient bonus-malus"
        required
        min={0.5}
        max={3.5}
        placeholder="0,85"
      />
      <FormNumberField
        control={control}
        name="claimsLast3Years"
        label="Sinistres responsables sur 3 ans"
        required
        min={0}
        max={10}
      />
      <FormRadioGroup
        control={control}
        name="terminatedByInsurer"
        label="Avez-vous déjà été résilié par un assureur ?"
        required
        options={[
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non" },
        ]}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Bloc « contrat actuel » — Auto, Moto et Habitation                   */
/* ------------------------------------------------------------------ */

export const currentContractDefaultValues = {
  currentInsurer: "",
  currentPremium: "",
  contractEnd: "",
  effectiveDate: "",
};

export const currentContractFields = [
  "currentInsurer",
  "currentPremium",
  "contractEnd",
  "effectiveDate",
];

export const currentContractShape = {
  currentInsurer: z.string().trim().max(80).optional().or(z.literal("")),
  currentPremium: z
    .union([z.literal(""), z.coerce.number().min(0)])
    .optional(),
  contractEnd: z.string().min(1, requiredMsg),
  effectiveDate: z.string().min(1, requiredMsg),
};

const CONTRACT_END_OPTIONS = [
  { value: "moins-1-mois", label: "Moins d'un mois" },
  { value: "1-3-mois", label: "1 à 3 mois" },
  { value: "3-6-mois", label: "3 à 6 mois" },
  { value: "6-12-mois", label: "6 à 12 mois" },
  { value: "plus-1-an", label: "Plus d'un an" },
  { value: "pas-de-date", label: "Pas de date fixe" },
];

export function renderCurrentContract(control: Control<any>) {
  return (
    <>
      <FormTextField
        control={control}
        name="currentInsurer"
        label="Assureur actuel"
      />
      <FormDecimalField
        control={control}
        name="currentPremium"
        label="Cotisation mensuelle actuelle"
        min={0}
        suffix="€"
      />
      <FormSelectField
        control={control}
        name="contractEnd"
        label="Échéance du contrat"
        required
        options={CONTRACT_END_OPTIONS}
      />
      <FormTextField
        control={control}
        name="effectiveDate"
        label="Date d'effet souhaitée"
        required
        type="date"
      />
    </>
  );
}
