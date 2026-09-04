import { MultiStepForm } from "./MultiStepForm";
import { autoSteps, autoDefaultValues } from "@/data/formConfig/autoSteps";

export function AutoForm() {
  return (
    <MultiStepForm
      productId="auto"
      productLabel="Assurance Auto"
      steps={autoSteps}
      defaultValues={autoDefaultValues}
    />
  );
}
