import { MultiStepForm } from "./MultiStepForm";
import {
  mutuelleSanteSteps,
  mutuelleSanteDefaultValues,
} from "@/data/formConfig/mutuelleSanteSteps";

export function MutuelleSanteForm() {
  return (
    <MultiStepForm
      productId="mutuelle-sante"
      productLabel="Mutuelle Santé"
      steps={mutuelleSanteSteps}
      defaultValues={mutuelleSanteDefaultValues}
    />
  );
}
