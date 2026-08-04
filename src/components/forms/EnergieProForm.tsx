import { MultiStepForm } from "./MultiStepForm";
import {
  energieProSteps,
  energieProDefaultValues,
} from "@/data/formConfig/energieProSteps";

export function EnergieProForm() {
  return (
    <MultiStepForm
      productId="energie-pro"
      productLabel="Énergie Pro"
      steps={energieProSteps}
      defaultValues={energieProDefaultValues}
      submitLabel="Transmettre le dossier"
    />
  );
}
