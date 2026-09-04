import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormChipsField,
  FormDecimalField,
  FormNumberField,
  FormRadioGroup,
  FormSelectField,
  FormTextField,
  FormTextarea,
} from "@/components/forms/FormFields";
import {
  consentDefaultValues,
  consentStep,
  prospectDefaultValues,
  prospectStep,
  prospectContactStep,
} from "./sharedSteps";

const requiredMsg = "Ce champ est requis";
const ouiNon = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
];

const optionalText = z.string().trim().max(1000).optional().or(z.literal(""));
const optionalNumber = z
  .union([z.literal(""), z.coerce.number().min(0)])
  .optional();

export const assurancesProDefaultValues = {
  ...prospectDefaultValues,
  companyName: "",
  siren: "",
  legalForm: "",
  companyAddress: "",
  companyCity: "",
  companyCreatedAt: "",
  mainActivity: "",
  apeCode: "",
  sector: "",
  annualRevenue: "",
  headcount: "",
  subcontracting: "",
  subcontractingAmount: "",
  guarantees: [] as string[],
  decennaleActivities: "",
  buildingRevenue: "",
  siteCount: "",
  averageSiteAmount: "",
  claims: "",
  claimsDetail: "",
  terminated: "",
  terminationReason: "",
  partner: "",
  effectiveDate: "",
  comments: "",
  ...consentDefaultValues,
};

export const assurancesProSteps: StepConfig[] = [
  prospectStep,
  prospectContactStep,
  {
    id: "entreprise",
    label: "Entreprise",
    title: "Identification de l'entreprise cliente",
    fields: [
      "companyName",
      "siren",
      "legalForm",
      "companyAddress",
      "companyCity",
      "companyCreatedAt",
    ],
    schema: z.object({
      companyName: z.string().trim().min(1, requiredMsg).max(150),
      siren: z
        .string()
        .trim()
        .regex(/^\d{9}$|^\d{14}$/, "SIREN (9 chiffres) ou SIRET (14 chiffres)"),
      legalForm: z.string().trim().min(1, requiredMsg),
      companyAddress: z.string().trim().min(1, requiredMsg).max(200),
      companyCity: z.string().trim().min(1, requiredMsg).max(100),
      companyCreatedAt: optionalText,
    }),
    render: ({ control }) => (
      <>
        <FormTextField
          control={control}
          name="companyName"
          label="Raison sociale"
          required
          placeholder="Ex. Bâti Sud SARL"
        />
        <FormTextField
          control={control}
          name="siren"
          label="SIREN ou SIRET"
          required
          inputMode="numeric"
          placeholder="9 ou 14 chiffres"
        />
        <FormSelectField
          control={control}
          name="legalForm"
          label="Forme juridique"
          options={[
            "SARL",
            "EURL",
            "SAS",
            "SASU",
            "SA",
            "SCI",
            "Auto-entrepreneur",
            "Entreprise individuelle",
            "Association",
            "Autre",
          ].map((v) => ({ value: v, label: v }))}
        />
        <FormTextField
          control={control}
          name="companyAddress"
          label="Adresse du siège"
          required
          placeholder="12 rue des Artisans"
        />
        <FormTextField
          control={control}
          name="companyCity"
          label="Ville"
          required
          placeholder="Marseille"
        />
        <FormTextField
          control={control}
          name="companyCreatedAt"
          label="Date de création de l'entreprise"
          type="date"
        />
      </>
    ),
  },
  {
    id: "activite",
    label: "Activité",
    title: "Activité de l'entreprise",
    fields: [
      "mainActivity",
      "apeCode",
      "sector",
      "annualRevenue",
      "headcount",
      "subcontracting",
      "subcontractingAmount",
    ],
    schema: z.object({
      mainActivity: z.string().trim().min(1, requiredMsg).max(1000),
      apeCode: optionalText,
      sector: z.string().trim().min(1, requiredMsg),
      annualRevenue: z.coerce.number({ invalid_type_error: requiredMsg }).min(0),
      headcount: z.coerce.number({ invalid_type_error: requiredMsg }).min(0),
      subcontracting: z.string().trim().min(1, requiredMsg),
      subcontractingAmount: optionalNumber,
    }),
    validate: (v) =>
      v.subcontracting === "oui" &&
      (v.subcontractingAmount === "" || v.subcontractingAmount == null)
        ? { subcontractingAmount: requiredMsg }
        : null,
    render: ({ control, watch }) => (
      <>
        <FormTextarea
          control={control}
          name="mainActivity"
          label="Activité principale exercée"
          required
          description="Décrire précisément l'activité réelle, c'est le critère principal de tarification"
        />
        <FormTextField
          control={control}
          name="apeCode"
          label="Code APE / NAF"
          placeholder="Ex. 4120A"
        />
        <FormSelectField
          control={control}
          name="sector"
          label="Secteur"
          required
          options={[
            "Bâtiment et travaux publics",
            "Artisanat",
            "Commerce et distribution",
            "Restauration et hôtellerie",
            "Services aux entreprises",
            "Professions libérales et conseil",
            "Santé et bien-être",
            "Transport et logistique",
            "Immobilier",
            "Autre",
          ].map((v) => ({ value: v, label: v }))}
        />
        <FormDecimalField
          control={control}
          name="annualRevenue"
          label="Chiffre d'affaires annuel HT"
          required
          min={0}
          suffix="€"
        />
        <FormNumberField
          control={control}
          name="headcount"
          label="Effectif total"
          required
          min={0}
          description="Dirigeant inclus"
        />
        <FormRadioGroup
          control={control}
          name="subcontracting"
          label="Recours à la sous-traitance"
          required
          options={ouiNon}
        />
        {watch("subcontracting") === "oui" && (
          <FormDecimalField
            control={control}
            name="subcontractingAmount"
            label="Montant annuel sous-traité HT"
            required
            min={0}
            suffix="€"
          />
        )}
      </>
    ),
  },
  {
    id: "garanties",
    label: "Garanties",
    title: "Garanties recherchées",
    fields: [
      "guarantees",
      "decennaleActivities",
      "buildingRevenue",
      "siteCount",
      "averageSiteAmount",
    ],
    schema: z.object({
      guarantees: z
        .array(z.string())
        .min(1, "Sélectionnez au moins une garantie"),
      decennaleActivities: optionalText,
      buildingRevenue: optionalNumber,
      siteCount: optionalNumber,
      averageSiteAmount: optionalNumber,
    }),
    validate: (v) => {
      const list: string[] = Array.isArray(v.guarantees) ? v.guarantees : [];
      if (!list.includes("Garantie Décennale")) return null;
      const errors: Record<string, string> = {};
      if (!String(v.decennaleActivities ?? "").trim())
        errors.decennaleActivities = requiredMsg;
      if (v.buildingRevenue === "" || v.buildingRevenue == null)
        errors.buildingRevenue = requiredMsg;
      return errors;
    },
    render: ({ control, watch }) => {
      const list: string[] = Array.isArray(watch("guarantees"))
        ? watch("guarantees")
        : [];
      return (
        <>
          <FormChipsField
            control={control}
            name="guarantees"
            label="Garanties souhaitées"
            required
            description="Plusieurs choix possibles"
            options={[
              "RC Professionnelle",
              "RC Exploitation",
              "Garantie Décennale",
              "Multirisque professionnelle",
              "Protection juridique",
              "Autre",
            ].map((v) => ({ value: v, label: v }))}
          />
          {list.includes("Garantie Décennale") && (
            <div className="space-y-5 rounded-xl border-l-4 border-primary bg-primary-light/50 p-4 sm:p-5">
              <p className="text-label text-ink">Informations décennale</p>
              <FormTextarea
                control={control}
                name="decennaleActivities"
                label="Activités déclarées pour la décennale"
                required
                description="Lister les corps de métier à couvrir (maçonnerie, plomberie, électricité…)"
              />
              <FormDecimalField
                control={control}
                name="buildingRevenue"
                label="Chiffre d'affaires bâtiment HT"
                required
                min={0}
                suffix="€"
              />
              <FormNumberField
                control={control}
                name="siteCount"
                label="Nombre de chantiers par an"
                min={0}
              />
              <FormDecimalField
                control={control}
                name="averageSiteAmount"
                label="Montant moyen d'un chantier HT"
                min={0}
                suffix="€"
              />
            </div>
          )}
        </>
      );
    },
  },
  {
    id: "antecedents",
    label: "Antécédents",
    title: "Antécédents et sinistralité",
    fields: ["claims", "claimsDetail", "terminated", "terminationReason"],
    schema: z.object({
      claims: z.string().trim().min(1, requiredMsg),
      claimsDetail: optionalText,
      terminated: z.string().trim().min(1, requiredMsg),
      terminationReason: optionalText,
    }),
    validate: (v) => {
      const errors: Record<string, string> = {};
      if (v.claims === "oui" && !String(v.claimsDetail ?? "").trim())
        errors.claimsDetail = requiredMsg;
      if (v.terminated === "oui" && !String(v.terminationReason ?? "").trim())
        errors.terminationReason = requiredMsg;
      return errors;
    },
    render: ({ control, watch }) => (
      <>
        <FormRadioGroup
          control={control}
          name="claims"
          label="Sinistres survenus sur les 5 dernières années"
          required
          options={ouiNon}
        />
        {watch("claims") === "oui" && (
          <FormTextarea
            control={control}
            name="claimsDetail"
            label="Détail des sinistres"
            required
            description="Nature, date, montant indemnisé pour chaque sinistre"
          />
        )}
        <FormRadioGroup
          control={control}
          name="terminated"
          label="Résiliation par un précédent assureur"
          required
          options={ouiNon}
        />
        {watch("terminated") === "oui" && (
          <FormTextarea
            control={control}
            name="terminationReason"
            label="Motif de résiliation"
            required
          />
        )}
      </>
    ),
  },
  {
    id: "orientation",
    label: "Orientation",
    title: "Orientation partenaire",
    fields: ["partner", "effectiveDate", "comments"],
    schema: z.object({
      partner: z.string().trim().min(1, requiredMsg),
      effectiveDate: z.string().trim().min(1, requiredMsg),
      comments: optionalText,
    }),
    render: ({ control }) => (
      <>
        <FormSelectField
          control={control}
          name="partner"
          label="Partenaire envisagé"
          required
          options={["April", "Zenioo", "Matrisk", "À déterminer par Merciki"].map(
            (v) => ({ value: v, label: v }),
          )}
        />
        <FormTextField
          control={control}
          name="effectiveDate"
          label="Date d'effet souhaitée"
          required
          type="date"
        />
        <FormTextarea
          control={control}
          name="comments"
          label="Commentaires"
          placeholder="Informations complémentaires sur le dossier…"
        />
      </>
    ),
  },
  consentStep,
];
