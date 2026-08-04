import { MultiStepForm } from "./MultiStepForm";
import {
  telecomsSteps,
  telecomsDefaultValues,
} from "@/data/formConfig/telecomsSteps";

export function TelecomsForm() {
  return (
    <MultiStepForm
      productId="telecoms"
      productLabel="Télécoms"
      steps={telecomsSteps}
      defaultValues={telecomsDefaultValues}
    />
  );
}
