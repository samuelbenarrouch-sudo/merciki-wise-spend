import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FieldShell({
  id,
  label,
  required,
  description,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-label text-ink">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {description && (
        <p className="text-small text-slate">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-small text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export interface Option {
  value: string;
  label: string;
}

export interface BaseFieldProps {
  name: string;
  label: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
}