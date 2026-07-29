import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import {
  monetiqueSteps,
  monetiqueDefaultValues,
} from "@/data/formConfig/monetiqueSteps";

// ℹ️ Le branchement vers Google Sheets sera fait au prompt 13.
async function handleSubmit(payload: SubmissionPayload) {
  console.log("[MonetiqueForm] submission", payload);
}

export function MonetiqueForm() {
  return (
    <MultiStepForm
      productId="monetique"
      productLabel="Monétique"
      steps={monetiqueSteps}
      defaultValues={monetiqueDefaultValues}
      onSubmit={handleSubmit}
    />
  );
}