import { Controller, type Control } from "react-hook-form";
import { FieldShell, type BaseFieldProps } from "./shared";
import { cn } from "@/lib/utils";

interface Props extends BaseFieldProps {
  control: Control<any>;
  minLabel?: string;
  maxLabel?: string;
}

const VALUES = [0, 1, 2, 3, 4] as const;

function buttonClasses(value: number, selected: boolean) {
  if (selected) {
    if (value === 0) return "bg-mist text-slate border-slate";
    if (value === 4) return "bg-primary text-background border-primary";
    // 1-3 : gradient primary-light -> primary
    const shades = [
      "bg-primary-light text-ink border-primary-light",
      "bg-primary-light text-ink border-primary",
      "bg-primary/70 text-background border-primary",
    ];
    return shades[value - 1];
  }
  return "bg-background text-slate border-mist hover:border-primary";
}

export function FormScaleField({
  name,
  label,
  control,
  required,
  description,
  minLabel = "Non important",
  maxLabel = "Très important",
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const current =
          field.value === "" || field.value === undefined || field.value === null
            ? null
            : Number(field.value);
        return (
          <FieldShell
            id={name}
            label={label}
            required={required}
            description={description}
            error={fieldState.error?.message}
          >
            <div
              role="radiogroup"
              aria-label={label}
              className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
            >
              {VALUES.map((v) => {
                const selected = current === v;
                const displayLabel =
                  v === 0
                    ? `0 (${minLabel})`
                    : v === 4
                    ? `4 (${maxLabel})`
                    : String(v);
                return (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => field.onChange(v)}
                    className={cn(
                      "min-h-12 flex-1 rounded-lg border px-4 py-3 text-body font-medium transition-colors sm:flex-none",
                      buttonClasses(v, selected),
                    )}
                  >
                    {displayLabel}
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