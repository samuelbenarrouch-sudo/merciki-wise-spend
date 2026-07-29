import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "merciki.cookie-consent";
const TWELVE_MONTHS_MS = 1000 * 60 * 60 * 24 * 365;

type Consent = { value: "accepted" | "rejected"; timestamp: number };

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (Date.now() - parsed.timestamp > TWELVE_MONTHS_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsent()) setVisible(true);
  }, []);

  function decide(value: Consent["value"]) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value, timestamp: Date.now() } satisfies Consent),
      );
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 md:pb-6"
    >
      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-medium md:flex-row md:items-center">
        <Cookie className="h-6 w-6 flex-shrink-0" strokeWidth={1.75} aria-hidden />
        <p className="text-small flex-1">
          Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous
          acceptez notre utilisation.{" "}
          <Link
            to="/politique-de-confidentialite"
            className="text-accent-soft underline underline-offset-2 hover:opacity-90"
          >
            Lire la politique
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <Button
            size="sm"
            onClick={() => decide("rejected")}
            className="border border-primary-foreground/70 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            Refuser
          </Button>
          <Button
            size="sm"
            onClick={() => decide("accepted")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}