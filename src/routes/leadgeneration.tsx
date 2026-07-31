import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { PRODUCTS, LEADGEN_AUTH_KEY } from "@/data/products";
import { cn } from "@/lib/utils";

const NOINDEX_META = [
  { name: "robots", content: "noindex, nofollow" },
  { title: "Espace commercial — MERCIKI" },
];

export const Route = createFileRoute("/leadgeneration")({
  head: () => ({ meta: NOINDEX_META }),
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const isAuthed =
      window.sessionStorage.getItem(LEADGEN_AUTH_KEY) === "true";
    if (!isAuthed && !location.pathname.startsWith("/leadgeneration/login")) {
      throw redirect({ to: "/leadgeneration/login" });
    }
  },
  component: LeadGenerationLayout,
});

function LeadGenerationLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem(LEADGEN_AUTH_KEY) === "true";
    setAuthed(ok);
    if (!ok && !pathname.startsWith("/leadgeneration/login")) {
      navigate({ to: "/leadgeneration/login" });
    }
  }, [pathname, navigate]);

  useEffect(() => setMenuOpen(false), [pathname]);

  // Login page = no chrome
  if (pathname.startsWith("/leadgeneration/login")) {
    return <Outlet />;
  }

  if (authed === null || authed === false) {
    return null;
  }

  const handleLogout = () => {
    sessionStorage.removeItem(LEADGEN_AUTH_KEY);
    navigate({ to: "/leadgeneration/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground hover:bg-white/10 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            </button>
            <Link to="/leadgeneration/dashboard" className="flex items-center">
              <Logo variant="light" size="sm" />
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-primary-foreground hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-[280px] shrink-0 border-r border-mist bg-mist lg:block">
          <SidebarContent pathname={pathname} />
        </aside>

        {/* Mobile sidebar overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-ink/50"
              onClick={() => setMenuOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] bg-mist shadow-medium">
              <div className="flex h-16 items-center justify-between border-b border-background px-5">
                <span className="text-label uppercase text-slate">Menu</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-background"
                  aria-label="Fermer le menu"
                >
                  <X className="h-6 w-6" strokeWidth={1.75} />
                </button>
              </div>
              <SidebarContent pathname={pathname} />
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <nav className="p-5">
      <p className="mb-3 px-3 text-label uppercase tracking-wider text-slate">
        Mes verticales
      </p>
      <ul className="space-y-1">
        {PRODUCTS.map((p) => {
          const to = `/leadgeneration/product/${p.id}`;
          const active = pathname === to;
          const Icon = p.icon;
          return (
            <li key={p.id}>
              <Link
                to="/leadgeneration/product/$productId"
                params={{ productId: p.id }}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-ink hover:bg-background",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                <span className="flex-1">{p.label}</span>
                {p.isNew && (
                  <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                    Nouveau
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}