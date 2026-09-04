import { Controller, type Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldShell, type BaseFieldProps } from "./shared";

/**
 * SIREN : la base exige EXACTEMENT 9 chiffres. On nettoie donc à la saisie
 * (espaces, points, tirets et tout autre séparateur) pour qu'un « 930 963 541 »
 * tapé naturellement soit stocké « 930963541 » et accepté à l'enregistrement.
 */
export const SIREN_ERROR =
  "Le SIREN comporte 9 chiffres. Un SIRET en compte 14 : n'en saisissez que les 9 premiers.";

export function normalizeSiren(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "");
}

export function isValidSiren(value: unknown): boolean {
  return /^\d{9}$/.test(normalizeSiren(value));
}

interface Props extends BaseFieldProps {
  control: Control<any>;
}

export function FormSirenField({
  name,
  label,
  control,
  required,
  description,
  placeholder,
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          id={name}
          label={label}
          required={required}
          description={description}
          error={fieldState.error?.message}
        >
          <Input
            id={name}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={placeholder}
            className="h-12 rounded-lg"
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            value={String(field.value ?? "")}
            onChange={(e) =>
              field.onChange(normalizeSiren(e.target.value).slice(0, 9))
            }
          />
        </FieldShell>
      )}
    />
  );
}
