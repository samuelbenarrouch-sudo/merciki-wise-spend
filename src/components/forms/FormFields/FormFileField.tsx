import { useRef, useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCEPTED_MIME_TYPES, MAX_FILES, MAX_FILE_SIZE } from "@/lib/leads";
import { FieldShell, type BaseFieldProps } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
  /** Nombre maximum de fichiers conservés. */
  maxFiles?: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Sélection de fichiers conservés EN MÉMOIRE jusqu'à la soumission.
 * Les contrôles locaux (taille, type, nombre) sont un confort de saisie :
 * le serveur applique les mêmes limites, elles seules font foi.
 */
export function FormFileField({
  name,
  label,
  control,
  required,
  description,
  maxFiles = MAX_FILES,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const files: File[] = Array.isArray(field.value) ? field.value : [];

        const addFiles = (selected: FileList | null) => {
          if (!selected) return;
          const rejected: string[] = [];
          const next = [...files];

          for (const file of Array.from(selected)) {
            if (!(ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type)) {
              rejected.push(`« ${file.name} » : format non accepté (PDF ou image).`);
              continue;
            }
            if (file.size > MAX_FILE_SIZE) {
              rejected.push(`« ${file.name} » : dépasse 10 Mo.`);
              continue;
            }
            if (next.length >= maxFiles) {
              rejected.push(`${maxFiles} fichiers maximum : « ${file.name} » ignoré.`);
              continue;
            }
            next.push(file);
          }

          setLocalError(rejected.length > 0 ? rejected.join(" ") : null);
          field.onChange(next);
          field.onBlur();
          if (inputRef.current) inputRef.current.value = "";
        };

        const removeAt = (index: number) => {
          setLocalError(null);
          field.onChange(files.filter((_, i) => i !== index));
        };

        return (
          <FieldShell
            id={name}
            label={label}
            required={required}
            description={description}
            error={localError ?? fieldState.error?.message}
          >
            <input
              ref={inputRef}
              id={name}
              type="file"
              multiple
              capture="environment"
              accept={ACCEPTED_MIME_TYPES.join(",")}
              className="sr-only"
              onChange={(e) => addFiles(e.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={files.length >= maxFiles}
              onClick={() => inputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" strokeWidth={1.75} />
              {files.length === 0 ? "Ajouter des fichiers" : "Ajouter un fichier"}
            </Button>

            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-mist p-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-small text-ink">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-small text-slate">
                      {formatSize(file.size)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Retirer ${file.name}`}
                      className="shrink-0 rounded-md p-1 text-slate transition-colors hover:text-destructive"
                      onClick={() => removeAt(index)}
                    >
                      <X className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </FieldShell>
        );
      }}
    />
  );
}
