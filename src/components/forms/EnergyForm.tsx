import { MultiStepForm, type SubmissionPayload } from "./MultiStepForm";
import { energySteps, energyDefaultValues } from "@/data/formConfig/energySteps";

// ℹ️ Le branchement vers Google Sheets sera fait au prompt 13.
async function handleSubmit(payload: SubmissionPayload) {
  console.log("[EnergyForm] submission", payload);
}

export function EnergyForm() {
  return (
    <MultiStepForm
      productId="energie"
      productLabel="Énergie"
      steps={energySteps}
      defaultValues={energyDefaultValues}
      onSubmit={handleSubmit}
    />
  );
}