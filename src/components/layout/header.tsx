import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, ChevronDown, Euro } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  particuliersItems,
  professionnelsItems,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | "particuliers" | "professionnels">(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega-menu on route change or Escape
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-background transition-shadow duration-200",
          scrolled ? "shadow-soft" : "shadow-none",
        )}
      >
        <Container className="flex h-16 items-center justify-between lg:h-20">
          <Link
            to="/"
            aria-label="Accueil MERCIKI"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <span className="lg:hidden">
              <Logo size="sm" />
            </span>
            <span className="hidden lg:inline-flex">
              <Logo size="md" showBaseline />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {(["particuliers", "professionnels"] as const).map((key) => {
              const items = key === "particuliers" ? particuliersItems : professionnelsItems;
              const isOpen = openMenu === key;
              const label = key === "particuliers" ? "Particuliers" : "Professionnels";
              const href = `/${key}`;
              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(key);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    to={href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-4 py-2 text-label text-ink transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    {label}
                    <ChevronDown
                      strokeWidth={1.75}
                      className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                    />
                  </Link>
                  {isOpen ? (
                    <MegaMenu
                      title={label}
                      items={items}
                      onNavigate={() => setOpenMenu(null)}
                    />
                  ) : null}
                </div>
              );
            })}
            <Link
              to="/a-propos"
              className="rounded-full px-4 py-2 text-label text-ink hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className="rounded-full px-4 py-2 text-label text-ink hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <a
            href={PHONE_HREF}
            className="hidden lg:inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Phone className="h-5 w-5" strokeWidth={1.75} />
            {PHONE_DISPLAY}
          </a>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={PHONE_HREF}
              aria-label={`Appeler le ${PHONE_DISPLAY}`}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-soft hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Phone className="h-5 w-5" strokeWidth={1.75} />
            </a>
            <button
              type="button"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}