import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center"
          ? "items-center text-center mx-auto max-w-2xl"
          : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-label uppercase text-accent tracking-wider">{eyebrow}</span>
      ) : null}
      <h2 className="text-h2 text-ink">{title}</h2>
      {subtitle ? <p className="text-body text-slate">{subtitle}</p> : null}
    </div>
  );
}