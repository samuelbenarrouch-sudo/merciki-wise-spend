import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormNumberField,
  FormRadioGroup,
  FormScaleField,
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

export const mutuelleSanteDefaultValues = {
  ...prospectDefaultValues,
  coverageType: "",
  mainDob: "",
  extraBeneficiaries: "",
  beneficiariesAges: "",
  regime: "",
  currentInsurer: "",
  currentPremium: "",
  needSoins: "",
  needHospi: "",
  needOptique: "",
  needDentaire: "",
  effectiveDate: "",
  ...consentDefaultValues,
};

const requiredMsg = "Ce champ est requis";
const scaleSchema = z.coerce
  .number({ invalid_type_error: requiredMsg })
  .int()
  .min(0)
  .max(4);

export const mutuelleSanteSteps: StepConfig[] = [
  prospectStep,
  {
    id: "coverage-type",
    label: "Type de couverture",
    title: "Quel type de mutuelle vous intéresse ?",
    fields: ["coverageType"],
    schema: z.object({
      coverageType: z.string().min(1, requiredMsg),
    }),
    render: ({ control }) =>
      createElement(FormRadioGroup, {
        control,
        name: "coverageType",
        label: "Type de mutuelle",
        required: true,
        options: [
          { value: "individuelle", label: "Individuelle" },
          { value: "couple", label: "Couple" },
          { value: "famille", label: "Famille" },
        ],
      }),
  },
  {
    id: "family",
    label: "Composition",
    title: "Qui souhaitez-vous couvrir ?",
    fields: ["mainDob", "extraBeneficiaries", "beneficiariesAges"],
    schema: z.object({
      mainDob: z.string().min(1, requiredMsg),
      extraBeneficiaries: z.coerce
        .number({ invalid_type_error: requiredMsg })
        .int()
        .min(0, "Minimum 0")
        .max(10, "Maximum 10"),
      beneficiariesAges: z.string().optional().or(z.literal("")),
    }),
    render: ({ control, watch }) => {
      const nb = Number(watch("extraBeneficiaries") ?? 0);
      return createElement(
        Fragment,
        null,
        createElement(FormTextField, {
          key: "mainDob",
          control,
          name: "mainDob",
          label: "Date de naissance de l'assuré principal",
          required: true,
          type: "date",
        }),
        createElement(FormNumberField, {
          key: "extraBeneficiaries",
          control,
          name: "extraBeneficiaries",
          label: "Nombre de bénéficiaires supplémentaires",
          required: true,
          min: 0,
          max: 10,
          description: "Conjoint, enfants, etc.",
        }),
        nb > 0 &&
          createElement(FormTextarea, {
            key: "beneficiariesAges",
            control,
            name: "beneficiariesAges",
            label: "Âges des bénéficiaires",
            placeholder: "ex: 35, 28, 5 ans",
          }),
      );
    },
  },
  {
    id: "regime",
    label: "Situation actuelle",
    title: "Situation professionnelle et couverture actuelle.",
    fields: ["regime", "currentInsurer", "currentPremium"],
    schema: z.object({
      regime: z.string().min(1, requiredMsg),
      currentInsurer: z.string().trim().max(80).optional().or(z.literal("")),
      currentPremium: z
        .union([z.literal(""), z.coerce.number().min(0)])
        .optional(),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormSelectField, {
          key: "regime",
          control,
          name: "regime",
          label: "Régime",
          required: true,
          options: [
            { value: "salarie", label: "Salarié" },
            { value: "tns", label: "TNS (Travailleur Non-Salarié)" },
            { value: "retraite", label: "Retraité" },
            { value: "autre", label: "Autre" },
          ],
        }),
        createElement(FormTextField, {
          key: "currentInsurer",
          control,
          name: "currentInsurer",
          label: "Mutuelle actuelle",
          placeholder: "ex: April, Néoliane, etc.",
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
    id: "needs",
    label: "Besoins",
    title: "Quel est votre niveau de besoin ?",
    fields: ["needSoins", "needHospi", "needOptique", "needDentaire"],
    schema: z.object({
      needSoins: scaleSchema,
      needHospi: scaleSchema,
      needOptique: scaleSchema,
      needDentaire: scaleSchema,
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormScaleField, {
          key: "needSoins",
          control,
          name: "needSoins",
          label: "Soins courants",
          description: "Médecin généraliste, traitement, analyses",
          required: true,
        }),
        createElement(FormScaleField, {
          key: "needHospi",
          control,
          name: "needHospi",
          label: "Hospitalisation",
          required: true,
        }),
        createElement(FormScaleField, {
          key: "needOptique",
          control,
          name: "needOptique",
          label: "Optique",
          description: "Lunettes, lentilles",
          required: true,
        }),
        createElement(FormScaleField, {
          key: "needDentaire",
          control,
          name: "needDentaire",
          label: "Dentaire",
          description: "Détartrage, couronnes, implants",
          required: true,
        }),
      ),
  },
  {
    id: "commercial",
    label: "Coordonnées",
    title: "Finalisons votre demande.",
    fields: ["effectiveDate", "commercialName", "commercialPhone", "rgpd"],
    schema: z.object({
      effectiveDate: z.string().min(1, requiredMsg),
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
          key: "effectiveDate",
          control,
          name: "effectiveDate",
          label: "Date d'effet souhaitée",
          required: true,
          type: "date",
        }),
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