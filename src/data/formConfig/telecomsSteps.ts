import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormChipsField,
  FormNumberField,
  FormSelectField,
  FormTextField,
  FormRadioGroup,
} from "@/components/forms/FormFields";
import { createElement, Fragment } from "react";
import {
  consentDefaultValues,
  consentStep,
  prospectDefaultValues,
  prospectStep,
  prospectContactStep,
} from "./sharedSteps";

const requiredMsg = "Ce champ est requis";

export const telecomsDefaultValues = {
  ...prospectDefaultValues,
  needType: [] as string[],
  currentOperator: "",
  monthlyAmount: "",
  fiberEligibility: "",
  mobileLines: "",
  hasCommitment: "",
  commitmentEnd: "",
  ...consentDefaultValues,
};

export const telecomsSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "needs",
    label: "Besoins",
    title: "Quel est votre besoin ?",
    fields: ["needType"],
    schema: z.object({
      needType: z
        .array(z.string())
        .min(1, "Sélectionnez au moins une option."),
    }),
    render: ({ control }) =>
      createElement(FormChipsField, {
        control,
        name: "needType",
        label: "Type de besoin",
        required: true,
        options: [
          { value: "box", label: "Box internet" },
          { value: "mobile", label: "Mobile" },
          { value: "les-deux", label: "Les deux" },
        ],
      }),
  },
  {
    id: "situation",
    label: "Situation actuelle",
    title: "Parlez-nous de votre situation actuelle.",
    fields: [
      "currentOperator",
      "monthlyAmount",
      "fiberEligibility",
      "mobileLines",
    ],
    schema: z.object({
      currentOperator: z.string().trim().min(1, requiredMsg).max(80),
      monthlyAmount: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .min(0, "Doit être positif"),
      fiberEligibility: z.string().min(1, requiredMsg),
      mobileLines: z
        .union([z.literal(""), z.coerce.number().min(0).max(20)])
        .optional(),
    }),
    render: ({ control }) =>
      createElement(Fragment, null,
        createElement(FormTextField, {
          key: "currentOperator",
          control,
          name: "currentOperator",
          label: "Opérateur actuel",
          required: true,
          placeholder: "ex: Orange, SFR, Free, etc.",
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
        createElement(FormSelectField, {
          key: "fiberEligibility",
          control,
          name: "fiberEligibility",
          label: "Éligibilité fibre",
          required: true,
          options: [
            { value: "ftth", label: "Oui, fibre FTTH" },
            { value: "fttb", label: "Oui, fibre FTTB" },
            { value: "adsl", label: "Non, ADSL/DSL" },
            { value: "unknown", label: "Je ne sais pas" },
          ],
        }),
        createElement(FormNumberField, {
          key: "mobileLines",
          control,
          name: "mobileLines",
          label: "Nombre de lignes mobiles",
          min: 0,
          max: 20,
        }),
      ),
  },
  {
    id: "commitment",
    label: "Engagement",
    title: "Situation de votre contrat.",
    fields: ["hasCommitment", "commitmentEnd"],
    schema: z.object({
      hasCommitment: z.enum(["oui", "non"], { errorMap: () => ({ message: requiredMsg }) }),
      commitmentEnd: z.string().optional().or(z.literal("")),
    }),
    render: ({ control, watch }) => {
      const hasCommitment = watch("hasCommitment");
      return createElement(Fragment, null,
        createElement(FormRadioGroup, {
          key: "hasCommitment",
          control,
          name: "hasCommitment",
          label: "Avez-vous un engagement en cours ?",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        }),
        hasCommitment === "oui"
          ? createElement(FormTextField, {
              key: "commitmentEnd",
              control,
              name: "commitmentEnd",
              label: "Échéance de l'engagement",
              type: "date",
            })
          : null,
      );
    },
  },
  consentStep,
];