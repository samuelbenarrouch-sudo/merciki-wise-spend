import { Controller, type Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldShell, type BaseFieldProps } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
  type?: "text" | "email" | "tel" | "date";
  inputMode?: "text" | "numeric" | "tel" | "email";
}

export function FormTextField({
  name,
  label,
  control,
  required,
  description,
  placeholder,
  type = "text",
  inputMode,
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
            type={type}
            inputMode={inputMode}
            placeholder={placeholder}
            className="h-12 rounded-lg"
            {...field}
            value={field.value ?? ""}
          />
        </FieldShell>
      )}
    />
  );
}