import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PartnerLogo } from "./partner-logo";
import type { Partner } from "@/data/verticals";

export interface PartnerCarouselProps {
  partners: Partner[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

const SIZE_RULES = [
  { query: "(min-width: 1280px)", perPage: 6 },
  { query: "(min-width: 1024px)", perPage: 5 },
  { query: "(min-width: 768px)", perPage: 4 },
  { query: "(min-width: 480px)", perPage: 3 },
  { query: "all", perPage: 2 },
];

function usePerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const update = () => {
      for (const rule of SIZE_RULES) {
        if (rule.query === "all" || window.matchMedia(rule.query).matches) {
          setPerPage(rule.perPage);
          break;
        }
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perPage;
}

export function PartnerCarousel({
  partners,
  className,
  autoPlay = false,
  interval = 4000,
}: PartnerCarouselProps) {
  const perPage = usePerPage();
  const total = partners.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const [page, setPage] = useState(0);

  // Clamp page when perPage changes
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  const next = useCallback(() => {
    setPage((p) => (p + 1 >= pageCount ? 0 : p + 1));
  }, [pageCount]);

  const prev = useCallback(() => {
    setPage((p) => (p - 1 < 0 ? pageCount - 1 : p - 1));
  }, [pageCount]);

  useEffect(() => {
    if (!autoPlay || pageCount <= 1) return;
    const timer = setInterval(() => {
      setPage((p) => (p + 1 >= pageCount ? 0 : p + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, pageCount, interval]);

  const start = page * perPage;
  const visible = partners.slice(start, start + perPage);

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="flex w-full items-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Partenaires précédents"
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mist bg-background text-ink shadow-soft",
            "transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:opacity-40",
          )}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="flex min-h-[120px] flex-1 items-stretch justify-center gap-3 overflow-hidden sm:gap-4">
          {visible.map((p) => (
            <div
              key={p.name}
              className="flex flex-1 items-center justify-center rounded-2xl border border-mist bg-background px-4 py-5 shadow-soft transition-shadow hover:shadow-medium"
            >
              <PartnerLogo
                name={p.name}
                domain={p.domain}
                loading="eager"
                imgClassName="h-8 sm:h-10"
                className="border-0 bg-transparent px-0 py-0 shadow-none"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Partenaires suivants"
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-mist bg-background text-ink shadow-soft",
            "transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            "disabled:opacity-40",
          )}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center gap-2" role="tablist" aria-label="Navigation du carrousel">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1}`}
              onClick={() => setPage(i)}
              className={cn(
                "h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                i === page ? "w-6 bg-primary" : "w-2.5 bg-slate/30 hover:bg-slate/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
