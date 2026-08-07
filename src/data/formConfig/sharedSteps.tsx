import { z } from "zod";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import { FormCheckbox, FormTextField } from "@/components/forms/FormFields";
import { CONSENT_LABEL, FR_PHONE_REGEX, PHONE_ERROR } from "./rgpdLabel";

const requiredMsg = "Ce champ est requis";

/** Valeurs par défaut du bloc identité prospect. */
export const prospectDefaultValues = {
  prospectFirstName: "",
  prospectLastName: "",
  prospectPhone: "",
  prospectEmail: "",
  prospectPostalCode: "",
};

export const prospectIdentitySchema = z.object({
  prospectFirstName: z.string().trim().min(1, requiredMsg).max(80),
  prospectLastName: z.string().trim().min(1, requiredMsg).max(80),
});

/** Écran 1 partagé : identité du prospect. */
export const prospectStep: StepConfig = {
  id: "prospect",
  label: "Le prospect",
  title: "Qui est le prospect ?",
  fields: ["prospectFirstName", "prospectLastName"],
  schema: prospectIdentitySchema,
  render: ({ control }) => (
    <>
      <FormTextField
        control={control}
        name="prospectFirstName"
        label="Prénom du prospect"
        required
      />
      <FormTextField
        control={control}
        name="prospectLastName"
        label="Nom du prospect"
        required
      />
    </>
  ),
};

/**
 * Écran 2 partagé : coordonnées du prospect.
 * `emailRequired` rend l'email obligatoire (Énergie Pro : signature ACD).
 */
export function createProspectContactStep(
  options: { emailRequired?: boolean } = {},
): StepConfig {
  const emailRequired = options.emailRequired ?? false;
  return {
    id: "prospect-contact",
    label: "Ses coordonnées",
    title: "Ses coordonnées",
    fields: ["prospectPhone", "prospectEmail", "prospectPostalCode"],
    schema: z.object({
      prospectPhone: z.string().trim().regex(FR_PHONE_REGEX, PHONE_ERROR),
      prospectEmail: emailRequired
        ? z.string().trim().min(1, requiredMsg).email("Adresse e-mail invalide")
        : z
            .string()
            .trim()
            .email("Adresse e-mail invalide")
            .optional()
            .or(z.literal("")),
      prospectPostalCode: z
        .string()
        .trim()
        .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
    }),
    render: ({ control }) => (
      <>
        <FormTextField
          control={control}
          name="prospectPhone"
          label="Téléphone"
          required
          type="tel"
          inputMode="tel"
          placeholder="06 12 34 56 78"
        />
        <FormTextField
          control={control}
          name="prospectEmail"
          label="Email"
          required={emailRequired}
          type="email"
          inputMode="email"
          placeholder="prenom.nom@email.fr"
          {...(emailRequired
            ? {
                description:
                  "Nécessaire à la signature électronique du mandat ACD",
              }
            : {})}
        />
        <FormTextField
          control={control}
          name="prospectPostalCode"
          label="Code postal"
          required
          inputMode="numeric"
          placeholder="13008"
        />
      </>
    ),
  };
}

/** Écran 2 partagé, email facultatif (cas par défaut). */
export const prospectContactStep: StepConfig = createProspectContactStep();

/** Valeurs par défaut du bloc consentement. */
export const consentDefaultValues = {
  consent: false,
};

export const consentSchema = z.object({
  consent: z.literal(true, {
    errorMap: () => ({ message: "Le consentement du prospect est requis." }),
  }),
});

/** Étape finale partagée : consentement recueilli par le commercial. */
export const consentStep: StepConfig = {
  id: "consent",
  label: "Consentement",
  title: "Consentement du prospect.",
  fields: ["consent"],
  schema: consentSchema,
  render: ({ control }) => (
    <FormCheckbox control={control} name="consent" label={CONSENT_LABEL} />
  ),
};
