import { Controller, type Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldShell, type BaseFieldProps } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
  min?: number;
  max?: number;
  suffix?: string;
}

export function FormNumberField({
  name,
  label,
  control,
  required,
  description,
  placeholder,
  min,
  max,
  suffix,
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
          <div className="relative">
            <Input
              id={name}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              placeholder={placeholder}
              className={suffix ? "h-12 rounded-lg pr-10" : "h-12 rounded-lg"}
              {...field}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
            />
            {suffix && (
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate">
                {suffix}
              </span>
            )}
          </div>
        </FieldShell>
      )}
    />
  );
}