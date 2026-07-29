import { cn } from "@/lib/utils";

export interface PartnerLogoProps {
  name: string;
  className?: string;
}

export function PartnerLogo({ name, className }: PartnerLogoProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border border-mist bg-background px-5 py-3 text-ink shadow-soft",
        "font-semibold tracking-tight",
        "text-sm sm:text-base",
        className,
      )}
      style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
    >
      {name}
    </div>
  );
}