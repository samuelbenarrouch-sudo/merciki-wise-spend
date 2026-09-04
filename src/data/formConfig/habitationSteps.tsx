import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormChipsField,
  FormDecimalField,
  FormNumberField,
  FormRadioGroup,
  FormSelectField,
  FormTextarea,
} from "@/components/forms/FormFields";
import {
  consentDefaultValues,
  consentStep,
  prospectDefaultValues,
  prospectStep,
  prospectContactStep,
} from "./sharedSteps";
import {
  currentContractDefaultValues,
  currentContractFields,
  currentContractShape,
  renderCurrentContract,
} from "./assuranceBlocks";

const requiredMsg = "Ce champ est requis";

export const habitationDefaultValues = {
  ...prospectDefaultValues,
  housingType: "",
  occupancyStatus: "",
  residenceType: "",
  housingSurface: "",
  rooms: "",
  constructionPeriod: "",
  dependencies: [] as string[],
  securityDevices: [] as string[],
  occupantsCount: "",
  valuablesValue: "",
  valuablesDetail: "",
  claimsLast3Years: "",
  terminatedByInsurer: "",
  ...currentContractDefaultValues,
  ...consentDefaultValues,
};

export const habitationSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "logement",
    label: "Le logement",
    title: "Le logement à assurer.",
    fields: [
      "housingType",
      "occupancyStatus",
      "residenceType",
      "housingSurface",
      "rooms",
      "constructionPeriod",
    ],
    schema: z.object({
      housingType: z.string().min(1, requiredMsg),
      occupancyStatus: z.string().min(1, requiredMsg),
      residenceType: z.string().min(1, requiredMsg),
      housingSurface: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .min(1, "Minimum 1")
        .max(2000, "Maximum 2 000"),
      rooms: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(1, "Minimum 1")
        .max(20, "Maximum 20"),
      constructionPeriod: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) => (
      <>
        <FormSelectField
          control={control}
          name="housingType"
          label="Type de logement"
          required
          options={[
            { value: "maison", label: "Maison" },
            { value: "appartement", label: "Appartement" },
            { value: "autre", label: "Autre" },
          ]}
        />
        <FormSelectField
          control={control}
          name="occupancyStatus"
          label="Vous êtes"
          required
          options={[
            { value: "proprietaire-occupant", label: "Propriétaire occupant" },
            { value: "proprietaire-bailleur", label: "Propriétaire bailleur" },
            { value: "locataire", label: "Locataire" },
            { value: "colocataire", label: "Colocataire" },
          ]}
        />
        <FormSelectField
          control={control}
          name="residenceType"
          label="Type de résidence"
          required
          options={[
            { value: "principale", label: "Résidence principale" },
            { value: "secondaire", label: "Résidence secondaire" },
          ]}
        />
        <FormDecimalField
          control={control}
          name="housingSurface"
          label="Surface"
          required
          min={1}
          max={2000}
          suffix="m²"
        />
        <FormNumberField
          control={control}
          name="rooms"
          label="Nombre de pièces principales"
          required
          min={1}
          max={20}
        />
        <FormSelectField
          control={control}
          name="constructionPeriod"
          label="Période de construction"
          required
          options={[
            { value: "avant-1950", label: "Avant 1950" },
            { value: "1950-1980", label: "1950 à 1980" },
            { value: "1981-2000", label: "1981 à 2000" },
            { value: "apres-2000", label: "Après 2000" },
          ]}
        />
      </>
    ),
  },
  {
    id: "equipements",
    label: "Équipements",
    title: "Équipements et dépendances.",
    fields: [
      "dependencies",
      "securityDevices",
      "occupantsCount",
      "valuablesValue",
      "valuablesDetail",
    ],
    schema: z.object({
      dependencies: z.array(z.string()).optional(),
      securityDevices: z.array(z.string()).optional(),
      occupantsCount: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(1, "Minimum 1")
        .max(15, "Maximum 15"),
      valuablesValue: z
        .union([z.literal(""), z.coerce.number().min(0)])
        .optional(),
      valuablesDetail: z.string().trim().max(500).optional().or(z.literal("")),
    }),
    render: ({ control }) => (
      <>
        <FormChipsField
          control={control}
          name="dependencies"
          label="Dépendances"
          options={[
            { value: "garage", label: "Garage" },
            { value: "cave", label: "Cave" },
            { value: "jardin", label: "Jardin" },
            { value: "piscine", label: "Piscine" },
            { value: "veranda", label: "Véranda" },
            { value: "dependance-isolee", label: "Dépendance isolée" },
          ]}
        />
        <FormChipsField
          control={control}
          name="securityDevices"
          label="Sécurité"
          options={[
            { value: "alarme", label: "Alarme" },
            { value: "porte-blindee", label: "Porte blindée" },
            { value: "volets", label: "Volets" },
            { value: "gardiennage", label: "Gardiennage" },
            { value: "aucun", label: "Aucun" },
          ]}
        />
        <FormNumberField
          control={control}
          name="occupantsCount"
          label="Nombre d'occupants"
          required
          min={1}
          max={15}
        />
        <FormDecimalField
          control={control}
          name="valuablesValue"
          label="Valeur des biens à assurer"
          min={0}
          suffix="€"
        />
        <FormTextarea
          control={control}
          name="valuablesDetail"
          label="Objets de valeur à déclarer"
        />
      </>
    ),
  },
  {
    id: "couverture",
    label: "La couverture",
    title: "La couverture souhaitée.",
    fields: [
      "claimsLast3Years",
      "terminatedByInsurer",
      ...currentContractFields,
    ],
    schema: z.object({
      claimsLast3Years: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(0, "Minimum 0")
        .max(10, "Maximum 10"),
      terminatedByInsurer: z.string().min(1, requiredMsg),
      ...currentContractShape,
    }),
    render: ({ control }) => (
      <>
        <FormNumberField
          control={control}
          name="claimsLast3Years"
          label="Sinistres déclarés sur 3 ans"
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
        {renderCurrentContract(control)}
      </>
    ),
  },
  consentStep,
];
