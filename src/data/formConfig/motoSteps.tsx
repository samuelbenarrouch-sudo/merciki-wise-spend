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

export const motoDefaultValues = {
  ...prospectDefaultValues,
  vehicleCategory: "",
  vehicleBrand: "",
  vehicleModel: "",
  vehicleYear: "",
  engineSize: "",
  vehicleUse: "",
  annualMileage: "",
  parkingType: "",
  antitheft: "",
  licenseType: "",
  licenseYear: "",
  ...antecedentsDefaultValues,
  desiredCoverage: "",
  riderEquipment: "",
  ...currentContractDefaultValues,
  ...consentDefaultValues,
};

export const motoSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "vehicule",
    label: "Le véhicule",
    title: "Le véhicule à assurer.",
    fields: [
      "vehicleCategory",
      "vehicleBrand",
      "vehicleModel",
      "vehicleYear",
      "engineSize",
      "vehicleUse",
      "annualMileage",
      "parkingType",
      "antitheft",
    ],
    schema: z.object({
      vehicleCategory: z.string().min(1, requiredMsg),
      vehicleBrand: z.string().trim().min(1, requiredMsg).max(60),
      vehicleModel: z.string().trim().min(1, requiredMsg).max(60),
      vehicleYear: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(1950, "Minimum 1950")
        .max(2027, "Maximum 2027"),
      engineSize: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(0, "Minimum 0")
        .max(3000, "Maximum 3 000"),
      vehicleUse: z.string().min(1, requiredMsg),
      annualMileage: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(0, "Minimum 0")
        .max(200000, "Maximum 200 000"),
      parkingType: z.string().min(1, requiredMsg),
      antitheft: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) => (
      <>
        <FormSelectField
          control={control}
          name="vehicleCategory"
          label="Type de véhicule"
          required
          options={[
            { value: "cyclomoteur-50", label: "Cyclomoteur 50 cm³" },
            { value: "scooter-50-125", label: "Scooter 50 à 125 cm³" },
            { value: "moto-125", label: "Moto 125 cm³" },
            { value: "moto-plus-125", label: "Moto plus de 125 cm³" },
            { value: "quad", label: "Quad" },
            { value: "autre", label: "Autre" },
          ]}
        />
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
        <FormNumberField
          control={control}
          name="engineSize"
          label="Cylindrée en cm³"
          required
          min={0}
          max={3000}
        />
        <FormSelectField
          control={control}
          name="vehicleUse"
          label="Usage"
          required
          options={[
            { value: "loisir", label: "Loisir" },
            { value: "trajets-quotidiens", label: "Trajets quotidiens" },
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
        <FormSelectField
          control={control}
          name="antitheft"
          label="Dispositif antivol"
          required
          options={[
            { value: "sra", label: "Antivol agréé SRA" },
            { value: "simple", label: "Antivol simple" },
            { value: "aucun", label: "Aucun" },
          ]}
        />
      </>
    ),
  },
  {
    id: "conducteur",
    label: "Le conducteur",
    title: "Le conducteur principal.",
    fields: ["licenseType", "licenseYear", ...antecedentsFields],
    schema: z.object({
      licenseType: z.string().min(1, requiredMsg),
      licenseYear: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int("Nombre entier attendu")
        .min(1950, "Minimum 1950")
        .max(2027, "Maximum 2027"),
      ...antecedentsShape,
    }),
    render: ({ control }) => (
      <>
        <FormSelectField
          control={control}
          name="licenseType"
          label="Permis détenu"
          required
          options={[
            { value: "a1", label: "A1" },
            { value: "a2", label: "A2" },
            { value: "a", label: "A" },
            { value: "b-formation-125", label: "Permis B avec formation 125" },
            { value: "sans-permis", label: "Sans permis (cyclomoteur)" },
          ]}
        />
        <FormNumberField
          control={control}
          name="licenseYear"
          label="Année d'obtention"
          required
          min={1950}
          max={2027}
        />
        {renderAntecedents(control)}
      </>
    ),
  },
  {
    id: "couverture",
    label: "La couverture",
    title: "La couverture souhaitée.",
    fields: ["desiredCoverage", "riderEquipment", ...currentContractFields],
    schema: z.object({
      desiredCoverage: z.string().min(1, requiredMsg),
      riderEquipment: z.string().min(1, requiredMsg),
      ...currentContractShape,
    }),
    render: ({ control }) => (
      <>
        <FormSelectField
          control={control}
          name="desiredCoverage"
          label="Formule souhaitée"
          required
          options={[
            { value: "tiers", label: "Au tiers" },
            { value: "vol-incendie", label: "Vol et incendie" },
            { value: "tous-risques", label: "Tous risques" },
            { value: "a-conseiller", label: "À conseiller" },
          ]}
        />
        <FormRadioGroup
          control={control}
          name="riderEquipment"
          label="Garantie équipement du pilote souhaitée ?"
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
