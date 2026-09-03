import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormChipsField,
  FormAmountField,
  FormNumberField,
  FormRadioGroup,
  FormSelectField,
  FormTextField,
  FormTextarea,
} from "@/components/forms/FormFields";
import { createElement, Fragment } from "react";
import {
  consentDefaultValues,
  consentStep,
  prospectDefaultValues,
  prospectStep,
  prospectContactStep,
} from "./sharedSteps";

export const enrDefaultValues = {
  ...prospectDefaultValues,
  equipmentTypes: [] as string[],
  housingType: "",
  housingSurface: "",
  roofType: "",
  annualConsumption: "",
  mainGoal: "",
  budget: "",
  subsidies: "",
  preferredBrands: "",
  architecturalConstraints: "",
  ...consentDefaultValues,
};

const requiredMsg = "Ce champ est requis";

export const enrSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "equipment",
    label: "Équipement",
    title: "Quel type d'équipement vous intéresse ?",
    fields: ["equipmentTypes"],
    schema: z.object({
      equipmentTypes: z
        .array(z.string())
        .min(1, "Sélectionnez au moins une option"),
    }),
    render: ({ control }) =>
      createElement(FormChipsField, {
        control,
        name: "equipmentTypes",
        label: "Type d'équipement",
        required: true,
        options: [
          { value: "pv", label: "Panneaux solaires photovoltaïques" },
          { value: "chauffe-eau", label: "Chauffe-eau solaire" },
          { value: "pac", label: "Pompe à chaleur" },
          { value: "eolienne", label: "Éolienne domestique" },
          { value: "batterie", label: "Batterie de stockage" },
        ],
      }),
  },
  {
    id: "housing",
    label: "Logement",
    title: "Décrivez votre logement.",
    fields: ["housingType", "housingSurface", "roofType", "annualConsumption"],
    schema: z.object({
      housingType: z.string().min(1, requiredMsg),
      housingSurface: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .min(10, "Minimum 10 m²")
        .max(500, "Maximum 500 m²"),
      roofType: z.string().min(1, requiredMsg),
      annualConsumption: z
        .union([z.literal(""), z.coerce.number().min(0)])
        .optional(),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormSelectField, {
          key: "housingType",
          control,
          name: "housingType",
          label: "Type de logement",
          required: true,
          options: [
            { value: "maison", label: "Maison" },
            { value: "appartement", label: "Appartement" },
            { value: "autre", label: "Autre" },
          ],
        }),
        createElement(FormNumberField, {
          key: "housingSurface",
          control,
          name: "housingSurface",
          label: "Surface du logement",
          required: true,
          suffix: "m²",
          min: 10,
          max: 500,
        }),
        createElement(FormSelectField, {
          key: "roofType",
          control,
          name: "roofType",
          label: "Type de toiture / exposition",
          required: true,
          options: [
            { value: "pente-sud", label: "Toiture pente (sud)" },
            { value: "pente-autre", label: "Toiture pente (autre orientation)" },
            { value: "plate", label: "Toiture plate" },
            { value: "inconnu", label: "Je ne sais pas" },
          ],
        }),
        createElement(FormNumberField, {
          key: "annualConsumption",
          control,
          name: "annualConsumption",
          label: "Consommation annuelle actuelle",
          suffix: "kWh",
          placeholder: "ex: 15000",
          min: 0,
        }),
      ),
  },
  {
    id: "goals",
    label: "Objectifs",
    title: "Quels sont vos objectifs ?",
    fields: ["mainGoal", "budget", "subsidies"],
    schema: z.object({
      mainGoal: z.string().min(1, requiredMsg),
      budget: z.union([z.literal(""), z.coerce.number().min(0)]).optional(),
      subsidies: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormRadioGroup, {
          key: "mainGoal",
          control,
          name: "mainGoal",
          label: "Objectif principal",
          required: true,
          options: [
            { value: "economies", label: "Économiser sur ma facture" },
            { value: "revente", label: "Produire de l'énergie (revente)" },
            { value: "independance", label: "Indépendance énergétique" },
            { value: "environnement", label: "Impact environnemental" },
          ],
        }),
        createElement(FormAmountField, {
          key: "budget",
          control,
          name: "budget",
          label: "Budget estimé",
          suffix: "€",
          description: "Ordre d'idée, pas un engagement",
          min: 0,
        }),
        createElement(FormRadioGroup, {
          key: "subsidies",
          control,
          name: "subsidies",
          label: "Intéressé par les aides/subventions ?",
          required: true,
          options: [
            { value: "oui", label: "Oui, c'est important" },
            { value: "peu-importe", label: "Peu importe, je finance" },
            { value: "inconnu", label: "Je ne sais pas" },
          ],
        }),
      ),
  },
  {
    id: "preferences",
    label: "Préférences",
    title: "Marques et préférences.",
    fields: ["preferredBrands", "architecturalConstraints"],
    schema: z.object({
      preferredBrands: z.string().trim().max(160).optional().or(z.literal("")),
      architecturalConstraints: z
        .string()
        .trim()
        .max(500)
        .optional()
        .or(z.literal("")),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormTextField, {
          key: "preferredBrands",
          control,
          name: "preferredBrands",
          label: "Marques de matériel connues / préférées",
          placeholder: "ex: Tesla, Sunwatt, Enphase, etc.",
        }),
        createElement(FormTextarea, {
          key: "architecturalConstraints",
          control,
          name: "architecturalConstraints",
          label: "Avez-vous des contraintes architecturales ?",
          placeholder: "ex: Secteur sauvegardé, bâtiment ancien, etc.",
        }),
      ),
  },
  consentStep,
];