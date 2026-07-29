import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const wordSize: Record<Size, string> = {
  sm: "text-[22px]",
  md: "text-[28px]",
  lg: "text-[36px]",
};

const dotSize: Record<Size, number> = {
  sm: 8,
  md: 10,
  lg: 13,
};

const dotOffset: Record<Size, number> = {
  sm: 10,
  md: 13,
  lg: 17,
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
  const d = dotSize[size];
  const offset = dotOffset[size];
  const stroke = variant === "light" ? "#ffffff" : "#12211D";

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
          {/* lowered, stylised sun-smiley dot */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-accent"
            style={{
              width: d,
              height: d,
              transform: `translate(-50%, -${offset}px)`,
            }}
          >
            <svg
              width={d}
              height={d}
              viewBox="0 0 16 16"
              fill="none"
              className="absolute inset-0"
              aria-hidden="true"
            >
              {/* subtle sun rays */}
              <circle cx="8" cy="3" r="0.8" fill="currentColor" className="text-background/60" />
              <circle cx="8" cy="13" r="0.8" fill="currentColor" className="text-background/60" />
              <circle cx="3" cy="8" r="0.8" fill="currentColor" className="text-background/60" />
              <circle cx="13" cy="8" r="0.8" fill="currentColor" className="text-background/60" />
              {/* eyes */}
              <circle cx="5.5" cy="6" r="1" fill={stroke} />
              <circle cx="10.5" cy="6" r="1" fill={stroke} />
              {/* smile */}
              <path
                d="M5 9.5C5.8 10.5 10.2 10.5 11 9.5"
                stroke={stroke}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
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
