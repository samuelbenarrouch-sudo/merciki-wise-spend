import { Link } from "@tanstack/react-router";
import { Building2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EnergieProCard() {
  return (
    <div className="rounded-2xl border border-mist bg-background p-6 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-accent">
          <Building2 className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h3 className="text-h3 text-ink">Énergie Pro</h3>
        <Badge variant="accent-soft">Interne / Commerciaux</Badge>
      </div>
      <p className="mt-4 text-body text-slate">
        Soumission de dossier énergie pour les professionnels : formulaire
        réservé aux commerciaux MERCIKI.
      </p>
      <Button asChild variant="primary" size="md" className="mt-6 min-h-11">
        <Link to="/produits/energie-pro">
          Soumettre un dossier
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </Button>
    </div>
  );
}