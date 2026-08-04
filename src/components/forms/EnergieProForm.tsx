import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import {
  energieProSteps,
  energieProDefaultValues,
  ACD_URL,
} from "@/data/formConfig/energieProSteps";

async function handleSubmit(payload: SubmissionPayload) {
  console.log("[EnergieProForm] submission", payload);
}

export function EnergieProForm() {
  return (
    <MultiStepForm
      productId="energie-pro"
      productLabel="Énergie Pro"
      steps={energieProSteps}
      defaultValues={energieProDefaultValues}
      onSubmit={handleSubmit}
      submitLabel="Transmettre le dossier"
      renderSuccess={({ data, reset }) => (
        <div className="rounded-2xl bg-background p-6 text-center shadow-soft sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-success">
            <CheckCircle2 className="h-8 w-8" strokeWidth={1.75} />
          </div>
          <h2 className="mt-6 text-h2 text-ink">Dossier transmis ✅</h2>
          <p className="mt-4 text-body text-ink">
            Le dossier de{" "}
            <span className="font-semibold">
              {String(data.enseigneName ?? "votre client")}
            </span>{" "}
            a bien été envoyé.
          </p>
          <p className="mx-auto mt-3 max-w-md text-body text-slate">
            Vérifie que l'ACD Yousign est bien signée si ce n'est pas déjà fait.
          </p>
          <a
            href={ACD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            Ouvrir le formulaire ACD (Yousign)
          </a>
          <div className="mt-8">
            <Button variant="primary" size="lg" onClick={reset}>
              Soumettre un autre dossier
            </Button>
          </div>
        </div>
      )}
    />
  );
}