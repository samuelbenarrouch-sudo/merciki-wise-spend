import { Link } from "@tanstack/react-router";
import {
  Phone, Mail, ChevronRight, Check, ArrowRight, ShieldCheck, Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { COMPANY, getVerticalsByAudience } from "@/data/verticals";
import {
  ASSURANCES_PARTICULIERES,
  type AssuranceParticuliere,
} from "@/data/assurances-particulieres";
import {
  Zap, Wifi, HeartPulse, PawPrint, HandCoins, Sun,
  type LucideIcon,
} from "lucide-react";

const VERTICAL_ICONS: Record<string, LucideIcon> = {
  Zap, Wifi, HeartPulse, PawPrint, HandCoins, Sun,
};

export function AssuranceParticulierePage({ data }: { data: AssuranceParticuliere }) {
  const others = [
    ...getVerticalsByAudience("particuliers").map((v) => ({
      slug: v.slug,
      name: v.name,
      icon: VERTICAL_ICONS[v.icon] as LucideIcon | undefined,
    })),
    ...ASSURANCES_PARTICULIERES.filter((a) => a.slug !== data.slug).map((a) => ({
      slug: a.slug,
      name: a.name,
      icon: a.icon as LucideIcon,
    })),
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-primary-light">
        <Container className="py-12 md:py-20">
          <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1.5 text-small text-slate">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            <Link to="/particuliers" className="hover:text-primary">Particuliers</Link>
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-ink font-medium">{data.name}</span>
          </nav>
          <div className="flex max-w-3xl flex-col gap-6">
            <IconTile icon={data.icon} className="h-16 w-16 md:h-20 md:w-20" />
            <div>
              <Badge variant="primary-light" className="mb-4 w-fit px-4 py-2 text-xs">
                Particuliers
              </Badge>
              <h1 className="text-h1 text-ink">{data.name}</h1>
              <p className="mt-3 text-h3 text-primary">{data.accroche}</p>
            </div>
            <p className="text-body text-slate">{data.paragraphe}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                <a href={COMPANY.phone.href}>
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                  Appeler le {COMPANY.phone.display}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/contact">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                  Être rappelé
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 1. GARANTIES */}
      <Section background="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="NOS GARANTIES"
            title="Les formules que nous comparons"
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {data.garanties.map((g) => (
              <Card key={g.name} className="flex h-full flex-col gap-4 p-6">
                <IconTile icon={data.icon} className="h-14 w-14" />
                <div>
                  <h3 className="text-h3 text-ink">{g.name}</h3>
                  <p className="mt-1 text-label uppercase tracking-wider text-primary">{g.short}</p>
                </div>
                <p className="text-body text-slate">{g.description}</p>
                <ul className="mt-auto flex flex-col gap-3 pt-2">
                  {g.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2} />
                      <span className="text-small text-ink">{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 2. POUR QUI */}
      <Section background="mist">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="POUR QUI"
            title="À qui s'adresse cette comparaison"
            className="mb-12"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.profils.map((label) => (
              <li
                key={label}
                className="flex items-center gap-4 rounded-2xl bg-background p-5 shadow-soft"
              >
                <Users className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} />
                <span className="text-body text-ink">{label}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 3. NOTRE APPROCHE */}
      <Section background="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="NOTRE APPROCHE"
            title="Comment nous intervenons"
            className="mb-12"
          />
          <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
            {data.etapes.map((step, i) => (
              <li key={step.title} className="flex gap-4 md:flex-col">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background shadow-soft md:h-16 md:w-16"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700 }}
                >
                  <span className="text-lg text-accent md:text-3xl">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-label text-ink">{step.title}</h3>
                  <p className="mt-2 text-small text-slate">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 4. FAQ */}
      <Section background="mist">
        <Container>
          <SectionHeading
            align="center"
            title="Vos questions"
            className="mb-10"
          />
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="flex flex-col gap-2">
              {data.faq.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-2xl border border-mist bg-background px-5"
                >
                  <AccordionTrigger className="min-h-14 py-4 text-left text-body font-semibold text-ink no-underline hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-body text-slate">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      {/* 5. NAV CROISÉE */}
      <section className="py-12 md:py-16 bg-background">
        <Container>
          <p className="mb-5 text-label uppercase tracking-wider text-slate">
            Nos autres solutions pour les particuliers
          </p>
          <div className="flex flex-wrap gap-3">
            {others.map((o) => {
              const OtherIcon = o.icon;
              return (
                <Link
                  key={o.slug}
                  to="/particuliers/$slug"
                  params={{ slug: o.slug }}
                  className="inline-flex items-center gap-2 rounded-full border border-mist bg-background px-4 py-2 text-small text-ink shadow-soft transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {OtherIcon ? <OtherIcon className="h-4 w-4 text-primary" strokeWidth={1.75} /> : null}
                  <span>{o.name}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. CTA FINAL */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div className="rounded-3xl bg-ink px-6 py-12 text-primary-foreground sm:px-12 md:py-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <h2 className="text-h2 text-primary-foreground">
                Parlons de votre {data.name.toLowerCase()} ensemble
              </h2>
              <p className="text-body text-primary-foreground/80">
                Un échange de quelques minutes suffit pour savoir ce que nous pouvons faire pour vous.
                C'est gratuit et sans engagement.
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                  <a href={COMPANY.phone.href}>
                    <Phone className="h-5 w-5" strokeWidth={1.75} />
                    Appeler le {COMPANY.phone.display}
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
                >
                  <Link to="/contact">Être rappelé</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. MENTION LÉGALE */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div
            className="rounded-xl bg-mist p-5 text-slate"
            style={{ borderLeft: "3px solid hsl(var(--primary))", fontSize: 13, lineHeight: 1.6 }}
          >
            <div className="mb-2 flex items-center gap-2 text-ink">
              <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.75} />
              <span className="text-label uppercase tracking-wider">Mention légale</span>
            </div>
            MERCIKI intervient en qualité d'apporteur d'affaires. Les opérations de courtage
            en assurance sont réalisées par notre partenaire ZEPPELIN, société de courtage
            immatriculée à l'ORIAS sous le numéro 25004656 (www.orias.fr). MERCIKI n'exerce
            aucune activité de courtage en assurance et ne délivre aucun conseil en assurance.
          </div>
        </Container>
      </section>
    </>
  );
}
