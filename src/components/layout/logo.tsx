import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const wordSize: Record<Size, string> = {
  sm: "text-[22px]",
  md: "text-[28px]",
  lg: "text-[36px]",
};

const dotSize: Record<Size, string> = {
  sm: "h-[7px] w-[7px] -translate-y-[14px]",
  md: "h-[9px] w-[9px] -translate-y-[18px]",
  lg: "h-[11px] w-[11px] -translate-y-[24px]",
};

export interface LogoProps {
  showBaseline?: boolean;
  size?: Size;
  variant?: "default" | "light";
  className?: string;
}

export function Logo({
  showBaseline = false,
  size = "md",
  variant = "default",
  className,
}: LogoProps) {
  const wordColor = variant === "light" ? "text-background" : "text-primary";
  const baselineColor = variant === "light" ? "text-background/70" : "text-slate";

  return (
    <div className={cn("inline-flex flex-col leading-none", className)} aria-label="MERCIKI">
      <span
        className={cn(
          "font-display font-bold leading-none tracking-tight inline-flex items-start",
          wordSize[size],
          wordColor,
        )}
      >
        {/* "merciki" with dotless final i */}
        <span>mercik</span>
        <span className="relative inline-flex items-end">
          {/* dotless i using ı (Latin small letter dotless i) */}
          <span aria-hidden="true">ı</span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-accent",
              dotSize[size],
            )}
          />
        </span>
      </span>
      {showBaseline ? (
        <span
          className={cn(
            "mt-1 font-sans font-medium",
            baselineColor,
          )}
          style={{ fontSize: "11px", letterSpacing: "0.05em" }}
        >
          Optimisation & économies
        </span>
      ) : null}
    </div>
  );
}