import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormNumberField,
  FormRadioGroup,
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

export const santeAnimaleDefaultValues = {
  ...prospectDefaultValues,
  animalType: "",
  animalName: "",
  animalAge: "",
  animalBreed: "",
  animalWeight: "",
  animalDob: "",
  alreadyInsured: "",
  currentInsurer: "",
  currentPremium: "",
  coverageLevel: "",
  ...consentDefaultValues,
};

const requiredMsg = "Ce champ est requis";

export const santeAnimaleSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "animal-type",
    label: "Type d'animal",
    title: "Quel animal souhaitez-vous assurer ?",
    fields: ["animalType"],
    schema: z.object({
      animalType: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) =>
      createElement(FormSelectField, {
        control,
        name: "animalType",
        label: "Type d'animal",
        required: true,
        options: [
          { value: "chien", label: "Chien" },
          { value: "chat", label: "Chat" },
          { value: "lapin", label: "Lapin" },
          { value: "nac", label: "NAC (Rongeur/Oiseau/Reptile)" },
          { value: "autre", label: "Autre" },
        ],
      }),
  },
  {
    id: "animal-info",
    label: "Informations",
    title: "Parlez-nous de votre compagnon.",
    fields: ["animalName", "animalAge", "animalBreed", "animalWeight", "animalDob"],
    schema: z.object({
      animalName: z.string().trim().max(60).optional().or(z.literal("")),
      animalAge: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .min(0, "Minimum 0")
        .max(25, "Maximum 25"),
      animalBreed: z.string().trim().max(80).optional().or(z.literal("")),
      animalWeight: z
        .union([z.literal(""), z.coerce.number().min(0).max(100)])
        .optional(),
      animalDob: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormTextField, {
          key: "animalName",
          control,
          name: "animalName",
          label: "Nom de l'animal",
        }),
        createElement(FormNumberField, {
          key: "animalAge",
          control,
          name: "animalAge",
          label: "Âge de l'animal (années)",
          required: true,
          min: 0,
          max: 25,
        }),
        createElement(FormTextField, {
          key: "animalBreed",
          control,
          name: "animalBreed",
          label: "Race",
        }),
        createElement(FormNumberField, {
          key: "animalWeight",
          control,
          name: "animalWeight",
          label: "Poids (kg)",
          min: 0,
          max: 100,
        }),
        createElement(FormTextField, {
          key: "animalDob",
          control,
          name: "animalDob",
          label: "Date de naissance approximative",
          required: true,
          type: "date",
        }),
      ),
  },
  {
    id: "situation",
    label: "Situation",
    title: "Avez-vous une couverture actuelle ?",
    fields: [
      "alreadyInsured",
      "currentInsurer",
      "currentPremium",
      "coverageLevel",
    ],
    schema: z.object({
      alreadyInsured: z.string().min(1, requiredMsg),
      currentInsurer: z.string().trim().max(80).optional().or(z.literal("")),
      currentPremium: z
        .union([z.literal(""), z.coerce.number().min(0)])
        .optional(),
      coverageLevel: z.string().min(1, requiredMsg),
    }),
    render: ({ control, watch }) => {
      const insured = watch("alreadyInsured") === "oui";
      return createElement(
        Fragment,
        null,
        createElement(FormRadioGroup, {
          key: "alreadyInsured",
          control,
          name: "alreadyInsured",
          label: "Déjà assuré ?",
          required: true,
          options: [
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ],
        }),
        insured &&
          createElement(FormTextField, {
            key: "currentInsurer",
            control,
            name: "currentInsurer",
            label: "Assureur actuel",
          }),
        insured &&
          createElement(FormNumberField, {
            key: "currentPremium",
            control,
            name: "currentPremium",
            label: "Cotisation actuelle mensuelle",
            suffix: "€",
            min: 0,
          }),
        createElement(FormRadioGroup, {
          key: "coverageLevel",
          control,
          name: "coverageLevel",
          label: "Niveau de couverture souhaité",
          required: true,
          options: [
            { value: "basique", label: "Basique (accidents/maladies graves)" },
            { value: "confort", label: "Confort (couverture large)" },
            { value: "premium", label: "Premium (tout inclus)" },
          ],
        }),
      );
    },
  },
  consentStep,
];