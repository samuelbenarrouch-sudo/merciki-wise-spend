import { cn } from "@/lib/utils";
import { PartnerLogo } from "./partner-logo";
import type { Partner } from "@/data/verticals";

export interface PartnerCarouselProps {
  partners: Partner[];
  className?: string;
  /** Speed of one full loop, in seconds. Lower = faster. */
  speed?: number;
  /** @deprecated kept for API compatibility */
  autoPlay?: boolean;
  /** @deprecated kept for API compatibility */
  interval?: number;
}

export function PartnerCarousel({ partners, className, speed = 60 }: PartnerCarouselProps) {
  // Partenaires exclus du carrousel faute de logo fiable disponible.
  const EXCLUDED = new Set(["Jeety", "iAssur"]);
  const filtered = partners.filter((p) => !EXCLUDED.has(p.name));
  if (filtered.length === 0) return null;
  const doubled = [...filtered, ...filtered];

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max gap-6 animate-merciki-marquee py-2 [animation-play-state:running] group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((p, i) => (
          <PartnerLogo
            key={`carousel-${p.name}-${i}`}
            name={p.name}
            domain={p.domain}
            loading="eager"
            showName
            className="min-w-[160px] px-6 py-5 sm:min-w-[180px]"
            imgClassName="h-14 w-auto max-w-[140px] sm:h-16"
          />
        ))}
      </div>
    </div>
  );
}
