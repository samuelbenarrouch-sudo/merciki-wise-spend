import { Controller, type Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldShell, type BaseFieldProps, type Option } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
  options: Option[];
}

export function FormSelectField({
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
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={name} className="h-12 rounded-lg">
              <SelectValue placeholder="-- Choisir --" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )}
    />
  );
}