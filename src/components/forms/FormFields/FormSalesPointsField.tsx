import { Controller, type Control } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldShell } from "./shared";

export interface SalesPoint {
  label?: string;
  address: string;
  postalCode: string;
  city: string;
}

export const emptySalesPoint: SalesPoint = {
  label: "",
  address: "",
  postalCode: "",
  city: "",
};

interface Props {
  name: string;
  label: string;
  control: Control<any>;
  required?: boolean;
  description?: string;
  /** Nom au singulier d'une entrée : sert aussi aux libellés d'affichage. */
  itemLabel?: string;
  maxItems?: number;
}

/** Erreur éventuelle d'une sous-clé d'une entrée du tableau. */
function itemError(error: unknown, index: number, key: keyof SalesPoint) {
  const arr = error as Record<number, Record<string, { message?: string }>> | undefined;
  return arr?.[index]?.[key]?.message;
}

export function FormSalesPointsField({
  name,
  label,
  control,
  required,
  description,
  itemLabel = "Point de vente",
  maxItems = 10,
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const items: SalesPoint[] =
          Array.isArray(field.value) && field.value.length > 0
            ? (field.value as SalesPoint[])
            : [{ ...emptySalesPoint }];

        const update = (index: number, key: keyof SalesPoint, value: string) => {
          const next = items.map((item, i) =>
            i === index ? { ...item, [key]: value } : item,
          );
          field.onChange(next);
        };

        const rootError =
          typeof fieldState.error?.message === "string"
            ? fieldState.error.message
            : undefined;

        return (
          <div className="space-y-4">
            <div>
              <p className="text-label text-ink">
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
              </p>
              {description && (
                <p className="mt-2 text-small text-slate">{description}</p>
              )}
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="space-y-4 rounded-xl bg-mist p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-label text-ink">
                    {itemLabel} {index + 1}
                  </p>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        field.onChange(items.filter((_, i) => i !== index))
                      }
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      Retirer
                    </Button>
                  )}
                </div>

                <FieldShell
                  id={`${name}-${index}-label`}
                  label={`Nom du ${itemLabel.toLowerCase()}`}
                  error={itemError(fieldState.error, index, "label")}
                >
                  <Input
                    id={`${name}-${index}-label`}
                    className="h-12 rounded-lg"
                    placeholder="Ex. Boulangerie du Centre"
                    value={item.label ?? ""}
                    onChange={(e) => update(index, "label", e.target.value)}
                  />
                </FieldShell>

                <FieldShell
                  id={`${name}-${index}-address`}
                  label="Adresse"
                  required
                  error={itemError(fieldState.error, index, "address")}
                >
                  <Input
                    id={`${name}-${index}-address`}
                    className="h-12 rounded-lg"
                    placeholder="12 rue des Lilas"
                    value={item.address ?? ""}
                    onChange={(e) => update(index, "address", e.target.value)}
                  />
                </FieldShell>

                <FieldShell
                  id={`${name}-${index}-postalCode`}
                  label="Code postal"
                  required
                  error={itemError(fieldState.error, index, "postalCode")}
                >
                  <Input
                    id={`${name}-${index}-postalCode`}
                    className="h-12 rounded-lg"
                    inputMode="numeric"
                    placeholder="34000"
                    value={item.postalCode ?? ""}
                    onChange={(e) =>
                      update(
                        index,
                        "postalCode",
                        e.target.value.replace(/\D/g, "").slice(0, 5),
                      )
                    }
                  />
                </FieldShell>

                <FieldShell
                  id={`${name}-${index}-city`}
                  label="Ville"
                  required
                  error={itemError(fieldState.error, index, "city")}
                >
                  <Input
                    id={`${name}-${index}-city`}
                    className="h-12 rounded-lg"
                    placeholder="Montpellier"
                    value={item.city ?? ""}
                    onChange={(e) => update(index, "city", e.target.value)}
                  />
                </FieldShell>
              </div>
            ))}

            {rootError && (
              <p className="text-small text-destructive" role="alert">
                {rootError}
              </p>
            )}

            {items.length < maxItems && (
              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => field.onChange([...items, { ...emptySalesPoint }])}
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} />
                Ajouter un {itemLabel.toLowerCase()}
              </Button>
            )}
          </div>
        );
      }}
    />
  );
}
