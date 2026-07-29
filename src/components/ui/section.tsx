import * as React from "react";
import { cn } from "@/lib/utils";

type SectionBackground = "white" | "mist" | "primary-light" | "accent-soft";

const bgMap: Record<SectionBackground, string> = {
  white: "bg-background",
  mist: "bg-mist",
  "primary-light": "bg-primary-light",
  "accent-soft": "bg-accent-soft",
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: SectionBackground;
  as?: "section" | "div" | "article" | "header" | "footer";
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, background = "white", as: Tag = "section", ...props }, ref) => (
    <Tag
      ref={ref as never}
      className={cn("py-16 md:py-24", bgMap[background], className)}
      {...props}
    />
  ),
);
Section.displayName = "Section";