import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import {
  santeAnimaleSteps,
  santeAnimaleDefaultValues,
} from "@/data/formConfig/santeAnimaleSteps";

// ℹ️ Le branchement vers Google Sheets sera fait au prompt 13.
async function handleSubmit(payload: SubmissionPayload) {
  console.log("[SanteAnimaleForm] submission", payload);
}

export function SanteAnimaleForm() {
  return (
    <MultiStepForm
      productId="sante-animale"
      productLabel="Santé Animale"
      steps={santeAnimaleSteps}
      defaultValues={santeAnimaleDefaultValues}
      onSubmit={handleSubmit}
    />
  );
}