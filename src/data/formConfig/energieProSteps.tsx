import { z } from "zod";
import { ExternalLink, AlertTriangle } from "lucide-react";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import {
  FormFileField,
  FormRadioGroup,
  FormTextField,
  FormTextarea,
  FormWeekdayDateTimeField,
} from "@/components/forms/FormFields";
import {
  consentDefaultValues,
  consentStep,
  createProspectContactStep,
  prospectDefaultValues,
  prospectStep,
} from "./sharedSteps";

export const ACD_URL =
  "https://yousign.app/workflows/forms/5c721353-482b-492b-adca-f48bd230ad68";

const requiredMsg = "Ce champ est requis";

export const energieProDefaultValues = {
  ...prospectDefaultValues,
  companyName: "",
  enseigneAddress: "",
  contractEnd: "",
  acdDone: "",
  invoiceFiles: [] as File[],
  appointment: "",
  comments: "",
  ...consentDefaultValues,
};

function AcdCallout() {
  return (
    <div className="rounded-xl border-l-4 border-primary bg-primary-light/60 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <ExternalLink
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          strokeWidth={1.75}
        />
        <div className="min-w-0">
          <p className="text-label text-ink">
            L'ACD doit être complétée en ligne avant de soumettre le dossier
          </p>
          <a
            href={ACD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2 text-small font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Ouvrir le formulaire ACD (Yousign) →
          </a>
        </div>
      </div>
    </div>
  );
}

export const energieProSteps: StepConfig[] = [
  prospectStep,
  // Énergie Pro : l'email sert à la signature électronique du mandat ACD.
  createProspectContactStep({ emailRequired: true }),
  {
    id: "enseigne",
    label: "Enseigne",
    title: "Identification de l'enseigne",
    fields: ["companyName", "enseigneAddress"],
    schema: z.object({
      companyName: z.string().trim().min(1, requiredMsg).max(120),
      enseigneAddress: z.string().trim().min(1, requiredMsg).max(200),
    }),
    render: ({ control }) => (
      <>
        <FormTextField
          control={control}
          name="companyName"
          label="Nom de l'enseigne"
          required
          placeholder="Ex. Boulangerie Martin"
        />
        <FormTextField
          control={control}
          name="enseigneAddress"
          label="Adresse de l'enseigne"
          required
          placeholder="12 rue des Artisans, Marseille"
        />
      </>
    ),
  },
  {
    id: "contrat",
    label: "Contrat & ACD",
    title: "Contrat actuel et autorisation de collecte",
    fields: ["contractEnd", "acdDone"],
    schema: z.object({
      contractEnd: z.string().trim().min(1, requiredMsg),
      acdDone: z.enum(["oui", "non"], { errorMap: () => ({ message: requiredMsg }) }),
    }),
    render: ({ control, watch }) => (
      <>
        <FormTextField
          control={control}
          name="contractEnd"
          label="Date d'échéance du contrat actuel"
          required
          type="date"
          description="Si déjà échu, renseignez la date souhaitée de démarrage de la nouvelle offre"
        />
        <AcdCallout />
        <FormRadioGroup
          control={control}
          name="acdDone"
          label="Autorisation de Collecte des Données (ACD) complétée"
          required
          options={[
            { value: "oui", label: "Oui" },
            { value: "non", label: "Non" },
          ]}
        />
        {watch("acdDone") === "non" && (
          <div className="flex items-start gap-3 rounded-xl border-l-4 border-accent bg-accent-soft p-4">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              strokeWidth={1.75}
            />
            <p className="text-small text-ink">
              Le dossier ne pourra pas être traité sans ACD signée. Merci de
              compléter l'ACD via le lien ci-dessus avant de soumettre.
            </p>
          </div>
        )}
      </>
    ),
  },
  {
    id: "factures",
    label: "Factures",
    title: "Factures d'énergie du client",
    fields: ["invoiceFiles"],
    schema: z.object({
      invoiceFiles: z
        .array(z.custom<File>((v) => typeof File !== "undefined" && v instanceof File))
        .min(1, "Ajoutez au moins un fichier")
        .max(5, "5 fichiers maximum"),
    }),
    render: ({ control }) => (
      <>
        <FormFileField
          control={control}
          name="invoiceFiles"
          label="Factures d'énergie"
          required
          description="Photo ou PDF de vos dernières factures. 5 fichiers maximum, 10 Mo par fichier."
        />
        <p className="rounded-xl bg-mist p-4 text-small text-slate">
          Si le client est en Heure Pleine / Heure Creuse ou Saison Haute
          (hiver) / Saison Basse (été), fournissez une facture pour chaque
          saison (une hiver et une été).
        </p>
      </>
    ),
  },
  {
    id: "rdv",
    label: "Rendez-vous",
    title: "Rendez-vous et commentaires",
    fields: ["appointment", "comments"],
    schema: z.object({
      appointment: z
        .string()
        .trim()
        .min(1, requiredMsg)
        .refine((v) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v), {
          message: "Renseignez une date et une heure de rendez-vous.",
        })
        .refine(
          (v) => {
            const d = new Date(v.replace(" ", "T"));
            return !Number.isNaN(d.getTime()) && [3, 4].includes(d.getDay());
          },
          { message: "Merci de choisir un mercredi ou un jeudi." },
        )
        .refine(
          (v) => {
            const d = new Date(v.replace(" ", "T"));
            return d.getTime() >= Date.now();
          },
          { message: "La date de rendez-vous doit être à venir." },
        ),
      comments: z.string().max(1000).optional(),
    }),
    render: ({ control }) => (
      <>
        <FormWeekdayDateTimeField
          control={control}
          name="appointment"
          label="Date et heure de RDV avec le client (présentation / signature)"
          required
          description="Seuls les mercredis et jeudis sont acceptés"
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