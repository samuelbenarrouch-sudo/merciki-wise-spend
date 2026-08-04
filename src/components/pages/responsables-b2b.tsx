import { Phone, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/data/verticals";
import responsablesAsset from "@/assets/responsables-b2b.webp.asset.json";

export function ResponsablesB2B() {
  return (
    <Section background="mist">
      <Container>
        <div className="grid items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
          <div className="mx-auto w-48 shrink-0 sm:w-56 md:w-64">
            <img
              src={responsablesAsset.url}
              alt="Les responsables du pôle professionnels de MERCIKI"
              width={900}
              height={900}
              loading="lazy"
              className="aspect-square w-full rounded-full object-cover shadow-soft"
            />
          </div>
          <div className="min-w-0 text-center md:text-left">
            <p className="text-small font-semibold uppercase tracking-wider text-primary">
              Votre contact dédié
            </p>
            <h2 className="mt-3 text-h2 text-ink">
              Nos responsables du pôle professionnels
            </h2>
            <p className="mt-4 text-body text-slate">
              Elles pilotent les dossiers entreprises de A à Z : analyse de vos factures, mise en
              concurrence des fournisseurs et suivi de la bascule. Un interlocuteur unique,
              joignable, qui connaît votre dossier.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:justify-start justify-center">
              <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                <a href={COMPANY.phone.href}>
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                  Appeler le {COMPANY.phone.display}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/contact">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                  Nous écrire
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
