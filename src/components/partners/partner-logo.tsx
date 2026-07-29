import { useState } from "react";
import { cn } from "@/lib/utils";

export interface PartnerLogoProps {
  name: string;
  domain?: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  showName?: boolean;
}

const TOKEN = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY;

export function PartnerLogo({ name, domain, className, imgClassName, loading = "lazy", showName = false }: PartnerLogoProps) {
  const [failed, setFailed] = useState(false);

  if (domain && TOKEN && !failed) {
    const logoUrl = `https://img.logo.dev/${domain}?token=${TOKEN}&format=png&size=128&fallback=monogram`;
    return (
      <div
        className={cn(
          "inline-flex shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-mist bg-background px-4 py-3 shadow-soft",
          "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
          className,
        )}
      >
        <img
          src={logoUrl}
          alt={`Logo ${name}`}
          className={cn("h-7 w-auto max-w-[120px] object-contain", imgClassName)}
          onError={() => setFailed(true)}
          loading={loading}
          decoding="async"
        />
        {showName && (
          <span
            className="text-xs font-semibold tracking-tight text-slate sm:text-sm"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            {name}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border border-mist bg-background px-5 py-3 text-ink shadow-soft",
        "font-semibold tracking-tight text-sm sm:text-base",
        className,
      )}
      style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
    >
      {name}
    </div>
  );
}
