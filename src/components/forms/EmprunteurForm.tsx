import { MultiStepForm } from "./MultiStepForm";
import {
  emprunteurSteps,
  emprunteurDefaultValues,
} from "@/data/formConfig/emprunteurSteps";

export function EmprunteurForm() {
  return (
    <MultiStepForm
      productId="emprunteur"
      productLabel="Assurance Emprunteur"
      steps={emprunteurSteps}
      defaultValues={emprunteurDefaultValues}
    />
  );
}
