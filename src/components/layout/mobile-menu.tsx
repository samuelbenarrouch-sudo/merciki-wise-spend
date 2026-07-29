import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Phone, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "./logo";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  particuliersItems,
  professionnelsItems,
  entrepriseLinks,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[60] lg:hidden transition-transform duration-300 bg-background",
        open ? "translate-x-0" : "translate-x-full pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="particuliers" className="border-b border-border">
              <AccordionTrigger className="min-h-14 text-label uppercase tracking-wider text-ink py-4 hover:no-underline">
                Particuliers
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-1 pb-2">
                  {particuliersItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="flex min-h-14 items-center gap-3 rounded-2xl px-3 text-body text-ink hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <item.icon
                          strokeWidth={1.75}
                          className="h-5 w-5 shrink-0 text-primary"
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="professionnels" className="border-b border-border">
              <AccordionTrigger className="min-h-14 text-label uppercase tracking-wider text-ink py-4 hover:no-underline">
                Professionnels
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-1 pb-2">
                  {professionnelsItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="flex min-h-14 items-center gap-3 rounded-2xl px-3 text-body text-ink hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <item.icon
                          strokeWidth={1.75}
                          className="h-5 w-5 shrink-0 text-primary"
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <ul className="mt-2 flex flex-col">
            {entrepriseLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={onClose}
                  className="flex min-h-14 items-center justify-between border-b border-border px-1 text-body text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate" strokeWidth={1.75} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <a
            href={PHONE_HREF}
            onClick={onClose}
            className="inline-flex w-full min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-6 text-base font-semibold text-accent-foreground shadow-soft hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Phone className="h-5 w-5" strokeWidth={1.75} />
            Appeler le {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  );
}