import { MultiStepForm } from "./MultiStepForm";
import {
  habitationSteps,
  habitationDefaultValues,
} from "@/data/formConfig/habitationSteps";

export function HabitationForm() {
  return (
    <MultiStepForm
      productId="habitation"
      productLabel="Assurance Habitation"
      steps={habitationSteps}
      defaultValues={habitationDefaultValues}
    />
  );
}
