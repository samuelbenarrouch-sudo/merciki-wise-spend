import { isValidElement, type ReactNode } from "react";
import type { Control, UseFormWatch } from "react-hook-form";
import type { StepConfig } from "@/components/forms/MultiStepForm";
import type { ProductId } from "@/data/products";
import { energySteps } from "@/data/formConfig/energySteps";
import { telecomsSteps } from "@/data/formConfig/telecomsSteps";
import { mutuelleSanteSteps } from "@/data/formConfig/mutuelleSanteSteps";
import { santeAnimaleSteps } from "@/data/formConfig/santeAnimaleSteps";
import { emprunteurSteps } from "@/data/formConfig/emprunteurSteps";
import { enrSteps } from "@/data/formConfig/enrSteps";
import { monetiqueSteps } from "@/data/formConfig/monetiqueSteps";
import { energieProSteps } from "@/data/formConfig/energieProSteps";
import { assurancesProSteps } from "@/data/formConfig/assurancesProSteps";

/**
 * Résolution des libellés affichés au commercial, à partir des configurations
 * de parcours existantes. Les champs sont décrits par des éléments React
 * portant les props `name`, `label` et parfois `options` : on parcourt l'arbre
 * d'éléments produit par `render()` sans jamais le monter, et on en extrait la
 * correspondance clé technique -> libellé (et valeur -> libellé d'option).
 */

const STEPS_BY_PRODUCT: Record<ProductId, StepConfig[]> = {
  energie: energySteps,
  telecoms: telecomsSteps,
  "mutuelle-sante": mutuelleSanteSteps,
  "sante-animale": santeAnimaleSteps,
  emprunteur: emprunteurSteps,
  enr: enrSteps,
  monetique: monetiqueSteps,
  "energie-pro": energieProSteps,
  "assurances-pro": assurancesProSteps,
};

export interface FieldMeta {
  label: string;
  options?: Record<string, string>;
}

type FieldMap = Record<string, FieldMeta>;

const cache = new Map<string, FieldMap>();

function walk(node: ReactNode, out: FieldMap): void {
  if (node == null || typeof node === "boolean") return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, out);
    return;
  }
  if (!isValidElement(node)) return;

  const props = node.props as Record<string, unknown>;
  const name = props.name;
  const label = props.label;
  if (typeof name === "string" && typeof label === "string" && !out[name]) {
    const meta: FieldMeta = { label };
    const options = props.options;
    if (Array.isArray(options)) {
      const map: Record<string, string> = {};
      for (const opt of options) {
        if (opt && typeof opt === "object") {
          const o = opt as { value?: unknown; label?: unknown };
          if (typeof o.value === "string" && typeof o.label === "string") {
            map[o.value] = o.label;
          }
        }
      }
      if (Object.keys(map).length > 0) meta.options = map;
    }
    out[name] = meta;
  }

  if (props.children !== undefined) walk(props.children as ReactNode, out);
}

/** Contexte factice : les composants de champ ne sont jamais exécutés. */
const fakeControl = {} as Control<any>;
const fakeWatch = (() => undefined) as unknown as UseFormWatch<any>;

function buildFieldMap(productCode: string): FieldMap {
  const cached = cache.get(productCode);
  if (cached) return cached;

  const steps = STEPS_BY_PRODUCT[productCode as ProductId] ?? [];
  const out: FieldMap = {};
  for (const step of steps) {
    try {
      walk(step.render({ control: fakeControl, watch: fakeWatch }), out);
    } catch (error) {
      // Un rendu conditionnel peut dépendre de valeurs absentes : on ignore
      // l'étape plutôt que de perdre tout le reste de la résolution.
      console.warn(`[fieldLabels] étape « ${step.id} » non explorée`, error);
    }
  }
  cache.set(productCode, out);
  return out;
}

export function getFieldMeta(productCode: string, key: string): FieldMeta | undefined {
  return buildFieldMap(productCode)[key];
}

/** Libellé du champ, ou la clé brute si aucun libellé n'est connu. */
export function resolveFieldLabel(productCode: string, key: string): string {
  return getFieldMeta(productCode, key)?.label ?? key;
}

/** Libellé d'une valeur d'option, ou la valeur brute. */
export function resolveValueLabel(
  productCode: string,
  key: string,
  value: string,
): string {
  return getFieldMeta(productCode, key)?.options?.[value] ?? value;
}

/** Mise en forme lisible d'une valeur de `details`. */
export function formatDetailValue(
  productCode: string,
  key: string,
  value: unknown,
): string[] {
  if (value === null || value === undefined || value === "") return ["—"];
  if (typeof value === "boolean") return [value ? "Oui" : "Non"];
  if (Array.isArray(value)) {
    return value.map((v) =>
      typeof v === "string" ? resolveValueLabel(productCode, key, v) : String(v),
    );
  }
  if (typeof value === "object") return [JSON.stringify(value)];
  if (typeof value === "string") return [resolveValueLabel(productCode, key, value)];
  return [String(value)];
}
