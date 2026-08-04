import { MultiStepForm } from "./MultiStepForm";
import { energySteps, energyDefaultValues } from "@/data/formConfig/energySteps";

export function EnergyForm() {
  return (
    <MultiStepForm
      productId="energie"
      productLabel="Énergie"
      steps={energySteps}
      defaultValues={energyDefaultValues}
    />
  );
}
