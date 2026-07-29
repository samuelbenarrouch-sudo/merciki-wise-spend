import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCallButton } from "@/components/layout/floating-call-button";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { CookieBanner } from "@/components/layout/cookie-banner";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20 lg:pb-0">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingCallButton />
      <CookieBanner />
    </div>
  );
}