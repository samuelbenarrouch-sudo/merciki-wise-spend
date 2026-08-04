import { CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import {
  assurancesProSteps,
  assurancesProDefaultValues,
} from "@/data/formConfig/assurancesProSteps";

async function handleSubmit(payload: SubmissionPayload) {
  console.log("[AssurancesProForm] submission", payload);
}

export function AssurancesProForm() {
  return (
    <MultiStepForm
      productId="assurances-pro"
      productLabel="Assurances Pro"
      steps={assurancesProSteps}
      defaultValues={assurancesProDefaultValues}
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
              {String(data.companyName ?? "votre client")}
            </span>{" "}
            a bien été envoyé.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="primary" size="lg" onClick={reset}>
              Soumettre un autre dossier
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/leadgeneration/dashboard">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      )}
    />
  );
}
