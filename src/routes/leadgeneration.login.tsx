import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LEADGEN_AUTH_KEY } from "@/data/products";

// ⚠️ Le mot de passe est visible dans le code client.
// À sécuriser avec un endpoint backend + JWT ultérieurement.
const LEADGEN_PASSWORD = "20MERCIKI26!";

export const Route = createFileRoute("/leadgeneration/login")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Connexion — Espace commercial MERCIKI" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (password === LEADGEN_PASSWORD) {
      sessionStorage.setItem(LEADGEN_AUTH_KEY, "true");
      toast.success("Connexion réussie");
      navigate({ to: "/leadgeneration/dashboard" });
    } else {
      toast.error("Mot de passe incorrect.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <a href="/" aria-label="Retour à l'accueil" className="inline-flex">
            <Logo size="md" />
          </a>
        </div>
        <div className="rounded-2xl bg-background p-8 shadow-soft">
          <h1 className="text-h2 text-ink">Espace commercial MERCIKI</h1>
          <p className="mt-3 text-body text-slate">
            Connectez-vous pour accéder à votre espace de saisie de leads.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-label text-ink"
              >
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              Accéder à mon espace
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}