import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormChipsField,
  FormDecimalField,
  FormFileField,
  FormNumberField,
  FormRadioGroup,
  FormSalesPointsField,
  FormSirenField,
  SIREN_ERROR,
  emptySalesPoint,
  isValidSiren,
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

export const monetiqueDefaultValues = {
  ...prospectDefaultValues,
  companyName: "",
  siren: "",
  salesPoints: [{ ...emptySalesPoint }],
  needTypes: [] as string[],
  activityType: "",
  monthlyVolume: "",
  monthlyTransactions: "",
  hasCurrentSolution: "",
  currentProvider: "",
  monthlyFees: "",
  improvements: "",
  kbisFiles: [] as File[],
  idFiles: [] as File[],
  ...consentDefaultValues,
};

const requiredMsg = "Ce champ est requis";

const optionalFiles = (max: number) =>
  z
    .array(z.custom<File>((v) => typeof File !== "undefined" && v instanceof File))
    .max(max, `${max} fichier${max > 1 ? "s" : ""} maximum`)
    .optional();

export const monetiqueSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "enseigne",
    label: "Enseigne",
    title: "Enseigne et points de vente",
    fields: ["companyName", "siren", "salesPoints"],
    schema: z.object({
      companyName: z.string().trim().min(1, requiredMsg).max(150),
      // La base exige exactement 9 chiffres : on valide la valeur nettoyée.
      siren: z.string().refine(isValidSiren, SIREN_ERROR),
      salesPoints: z
        .array(
          z.object({
            label: z.string().trim().max(120).optional().or(z.literal("")),
            address: z.string().trim().min(1, requiredMsg).max(200),
            postalCode: z
              .string()
              .trim()
              .regex(/^\d{5}$/, "Le code postal comporte 5 chiffres"),
            city: z.string().trim().min(1, requiredMsg).max(100),
          }),
        )
        .min(1, "Indiquez au moins un point de vente")
        .max(10, "10 points de vente maximum"),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormTextField, {
          key: "companyName",
          control,
          name: "companyName",
          label: "Nom de l'enseigne",
          required: true,
          placeholder: "Ex. Boulangerie du Centre",
        }),
        createElement(FormSirenField, {
          key: "siren",
          control,
          name: "siren",
          label: "Numéro SIREN",
          required: true,
          description: "9 chiffres, indiqué sur le Kbis.",
          placeholder: "930963541",
        }),
        createElement(FormSalesPointsField, {
          key: "salesPoints",
          control,
          name: "salesPoints",
          label: "Points de vente",
          itemLabel: "Point de vente",
          required: true,
          maxItems: 10,
          description:
            "Le code postal renseigné précédemment est celui du contact. Indiquez ici l'adresse de chaque point de vente équipé.",
        }),
      ),
  },
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
        createElement(FormDecimalField, {
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
          createElement(FormDecimalField, {
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
  {
    id: "documents",
    label: "Documents",
    title: "Documents (facultatif)",
    fields: ["kbisFiles", "idFiles"],
    schema: z.object({
      kbisFiles: optionalFiles(1),
      idFiles: optionalFiles(2),
    }),
    render: ({ control }) =>
      createElement(
        Fragment,
        null,
        createElement(FormFileField, {
          key: "kbisFiles",
          control,
          name: "kbisFiles",
          label: "Extrait Kbis",
          maxFiles: 1,
          description: "Kbis de moins de 3 mois. PDF ou photo, 10 Mo maximum.",
        }),
        createElement(FormFileField, {
          key: "idFiles",
          control,
          name: "idFiles",
          label: "Pièce d'identité du dirigeant",
          maxFiles: 2,
          description:
            "Carte d'identité ou passeport en cours de validité. Recto et verso si CNI. 2 fichiers maximum, 10 Mo par fichier.",
        }),
        createElement(
          "p",
          {
            key: "rgpd",
            className: "rounded-xl bg-mist p-4 text-small text-slate",
          },
          "Ces documents sont transmis à notre partenaire monétique pour la constitution de votre dossier. La pièce d'identité est supprimée de nos systèmes 30 jours après transmission.",
        ),
      ),
  },
  consentStep,
];