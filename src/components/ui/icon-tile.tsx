import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconTileProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  label?: string;
}

export const IconTile = React.forwardRef<HTMLDivElement, IconTileProps>(
  ({ icon: Icon, label, className, ...props }, ref) => (
    <div
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-primary-light text-primary",
        "h-14 w-14 md:h-16 md:w-16",
        className,
      )}
      {...props}
    >
      <Icon strokeWidth={1.75} className="h-6 w-6 md:h-7 md:w-7" />
    </div>
  ),
);
IconTile.displayName = "IconTile";