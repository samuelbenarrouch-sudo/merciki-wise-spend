import { MultiStepForm } from "./MultiStepForm";
import { enrSteps, enrDefaultValues } from "@/data/formConfig/enrSteps";

export function ENRForm() {
  return (
    <MultiStepForm
      productId="enr"
      productLabel="Énergies Renouvelables"
      steps={enrSteps}
      defaultValues={enrDefaultValues}
    />
  );
}
