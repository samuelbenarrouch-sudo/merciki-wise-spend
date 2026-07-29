import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import { enrSteps, enrDefaultValues } from "@/data/formConfig/enrSteps";

// ℹ️ Le branchement vers Google Sheets sera fait au prompt 13.
async function handleSubmit(payload: SubmissionPayload) {
  console.log("[ENRForm] submission", payload);
}

export function ENRForm() {
  return (
    <MultiStepForm
      productId="enr"
      productLabel="Énergies Renouvelables"
      steps={enrSteps}
      defaultValues={enrDefaultValues}
      onSubmit={handleSubmit}
    />
  );
}