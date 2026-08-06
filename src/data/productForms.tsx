import type { ComponentType } from "react";
import type { ProductId } from "@/data/products";
import { EnergyForm } from "@/components/forms/EnergyForm";
import { TelecomsForm } from "@/components/forms/TelecomsForm";
import { MutuelleSanteForm } from "@/components/forms/MutuelleSanteForm";
import { SanteAnimaleForm } from "@/components/forms/SanteAnimaleForm";
import { EmprunteurForm } from "@/components/forms/EmprunteurForm";
import { ENRForm } from "@/components/forms/ENRForm";
import { MonetiqueForm } from "@/components/forms/MonetiqueForm";
import { EnergieProForm } from "@/components/forms/EnergieProForm";
import { AssurancesProForm } from "@/components/forms/AssurancesProForm";

/**
 * Registre unique code produit -> composant de formulaire.
 * Le type Record<ProductId, ...> impose une entrée pour CHAQUE identifiant
 * déclaré dans PRODUCTS : un oubli fait échouer le typecheck.
 */
export const PRODUCT_FORMS: Record<ProductId, ComponentType> = {
  energie: EnergyForm,
  telecoms: TelecomsForm,
  "mutuelle-sante": MutuelleSanteForm,
  "sante-animale": SanteAnimaleForm,
  emprunteur: EmprunteurForm,
  enr: ENRForm,
  monetique: MonetiqueForm,
  "energie-pro": EnergieProForm,
  "assurances-pro": AssurancesProForm,
};

export const getProductForm = (id: string): ComponentType | undefined =>
  PRODUCT_FORMS[id as ProductId];