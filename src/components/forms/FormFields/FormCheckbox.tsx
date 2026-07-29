import { Controller, type Control } from "react-hook-form";
import { type ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  name: string;
  label: ReactNode;
  control: Control<any>;
  required?: boolean;
}

export function FormCheckbox({ name, label, control }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <label
            htmlFor={name}
            className="flex cursor-pointer items-start gap-3"
          >
            <Checkbox
              id={name}
              checked={!!field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
              className="mt-0.5"
            />
            <span className="text-small text-ink">{label}</span>
          </label>
          {fieldState.error && (
            <p className="text-small text-destructive" role="alert">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}