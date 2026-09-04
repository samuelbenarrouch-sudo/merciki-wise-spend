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
import { autoSteps } from "@/data/formConfig/autoSteps";
import { motoSteps } from "@/data/formConfig/motoSteps";
import { habitationSteps } from "@/data/formConfig/habitationSteps";

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
  auto: autoSteps,
  moto: motoSteps,
  habitation: habitationSteps,
};

export interface FieldMeta {
  label: string;
  options?: Record<string, string>;
  /** Nom au singulier d'une entrée, pour les champs répétables. */
  itemLabel?: string;
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
    const itemLabel = props.itemLabel;
    if (typeof itemLabel === "string") meta.itemLabel = itemLabel;
    out[name] = meta;
  }

  if (props.children !== undefined) walk(props.children as ReactNode, out);
}

/** Contexte factice : les composants de champ ne sont jamais exécutés. */
const fakeControl = {} as Control<any>;

function makeWatch(values: Record<string, unknown>): UseFormWatch<any> {
  return ((name?: string) =>
    typeof name === "string" ? values[name] : values) as unknown as UseFormWatch<any>;
}

/**
 * Valeurs candidates pour déclencher les branches conditionnelles d'un champ :
 * ses propres options (connues du premier passage), la liste complète de ces
 * options (champs à choix multiples), et quelques valeurs génériques couvrant
 * les conditions booléennes ou numériques. Aucune clé de champ n'est codée en
 * dur : seules les valeurs possibles sont explorées.
 */
function candidateValues(meta: FieldMeta | undefined): unknown[] {
  const optionValues = meta?.options ? Object.keys(meta.options) : [];
  return [...optionValues, optionValues, "oui", "non", true, 1];
}

function renderStep(
  step: StepConfig,
  values: Record<string, unknown>,
  out: FieldMap,
): void {
  try {
    walk(step.render({ control: fakeControl, watch: makeWatch(values) }), out);
  } catch {
    // Une branche conditionnelle peut dépendre d'une valeur incompatible :
    // on ignore ce sondage plutôt que de perdre le reste de la résolution.
  }
}

function buildFieldMap(productCode: string): FieldMap {
  const cached = cache.get(productCode);
  if (cached) return cached;

  const steps = STEPS_BY_PRODUCT[productCode as ProductId] ?? [];
  const out: FieldMap = {};

  for (const step of steps) {
    // 1. Passage nominal : champs toujours visibles (et leurs options).
    renderStep(step, {}, out);

    // 2. Sondages : on rejoue le rendu en forçant tour à tour chaque champ de
    //    l'étape à une valeur plausible, jusqu'à ce qu'aucun champ nouveau
    //    n'apparaisse. Les champs conditionnels sont ainsi découverts.
    let discovered = -1;
    while (discovered !== Object.keys(out).length) {
      discovered = Object.keys(out).length;
      const keys = step.fields.length > 0 ? step.fields : Object.keys(out);
      for (const key of keys) {
        for (const value of candidateValues(out[key])) {
          renderStep(step, { [key]: value }, out);
        }
      }
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

/**
 * Entrée structurée (objet) d'un champ répétable : rendue en une ligne
 * lisible « Point de vente 1 — Nom, adresse, code postal ville », jamais en
 * JSON brut ni en « [object Object] ».
 */
function formatObjectEntry(
  productCode: string,
  key: string,
  value: unknown,
  index: number | null,
): string {
  if (value === null || typeof value !== "object") return String(value ?? "—");
  const parts = Object.values(value as Record<string, unknown>)
    .filter((v) => v !== null && v !== undefined && String(v).trim() !== "")
    .map((v) => String(v).trim());
  const body = parts.length > 0 ? parts.join(", ") : "—";
  if (index === null) return body;
  const itemLabel = getFieldMeta(productCode, key)?.itemLabel;
  return itemLabel ? `${itemLabel} ${index + 1} — ${body}` : `${index + 1}. ${body}`;
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
    return value.map((v, i) =>
      typeof v === "string"
        ? resolveValueLabel(productCode, key, v)
        : formatObjectEntry(productCode, key, v, i),
    );
  }
  if (typeof value === "object") {
    return [formatObjectEntry(productCode, key, value, null)];
  }
  if (typeof value === "string") return [resolveValueLabel(productCode, key, value)];
  return [String(value)];
}
