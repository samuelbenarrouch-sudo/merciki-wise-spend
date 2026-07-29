import { Phone } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/navigation";

export function FloatingCallButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/leadgeneration")) return null;
  return (
    <a
      href={PHONE_HREF}
      aria-label={`Appeler le ${PHONE_DISPLAY}`}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink shadow-medium hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
    >
      <Phone className="h-6 w-6" strokeWidth={1.75} />
    </a>
  );
}