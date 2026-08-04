import { MultiStepForm } from "./MultiStepForm";
import {
  monetiqueSteps,
  monetiqueDefaultValues,
} from "@/data/formConfig/monetiqueSteps";

export function MonetiqueForm() {
  return (
    <MultiStepForm
      productId="monetique"
      productLabel="Monétique"
      steps={monetiqueSteps}
      defaultValues={monetiqueDefaultValues}
    />
  );
}
