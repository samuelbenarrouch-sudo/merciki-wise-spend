import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormChipsField,
  FormNumberField,
  FormSelectField,
  FormTextField,
} from "@/components/forms/FormFields";
import { createElement, Fragment } from "react";
import {
  consentDefaultValues,
  consentStep,
  prospectDefaultValues,
  prospectStep,
  prospectContactStep,
} from "./sharedSteps";

export const energyDefaultValues = {
  ...prospectDefaultValues,
  energyType: [] as string[],
  housingType: "",
  occupants: "",
  heatingMode: "",
  surface: "",
  annualKwh: "",
  monthlyAmount: "",
  currentProvider: "",
  pdl: "",
  pce: "",
  contractEnd: "",
  ...consentDefaultValues,
};

const requiredMsg = "Ce champ est requis";

export const energySteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "energy-type",
    label: "Type d'énergie",
    title: "Quel type d'énergie vous concerne ?",
    fields: ["energyType", "housingType", "occupants"],
    schema: z.object({
      energyType: z
        .array(z.string())
        .min(1, "Sélectionnez au moins une option."),
      housingType: z.string().min(1, requiredMsg),
      occupants: z.coerce.number({ invalid_type_error: requiredMsg })
        .int()
        .min(1, "Minimum 1")
        .max(20, "Maximum 20"),
    }),
    render: ({ control }) =>
      createElement(Fragment, null,
        createElement(FormChipsField, {
          key: "energyType",
          control,
          name: "energyType",
          label: "Type d'énergie",
          required: true,
          options: [
            { value: "electricite", label: "Électricité" },
            { value: "gaz", label: "Gaz" },
            { value: "les-deux", label: "Les deux" },
          ],
        }),
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
          key: "occupants",
          control,
          name: "occupants",
          label: "Nombre d'occupants",
          required: true,
          min: 1,
          max: 20,
        }),
      ),
  },
  {
    id: "consumption",
    label: "Consommation",
    title: "Parlons de votre consommation.",
    fields: ["heatingMode", "surface", "annualKwh", "monthlyAmount"],
    schema: z.object({
      heatingMode: z.string().min(1, requiredMsg),
      surface: z.coerce.number({ invalid_type_error: requiredMsg })
        .min(10, "Minimum 10 m²")
        .max(500, "Maximum 500 m²"),
      annualKwh: z.union([z.literal(""), z.coerce.number().min(0)]).optional(),
      monthlyAmount: z.coerce.number({ invalid_type_error: requiredMsg })
        .min(0, "Doit être positif"),
    }),
    render: ({ control }) =>
      createElement(Fragment, null,
        createElement(FormSelectField, {
          key: "heatingMode",
          control,
          name: "heatingMode",
          label: "Mode de chauffage",
          required: true,
          options: [
            { value: "electrique", label: "Électrique" },
            { value: "gaz-naturel", label: "Gaz naturel" },
            { value: "chauffage-urbain", label: "Chauffage urbain" },
            { value: "pac", label: "Pompe à chaleur" },
            { value: "autre", label: "Autre" },
          ],
        }),
        createElement(FormNumberField, {
          key: "surface",
          control,
          name: "surface",
          label: "Surface du logement (m²)",
          required: true,
          min: 10,
          max: 500,
        }),
        createElement(FormNumberField, {
          key: "annualKwh",
          control,
          name: "annualKwh",
          label: "Consommation annuelle (kWh)",
          placeholder: "ex: 15000",
        }),
        createElement(FormNumberField, {
          key: "monthlyAmount",
          control,
          name: "monthlyAmount",
          label: "Montant mensuel actuel",
          required: true,
          min: 0,
          suffix: "€",
        }),
      ),
  },
  {
    id: "contract",
    label: "Contrat actuel",
    title: "Informations sur votre contrat.",
    fields: ["currentProvider", "pdl", "pce", "contractEnd"],
    schema: z.object({
      currentProvider: z.string().trim().min(1, requiredMsg).max(80),
      pdl: z.string().trim().max(20).optional().or(z.literal("")),
      pce: z.string().trim().max(20).optional().or(z.literal("")),
      contractEnd: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) =>
      createElement(Fragment, null,
        createElement(FormTextField, {
          key: "currentProvider",
          control,
          name: "currentProvider",
          label: "Fournisseur actuel",
          required: true,
          placeholder: "ex: EDF, Engie, etc.",
        }),
        createElement(FormTextField, {
          key: "pdl",
          control,
          name: "pdl",
          label: "Numéro PDL (électricité)",
          description: "14 chiffres, optionnel",
        }),
        createElement(FormTextField, {
          key: "pce",
          control,
          name: "pce",
          label: "Numéro PCE (gaz)",
          description: "14 chiffres, optionnel",
        }),
        createElement(FormSelectField, {
          key: "contractEnd",
          control,
          name: "contractEnd",
          label: "Échéance du contrat",
          required: true,
          options: [
            { value: "less-1m", label: "Moins d'1 mois" },
            { value: "1-3m", label: "1-3 mois" },
            { value: "3-6m", label: "3-6 mois" },
            { value: "6-12m", label: "6-12 mois" },
            { value: "more-1y", label: "Plus d'1 an" },
            { value: "no-date", label: "Pas de date fixe" },
          ],
        }),
      ),
  },
  consentStep,
];