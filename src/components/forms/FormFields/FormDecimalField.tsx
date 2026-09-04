import { useEffect, useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldShell, type BaseFieldProps } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
  min?: number;
  max?: number;
  /** Suffixe affiché, « € » par défaut. */
  suffix?: string;
}

/**
 * Saisie d'un MONTANT en euros.
 *
 * On n'utilise volontairement PAS type="number" : ce type rejette la virgule,
 * si bien qu'un commercial français tapant « 39,90 » voyait le champ se lire
 * comme VIDE, sans message d'erreur. type="text" + inputMode="decimal"
 * conserve le clavier numérique sur mobile tout en acceptant la virgule.
 *
 * La normalisation virgule -> point se fait ICI, dans l'état du formulaire :
 * le brouillon local, le JSON stocké et l'affichage backoffice reçoivent donc
 * tous une valeur numérique propre.
 */
export function FormDecimalField({
  name,
  label,
  control,
  required,
  description,
  placeholder,
  min = 0,
  max,
  suffix = "€",
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AmountInput
          id={name}
          label={label}
          required={required}
          description={description}
          placeholder={placeholder}
          min={min}
          max={max}
          suffix={suffix}
          value={field.value}
          error={fieldState.error?.message}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

/** Représentation texte d'une valeur du formulaire (nombre ou vide). */
function toText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value).replace(".", ",");
}

function AmountInput({
  id,
  label,
  required,
  description,
  placeholder,
  min,
  max,
  suffix,
  value,
  error,
  onValueChange,
  onBlur,
}: {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  min: number;
  max?: number;
  suffix: string;
  value: unknown;
  error?: string;
  onValueChange: (value: number | "") => void;
  onBlur: () => void;
}) {
  const [text, setText] = useState(() => toText(value));
  const [localError, setLocalError] = useState<string | null>(null);

  // Resynchronise l'affichage si la valeur change hors du champ
  // (reprise de brouillon, réinitialisation du formulaire).
  useEffect(() => {
    setText((current) => {
      const normalized = current.replace(",", ".");
      const currentNumber = normalized === "" ? "" : Number(normalized);
      const incoming = value === null || value === undefined ? "" : value;
      return currentNumber === incoming ? current : toText(incoming);
    });
  }, [value]);

  const handleChange = (raw: string) => {
    // Tout caractère non numérique (hors séparateur décimal) est refusé.
    if (raw !== "" && !/^[0-9]*[.,]?[0-9]*$/.test(raw)) {
      setLocalError("Saisissez un montant en chiffres, ex : 39,90");
      return;
    }

    const decimals = raw.split(/[.,]/)[1];
    if (decimals !== undefined && decimals.length > 2) {
      setLocalError("Deux décimales maximum (centimes).");
      return;
    }

    setText(raw);
    setLocalError(null);

    if (raw === "" || raw === "," || raw === ".") {
      onValueChange("");
      return;
    }

    // Normalisation : la virgule devient un point, la valeur stockée est
    // un NOMBRE, jamais une chaîne.
    const parsed = Number(raw.replace(",", "."));
    if (Number.isNaN(parsed)) {
      onValueChange("");
      return;
    }
    if (parsed < min) {
      setLocalError("Le montant doit être positif.");
      return;
    }
    if (max !== undefined && parsed > max) {
      setLocalError(`Le montant ne peut pas dépasser ${max}.`);
      return;
    }
    onValueChange(parsed);
  };

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      description={description}
      error={localError ?? error}
    >
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          className="h-12 rounded-lg pr-10"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => {
            setText(toText(value));
            onBlur();
          }}
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate">
          {suffix}
        </span>
      </div>
    </FieldShell>
  );
}
