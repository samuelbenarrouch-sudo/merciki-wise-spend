import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormCheckbox,
  FormNumberField,
  FormRadioGroup,
  FormSelectField,
  FormTextField,
} from "@/components/forms/FormFields";
import { createElement, Fragment } from "react";
import { RGPD_LABEL, FR_PHONE_REGEX, PHONE_ERROR } from "./rgpdLabel";

export const emprunteurDefaultValues = {
  projectType: "",
  loanAmount: "",
  remainingCapital: "",
  remainingMonths: "",
  bank: "",
  currentInsurer: "",
  currentPremium: "",
  dob: "",
  smoker: "",
  profession: "",
  riskySport: "",
  riskySportDetail: "",
  commercialName: "",
  commercialPhone: "",
  rgpd: false,
};

const requiredMsg = "Ce champ est requis";

export const emprunteurSteps: StepConfig[] = [
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
        createElement(FormNumberField, {
          key: "loanAmount",
          control,
          name: "loanAmount",
          label: "Montant du prêt",
          required: true,
          suffix: "€",
          min: 0,
        }),
        createElement(FormNumberField, {
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
        createElement(FormNumberField, {
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
    fields: ["dob", "smoker", "profession", "riskySport", "riskySportDetail"],
    schema: z.object({
      dob: z.string().min(1, requiredMsg),
      smoker: z.string().min(1, requiredMsg),
      profession: z.string().trim().min(1, requiredMsg).max(100),
      riskySport: z.string().min(1, requiredMsg),
      riskySportDetail: z.string().trim().max(120).optional().or(z.literal("")),
    }),
    render: ({ control, watch }) => {
      const hasRisky = watch("riskySport") === "oui";
      return createElement(
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
        createElement(FormRadioGroup, {
          key: "smoker",
          control,
          name: "smoker",
          label: "Êtes-vous fumeur ?",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
            { value: "ancien", label: "Ancien fumeur" },
          ],
        }),
        createElement(FormTextField, {
          key: "profession",
          control,
          name: "profession",
          label: "Profession",
          required: true,
          placeholder: "ex: Infirmière, Mécanicien, CDI, etc.",
        }),
        createElement(FormRadioGroup, {
          key: "riskySport",
          control,
          name: "riskySport",
          label: "Pratiquez-vous un sport à risque ?",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        }),
        hasRisky &&
          createElement(FormTextField, {
            key: "riskySportDetail",
            control,
            name: "riskySportDetail",
            label: "Si oui, lequel ?",
            placeholder: "ex: Parapente, Alpinisme, etc.",
          }),
      );
    },
  },
  {
    id: "commercial",
    label: "Coordonnées",
    title: "Vos informations.",
    fields: ["commercialName", "commercialPhone", "rgpd"],
    schema: z.object({
      commercialName: z.string().trim().min(2, requiredMsg).max(100),
      commercialPhone: z.string().trim().regex(FR_PHONE_REGEX, PHONE_ERROR),
      rgpd: z.literal(true, {
        errorMap: () => ({ message: "Votre consentement est requis." }),
      }),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormTextField, {
          key: "commercialName",
          control,
          name: "commercialName",
          label: "Prénom & Nom",
          required: true,
        }),
        createElement(FormTextField, {
          key: "commercialPhone",
          control,
          name: "commercialPhone",
          label: "Téléphone",
          required: true,
          type: "tel",
          inputMode: "tel",
          placeholder: "06 12 34 56 78",
        }),
        createElement(FormCheckbox, {
          key: "rgpd",
          control,
          name: "rgpd",
          label: RGPD_LABEL,
        }),
      ),
  },
];