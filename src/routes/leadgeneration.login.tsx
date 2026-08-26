import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

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
  const { status, profile, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      // Un administrateur arrive directement sur son dashboard de pilotage.
      navigate({
        to:
          profile?.role === "admin"
            ? "/leadgeneration/admin/dashboard"
            : "/leadgeneration/dashboard",
        replace: true,
      });
    }
  }, [status, profile, navigate]);

  useEffect(() => {
    if (status === "disabled") {
      setError(
        "Votre compte a été désactivé. Contactez votre référent MERCIKI.",
      );
      setSubmitting(false);
    }
  }, [status]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email.trim(), password);
    if (signInError) {
      setError(signInError);
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
          <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-label text-ink">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
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
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
                  Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
            {error ? (
              <p role="alert" className="text-small text-destructive">
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}