import { MultiStepForm } from "./MultiStepForm";
import { motoSteps, motoDefaultValues } from "@/data/formConfig/motoSteps";

export function MotoForm() {
  return (
    <MultiStepForm
      productId="moto"
      productLabel="Assurance Moto"
      steps={motoSteps}
      defaultValues={motoDefaultValues}
    />
  );
}
