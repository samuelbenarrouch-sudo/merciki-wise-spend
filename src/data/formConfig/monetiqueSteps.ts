import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormChipsField,
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
} from "./sharedSteps";

export const monetiqueDefaultValues = {
  ...prospectDefaultValues,
  needTypes: [] as string[],
  activityType: "",
  monthlyVolume: "",
  monthlyTransactions: "",
  hasCurrentSolution: "",
  currentProvider: "",
  monthlyFees: "",
  improvements: "",
  ...consentDefaultValues,
};

const requiredMsg = "Ce champ est requis";

export const monetiqueSteps: StepConfig[] = [
  prospectStep,
  {
    id: "need",
    label: "Besoin",
    title: "Quel est votre besoin ?",
    fields: ["needTypes"],
    schema: z.object({
      needTypes: z
        .array(z.string())
        .min(1, "Sélectionnez au moins une option"),
    }),
    render: ({ control }) =>
      createElement(FormChipsField, {
        control,
        name: "needTypes",
        label: "Type de besoin",
        required: true,
        options: [
          { value: "tpe", label: "Terminal de paiement (TPE/lecteur carte)" },
          { value: "encaissement", label: "Solution d'encaissement" },
          { value: "compte-pro", label: "Compte bancaire professionnel" },
          { value: "wallet", label: "Portefeuille digital" },
          { value: "autre", label: "Autre" },
        ],
      }),
  },
  {
    id: "activity",
    label: "Activité",
    title: "Parlez-nous de votre activité.",
    fields: [
      "activityType",
      "monthlyVolume",
      "monthlyTransactions",
      "hasCurrentSolution",
    ],
    schema: z.object({
      activityType: z.string().min(1, requiredMsg),
      monthlyVolume: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .min(0, "Doit être positif"),
      monthlyTransactions: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int()
        .min(0, "Doit être positif"),
      hasCurrentSolution: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormSelectField, {
          key: "activityType",
          control,
          name: "activityType",
          label: "Type d'activité",
          required: true,
          options: [
            { value: "commerce", label: "Commerce (boutique physique)" },
            { value: "ecommerce", label: "E-commerce" },
            {
              value: "services",
              label: "Prestataire de services (coiffeur, plombier, etc.)",
            },
            { value: "restauration", label: "Restaurant/Café" },
            { value: "autre", label: "Autre" },
          ],
        }),
        createElement(FormNumberField, {
          key: "monthlyVolume",
          control,
          name: "monthlyVolume",
          label: "Volume de transactions mensuelles estimé",
          required: true,
          suffix: "€",
          min: 0,
        }),
        createElement(FormNumberField, {
          key: "monthlyTransactions",
          control,
          name: "monthlyTransactions",
          label: "Nombre de transactions mensuelles estimé",
          required: true,
          min: 0,
        }),
        createElement(FormRadioGroup, {
          key: "hasCurrentSolution",
          control,
          name: "hasCurrentSolution",
          label: "Avez-vous actuellement une solution de paiement ?",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        }),
      ),
  },
  {
    id: "current",
    label: "Situation actuelle",
    title: "Si vous avez une solution actuelle.",
    fields: ["currentProvider", "monthlyFees", "improvements"],
    schema: z.object({
      currentProvider: z.string().trim().max(120).optional().or(z.literal("")),
      monthlyFees: z.union([z.literal(""), z.coerce.number().min(0)]).optional(),
      improvements: z.string().trim().max(500).optional().or(z.literal("")),
    }),
    render: ({ control, watch }) => {
      const provider = String(watch("currentProvider") ?? "").trim();
      const hasProvider = provider.length > 0;
      return createElement(
        Fragment,
        null,
        createElement(FormTextField, {
          key: "currentProvider",
          control,
          name: "currentProvider",
          label: "Fournisseur actuel",
          placeholder: "ex: Stripe, SumUp, Square, etc.",
        }),
        hasProvider &&
          createElement(FormNumberField, {
            key: "monthlyFees",
            control,
            name: "monthlyFees",
            label: "Montant des frais mensuels",
            suffix: "€",
            min: 0,
          }),
        createElement(FormTextarea, {
          key: "improvements",
          control,
          name: "improvements",
          label: "Points d'amélioration souhaités",
          placeholder:
            "ex: Frais trop élevés, mauvaise interface, support nul, etc.",
        }),
      );
    },
  },
  consentStep,
];