import { MultiStepForm } from "./MultiStepForm";
import {
  assurancesProSteps,
  assurancesProDefaultValues,
} from "@/data/formConfig/assurancesProSteps";

export function AssurancesProForm() {
  return (
    <MultiStepForm
      productId="assurances-pro"
      productLabel="Assurances Pro"
      steps={assurancesProSteps}
      defaultValues={assurancesProDefaultValues}
      submitLabel="Transmettre le dossier"
    />
  );
}
