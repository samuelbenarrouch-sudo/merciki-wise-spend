import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormNumberField,
  FormRadioGroup,
  FormSelectField,
  FormTextField,
} from "@/components/forms/FormFields";
import {
  consentDefaultValues,
  consentStep,
  prospectDefaultValues,
  prospectStep,
  prospectContactStep,
} from "./sharedSteps";
import {
  antecedentsDefaultValues,
  antecedentsFields,
  antecedentsShape,
  currentContractDefaultValues,
  currentContractFields,
  currentContractShape,
  renderAntecedents,
  renderCurrentContract,
} from "./assuranceBlocks";

const requiredMsg = "Ce champ est requis";

export const autoDefaultValues = {
  ...prospectDefaultValues,
  vehicleBrand: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleEnergy: "",
  vehicleUse: "",
  annualMileage: "",
  parkingType: "",
  licenseYear: "",
  secondaryDriver: "",
  ...antecedentsDefaultValues,
  currentCoverage: "",
  desiredCoverage: "",
  ...currentContractDefaultValues,
  ...consentDefaultValues,
};

export const autoSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "vehicule",
    label: "Le véhicule",
    title: "Le véhicule à assurer.",
    fields: [
      "vehicleBrand",
      "vehicleModel",
      "vehicleYear",
      "vehicleEnergy",
      "vehicleUse",
      "annualMileage",
      "parkingType",
    ],
    schema: z.object({
      vehicleBrand: z.string().trim().min(1, requiredMsg).max(60),
      vehicleModel: z.string().trim().min(1, requiredMsg).max(60),
      vehicleYear: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(1950, "Minimum 1950")
        .max(2027, "Maximum 2027"),
      vehicleEnergy: z.string().min(1, requiredMsg),
      vehicleUse: z.string().min(1, requiredMsg),
      annualMileage: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(0, "Minimum 0")
        .max(200000, "Maximum 200 000"),
      parkingType: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) => (
      <>
        <FormTextField
          control={control}
          name="vehicleBrand"
          label="Marque"
          required
        />
        <FormTextField
          control={control}
          name="vehicleModel"
          label="Modèle"
          required
        />
        <FormNumberField
          control={control}
          name="vehicleYear"
          label="Année de mise en circulation"
          required
          min={1950}
          max={2027}
        />
        <FormSelectField
          control={control}
          name="vehicleEnergy"
          label="Énergie"
          required
          options={[
            { value: "essence", label: "Essence" },
            { value: "diesel", label: "Diesel" },
            { value: "hybride", label: "Hybride" },
            { value: "electrique", label: "Électrique" },
            { value: "gpl", label: "GPL" },
          ]}
        />
        <FormSelectField
          control={control}
          name="vehicleUse"
          label="Usage"
          required
          options={[
            { value: "prive", label: "Privé" },
            {
              value: "prive-travail",
              label: "Privé et trajets domicile-travail",
            },
            { value: "professionnel", label: "Professionnel" },
          ]}
        />
        <FormNumberField
          control={control}
          name="annualMileage"
          label="Kilométrage annuel estimé"
          required
          min={0}
          max={200000}
        />
        <FormSelectField
          control={control}
          name="parkingType"
          label="Stationnement de nuit"
          required
          options={[
            { value: "garage-ferme", label: "Garage fermé" },
            { value: "parking-collectif", label: "Parking collectif" },
            { value: "voie-publique", label: "Voie publique" },
          ]}
        />
      </>
    ),
  },
  {
    id: "conducteur",
    label: "Le conducteur",
    title: "Le conducteur principal.",
    fields: ["licenseYear", "secondaryDriver", ...antecedentsFields],
    schema: z.object({
      licenseYear: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(1950, "Minimum 1950")
        .max(2027, "Maximum 2027"),
      secondaryDriver: z.string().min(1, requiredMsg),
      ...antecedentsShape,
    }),
    render: ({ control }) => (
      <>
        <FormNumberField
          control={control}
          name="licenseYear"
          label="Année d'obtention du permis"
          required
          min={1950}
          max={2027}
        />
        <FormRadioGroup
          control={control}
          name="secondaryDriver"
          label="Conducteur secondaire à déclarer ?"
          required
          options={[
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ]}
        />
        {renderAntecedents(control)}
      </>
    ),
  },
  {
    id: "couverture",
    label: "La couverture",
    title: "La couverture souhaitée.",
    fields: ["currentCoverage", "desiredCoverage", ...currentContractFields],
    schema: z.object({
      currentCoverage: z.string().optional().or(z.literal("")),
      desiredCoverage: z.string().min(1, requiredMsg),
      ...currentContractShape,
    }),
    render: ({ control }) => (
      <>
        <FormSelectField
          control={control}
          name="currentCoverage"
          label="Formule actuelle"
          options={[
            { value: "tiers", label: "Au tiers" },
            { value: "tiers-etendu", label: "Tiers étendu" },
            { value: "tous-risques", label: "Tous risques" },
            { value: "aucune", label: "Aucune" },
          ]}
        />
        <FormSelectField
          control={control}
          name="desiredCoverage"
          label="Formule souhaitée"
          required
          options={[
            { value: "tiers", label: "Au tiers" },
            { value: "tiers-etendu", label: "Tiers étendu" },
            { value: "tous-risques", label: "Tous risques" },
            { value: "a-conseiller", label: "À conseiller" },
          ]}
        />
        {renderCurrentContract(control)}
      </>
    ),
  },
  consentStep,
];
