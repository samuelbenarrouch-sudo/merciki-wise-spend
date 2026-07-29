import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import {
  mutuelleSanteSteps,
  mutuelleSanteDefaultValues,
} from "@/data/formConfig/mutuelleSanteSteps";

// ℹ️ Le branchement vers Google Sheets sera fait au prompt 13.
async function handleSubmit(payload: SubmissionPayload) {
  console.log("[MutuelleSanteForm] submission", payload);
}

export function MutuelleSanteForm() {
  return (
    <MultiStepForm
      productId="mutuelle-sante"
      productLabel="Mutuelle Santé"
      steps={mutuelleSanteSteps}
      defaultValues={mutuelleSanteDefaultValues}
      onSubmit={handleSubmit}
    />
  );
}