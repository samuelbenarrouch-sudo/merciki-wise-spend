import { Controller, type Control } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FieldShell, type BaseFieldProps } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
  rows?: number;
}

export function FormTextarea({
  name,
  label,
  control,
  required,
  description,
  placeholder,
  rows = 4,
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
          <Textarea
            id={name}
            rows={rows}
            placeholder={placeholder}
            className="rounded-lg"
            {...field}
            value={field.value ?? ""}
          />
        </FieldShell>
      )}
    />
  );
}