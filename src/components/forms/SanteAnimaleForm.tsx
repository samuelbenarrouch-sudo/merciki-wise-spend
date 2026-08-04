import { MultiStepForm } from "./MultiStepForm";
import {
  santeAnimaleSteps,
  santeAnimaleDefaultValues,
} from "@/data/formConfig/santeAnimaleSteps";

export function SanteAnimaleForm() {
  return (
    <MultiStepForm
      productId="sante-animale"
      productLabel="Santé Animale"
      steps={santeAnimaleSteps}
      defaultValues={santeAnimaleDefaultValues}
    />
  );
}
