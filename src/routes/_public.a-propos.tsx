import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, TrendingDown, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { VERTICALS, type Partner } from "@/data/verticals";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/_public/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — MERCIKI" },
      {
        name: "description",
        content:
          "MERCIKI aide particuliers et professionnels à reprendre la main sur leurs dépenses contraintes : énergie, télécoms, assurances, énergies renouvelables.",
      },
      { property: "og:title", content: "À propos — MERCIKI" },
      {
        property: "og:description",
        content:
          "Notre mission : clarifier, optimiser et accompagner. Découvrez la démarche MERCIKI et nos partenaires.",
      },
      ...canonical("/a-propos").meta,
    ],
    links: canonical("/a-propos").links,
  }),
  component: AboutPage,
});

const LOGO_TOKEN = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY;

function MiniLogo({ partner }: { partner: Partner }) {
  if (partner.domain && LOGO_TOKEN) {
    return (
      <img
        src={`https://img.logo.dev/${partner.domain}?token=${LOGO_TOKEN}&format=png&size=96&fallback=monogram`}
        alt={`Logo ${partner.name}`}
        className="h-8 w-auto max-w-[110px] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-mist bg-background px-2 py-1 text-xs font-semibold text-slate">
      {partner.name}
    </span>
  );
}

const missionCards = [
  {
    icon: Target,
    title: "Clarifier",
    body:
      "Nous décortiquons les offres, nous les expliquons sans jargon. Chaque client doit comprendre ce qu'il paie et pourquoi.",
  },
  {
    icon: TrendingDown,
    title: "Optimiser",
    body:
      "Notre métier, c'est de trouver pour vous la meilleure option : moins cher, mieux adapté, ou simplement plus simple.",
  },
  {
    icon: Users,
    title: "Accompagner",
    body:
      "Pas de chatbot, pas de serveur vocal. Vous parlez à un conseiller qui connaît votre dossier.",
  },
];

function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary-light" className="mb-6">
              Notre histoire
            </Badge>
            <h1 className="text-h1">
              MERCIKI aide les particuliers et les professionnels à reprendre la main sur leurs
              dépenses contraintes.
            </h1>
            <p className="mt-6 text-body text-primary-foreground/85">
              Que ce soit l'énergie, les télécoms, les assurances ou l'équipement en énergies
              renouvelables — ces dépenses nous semblent souvent opaques, figées, impossibles à
              optimiser. MERCIKI existe pour changer ça. Nous apportons une offre large,
              structurée et simple, portée par un réseau de commerciaux de terrain qui écoute
              vraiment.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <Section background="white">
        <Container>
          <SectionHeading
            eyebrow="Notre mission"
            title="Trois engagements simples"
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {missionCards.map((c) => (
              <Card key={c.title} className="p-6 md:p-8">
                <IconTile icon={c.icon} className="bg-accent-soft text-accent" />
                <h3 className="text-h3 mt-5 text-ink">{c.title}</h3>
                <p className="mt-3 text-body text-slate">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Partenaires intro */}
      <Section background="mist">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-h3 text-ink">
              Une offre construite avec des partenaires de confiance.
            </h3>
            <p className="mt-4 text-body text-slate">
              MERCIKI n'invente rien. Nous sélectionnons les meilleurs fournisseurs et assureurs
              du marché, et nous mettons en place les outils pour que vous les trouviez
              facilement.
            </p>
          </div>
        </Container>
      </Section>

      {/* Partenaires grille */}
      <Section background="white">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICALS.map((v) => (
              <Card key={`${v.audience}-${v.slug}`} className="p-5 md:p-6">
                <div className="text-label uppercase tracking-wider text-accent">
                  {v.audience === "professionnels" ? "Pro" : "Particuliers"}
                </div>
                <h4 className="mt-1 text-h3 text-ink">{v.name}</h4>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {v.partners.map((p) => (
                    <MiniLogo key={p.name} partner={p} />
                  ))}
                </div>
                <ul className="mt-4 space-y-1 text-small text-slate">
                  {v.partners.map((p) => (
                    <li key={p.name} className="before:mr-2 before:content-['•']">
                      {p.name}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <p className="mt-12 text-center text-xs text-slate/80">
            MERCIKI est apporteur d'affaires. Nous ne sommes jamais assureurs ni fournisseurs.
            Nos partenaires assurent les contrats finaux.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/contact"
              className="text-small font-semibold text-primary underline underline-offset-4"
            >
              Nous contacter
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}