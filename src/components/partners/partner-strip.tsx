import { cn } from "@/lib/utils";
import { PartnerLogo } from "./partner-logo";
import type { Partner } from "@/data/verticals";

export interface PartnerStripProps {
  partners: Partner[];
  marquee?: boolean;
  className?: string;
}

export function PartnerStrip({ partners, marquee = false, className }: PartnerStripProps) {
  if (marquee) {
    const doubled = [...partners, ...partners];
    return (
      <div className={cn("relative w-full overflow-hidden lg:overflow-visible", className)}>
        <div className="flex gap-3 lg:hidden">
          <div className="flex shrink-0 animate-merciki-marquee gap-3">
            {doubled.map((p, i) => (
              <PartnerLogo key={`m-${p.name}-${i}`} name={p.name} domain={p.domain} />
            ))}
          </div>
        </div>
        <div className="hidden flex-wrap items-center justify-center gap-3 lg:flex">
          {partners.map((p) => (
            <PartnerLogo key={p.name} name={p.name} domain={p.domain} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {partners.map((p) => (
        <PartnerLogo key={p.name} name={p.name} domain={p.domain} />
      ))}
    </div>
  );
}
