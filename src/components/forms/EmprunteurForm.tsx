import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import {
  emprunteurSteps,
  emprunteurDefaultValues,
} from "@/data/formConfig/emprunteurSteps";

// ℹ️ Le branchement vers Google Sheets sera fait au prompt 13.
async function handleSubmit(payload: SubmissionPayload) {
  console.log("[EmprunteurForm] submission", payload);
}

export function EmprunteurForm() {
  return (
    <MultiStepForm
      productId="emprunteur"
      productLabel="Assurance Emprunteur"
      steps={emprunteurSteps}
      defaultValues={emprunteurDefaultValues}
      onSubmit={handleSubmit}
    />
  );
}