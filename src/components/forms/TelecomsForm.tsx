import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import {
  telecomsSteps,
  telecomsDefaultValues,
} from "@/data/formConfig/telecomsSteps";

// ℹ️ Le branchement vers Google Sheets sera fait au prompt 13.
async function handleSubmit(payload: SubmissionPayload) {
  console.log("[TelecomsForm] submission", payload);
}

export function TelecomsForm() {
  return (
    <MultiStepForm
      productId="telecoms"
      productLabel="Télécoms"
      steps={telecomsSteps}
      defaultValues={telecomsDefaultValues}
      onSubmit={handleSubmit}
    />
  );
}