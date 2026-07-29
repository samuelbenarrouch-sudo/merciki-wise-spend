import { Controller, type Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldShell, type BaseFieldProps, type Option } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
  options: Option[];
}

export function FormRadioGroup({
  name,
  label,
  control,
  required,
  description,
  options,
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
          <RadioGroup
            value={field.value ?? ""}
            onValueChange={field.onChange}
            className="flex flex-wrap gap-3"
          >
            {options.map((o) => (
              <label
                key={o.value}
                htmlFor={`${name}-${o.value}`}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-mist bg-background px-4 py-2 text-body text-ink hover:border-primary"
              >
                <RadioGroupItem id={`${name}-${o.value}`} value={o.value} />
                {o.label}
              </label>
            ))}
          </RadioGroup>
        </FieldShell>
      )}
    />
  );
}