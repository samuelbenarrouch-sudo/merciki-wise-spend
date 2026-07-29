import { Controller, type Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FieldShell, type BaseFieldProps, type Option } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
  options: Option[];
}

export function FormChipsField({
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
      render={({ field, fieldState }) => {
        const value: string[] = Array.isArray(field.value) ? field.value : [];
        const toggle = (v: string) => {
          if (value.includes(v)) {
            field.onChange(value.filter((x) => x !== v));
          } else {
            field.onChange([...value, v]);
          }
        };
        return (
          <FieldShell
            id={name}
            label={label}
            required={required}
            description={description}
            error={fieldState.error?.message}
          >
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              {options.map((o) => {
                const active = value.includes(o.value);
                return (
                  <button
                    type="button"
                    key={o.value}
                    onClick={() => toggle(o.value)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex min-h-12 items-center justify-center rounded-full border-2 px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary bg-background text-primary hover:bg-primary-light",
                    )}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </FieldShell>
        );
      }}
    />
  );
}