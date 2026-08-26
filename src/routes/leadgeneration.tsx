import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { Loader2, LogOut, Menu, PenLine, Shield, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { PRODUCTS } from "@/data/products";
import { AuthProvider, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NOINDEX_META = [
  { name: "robots", content: "noindex, nofollow" },
  { title: "Espace commercial — MERCIKI" },
];

export const Route = createFileRoute("/leadgeneration")({
  head: () => ({ meta: NOINDEX_META }),
  component: LeadGenerationRoot,
});

function LeadGenerationRoot() {
  return (
    <AuthProvider>
      <LeadGenerationLayout />
    </AuthProvider>
  );
}

function LeadGenerationLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { status, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoginPage = pathname.startsWith("/leadgeneration/login");
  const isAdminPage = pathname.startsWith("/leadgeneration/admin");

  useEffect(() => {
    if (!isLoginPage && (status === "unauthenticated" || status === "disabled")) {
      navigate({ to: "/leadgeneration/login", replace: true });
    }
  }, [status, isLoginPage, navigate]);

  useEffect(() => setMenuOpen(false), [pathname]);

  // Login page = no chrome
  if (isLoginPage) {
    return <Outlet />;
  }

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <div className="flex flex-col items-center gap-3 text-slate">
          <Loader2 className="h-8 w-8 animate-spin" strokeWidth={1.75} />
          <p className="text-small">Chargement de votre espace…</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/leadgeneration/login", replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            {!isAdminPage ? (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground hover:bg-white/10 lg:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-6 w-6" strokeWidth={1.75} />
              </button>
            ) : null}
            <Link to="/leadgeneration/dashboard" className="flex items-center">
              <Logo variant="light" size="sm" />
            </Link>
            {profile?.full_name ? (
              <span className="hidden text-sm font-medium text-primary-foreground/90 sm:inline">
                {profile.full_name}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            {isAdminPage ? (
              <Link
                to="/leadgeneration/dashboard"
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-primary-foreground hover:bg-white/10"
              >
                <PenLine className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden sm:inline">Saisie de leads</span>
              </Link>
            ) : profile?.role === "admin" && profile.is_active ? (
              <Link
                to="/leadgeneration/admin"
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-primary-foreground hover:bg-white/10"
              >
                <Shield className="h-4 w-4" strokeWidth={1.75} />
                <span className="hidden sm:inline">Administration</span>
              </Link>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-primary-foreground hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
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