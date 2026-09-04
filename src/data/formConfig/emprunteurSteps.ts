import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormDecimalField,
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

export const emprunteurDefaultValues = {
  ...prospectDefaultValues,
  projectType: "",
  loanAmount: "",
  remainingCapital: "",
  remainingMonths: "",
  bank: "",
  currentInsurer: "",
  currentPremium: "",
  dob: "",
  profession: "",
  ...consentDefaultValues,
};

const requiredMsg = "Ce champ est requis";

export const emprunteurSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "project",
    label: "Projet",
    title: "Décrivez votre projet.",
    fields: ["projectType", "loanAmount", "remainingCapital", "remainingMonths"],
    schema: z.object({
      projectType: z.string().min(1, requiredMsg),
      loanAmount: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .min(0, "Doit être positif"),
      remainingCapital: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .min(0, "Doit être positif"),
      remainingMonths: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int()
        .min(1, "Minimum 1")
        .max(480, "Maximum 480"),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormSelectField, {
          key: "projectType",
          control,
          name: "projectType",
          label: "Type de projet",
          required: true,
          options: [
            { value: "achat", label: "Achat immobilier" },
            { value: "rachat", label: "Rachat de crédit" },
            { value: "personnel", label: "Prêt personnel" },
            { value: "autre", label: "Autre" },
          ],
        }),
        createElement(FormDecimalField, {
          key: "loanAmount",
          control,
          name: "loanAmount",
          label: "Montant du prêt",
          required: true,
          suffix: "€",
          min: 0,
        }),
        createElement(FormDecimalField, {
          key: "remainingCapital",
          control,
          name: "remainingCapital",
          label: "Capital restant dû",
          required: true,
          suffix: "€",
          min: 0,
        }),
        createElement(FormNumberField, {
          key: "remainingMonths",
          control,
          name: "remainingMonths",
          label: "Durée restante (mois)",
          required: true,
          min: 1,
          max: 480,
        }),
      ),
  },
  {
    id: "bank",
    label: "Situation actuelle",
    title: "Situation actuelle.",
    fields: ["bank", "currentInsurer", "currentPremium"],
    schema: z.object({
      bank: z.string().trim().min(1, requiredMsg).max(80),
      currentInsurer: z.string().trim().min(1, requiredMsg).max(80),
      currentPremium: z
        .union([z.literal(""), z.coerce.number().min(0)])
        .optional(),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormTextField, {
          key: "bank",
          control,
          name: "bank",
          label: "Banque prêteuse",
          required: true,
          placeholder: "ex: BNP Paribas, Crédit Mutuel, etc.",
        }),
        createElement(FormTextField, {
          key: "currentInsurer",
          control,
          name: "currentInsurer",
          label: "Assureur actuel",
          required: true,
          placeholder: "ex: Axa, Allianz, Cardif, etc.",
        }),
        createElement(FormDecimalField, {
          key: "currentPremium",
          control,
          name: "currentPremium",
          label: "Cotisation actuelle mensuelle",
          suffix: "€",
          min: 0,
        }),
      ),
  },
  {
    id: "risk",
    label: "Profil de risque",
    title: "Quelques questions importantes.",
    fields: ["dob", "profession"],
    schema: z.object({
      dob: z.string().min(1, requiredMsg),
      profession: z.string().trim().min(1, requiredMsg).max(100),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormTextField, {
          key: "dob",
          control,
          name: "dob",
          label: "Date de naissance",
          required: true,
          type: "date",
        }),
        createElement(FormTextField, {
          key: "profession",
          control,
          name: "profession",
          label: "Profession",
          required: true,
          placeholder: "ex: Infirmière, Mécanicien, CDI, etc.",
        }),
      ),
  },
  consentStep,
];