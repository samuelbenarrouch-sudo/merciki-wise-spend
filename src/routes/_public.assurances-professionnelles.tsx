import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone, Mail, ChevronRight, Check, ShieldCheck, Building2, HardHat,
  Store, Stethoscope, Truck, Briefcase, Search, Scale, PhoneCall, FileCheck, ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { COMPANY } from "@/data/verticals";
import { getOtherPublicVerticals } from "@/data/public-verticals";
import { absoluteUrl } from "@/lib/seo";

const TITLE = "Assurances Professionnelles : RC Pro, RC Exploitation, Décennale | MERCIKI";
const DESCRIPTION =
  "RC Pro, RC Exploitation, garantie décennale : MERCIKI compare les offres des principaux assureurs et vous accompagne de la souscription à la gestion des sinistres.";

export const Route = createFileRoute("/_public/assurances-professionnelles")({
  head: () => {
    const url = absoluteUrl("/assurances-professionnelles");
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: AssurancesProPage,
});

const GUARANTEES: { name: string; short: string; description: string; points: string[]; icon: LucideIcon }[] = [
  {
    name: "Responsabilité Civile Professionnelle",
    short: "RC Pro",
    icon: ShieldCheck,
    description:
      "Couvre les dommages causés à vos clients ou à des tiers dans le cadre de votre activité : erreur, omission, conseil inadapté, dommage matériel ou immatériel.",
    points: [
      "Obligatoire pour de nombreuses professions réglementées",
      "Adaptée à votre secteur d'activité",
      "Protection juridique incluse selon les contrats",
    ],
  },
  {
    name: "Responsabilité Civile Exploitation",
    short: "RC Exploitation",
    icon: Building2,
    description:
      "Couvre les dommages survenus dans le cadre du fonctionnement quotidien de votre entreprise : locaux, matériel, personnel, déplacements.",
    points: [
      "Dommages corporels, matériels et immatériels",
      "Couverture de vos salariés et sous-traitants",
      "Souvent couplée à la RC Pro",
    ],
  },
  {
    name: "Garantie Décennale",
    short: "Décennale",
    icon: HardHat,
    description:
      "Obligation légale pour tous les professionnels du bâtiment. Couvre pendant 10 ans les dommages compromettant la solidité de l'ouvrage ou le rendant inhabitable.",
    points: [
      "Obligation légale avant tout chantier",
      "Attestation exigée par vos clients et maîtres d'ouvrage",
      "Tous corps de métier du bâtiment",
    ],
  },
];

const SECTORS: { label: string; icon: LucideIcon }[] = [
  { label: "Bâtiment et travaux publics", icon: HardHat },
  { label: "Artisans et indépendants", icon: Briefcase },
  { label: "Commerces et restauration", icon: Store },
  { label: "Professions libérales et conseil", icon: Scale },
  { label: "Santé et bien-être", icon: Stethoscope },
  { label: "Transport et logistique", icon: Truck },
];

const STEPS: { title: string; desc: string; icon: LucideIcon }[] = [
  { title: "Nous analysons vos risques", desc: "Activité, chiffre d'affaires, effectif, sous-traitance : nous partons de votre réalité, pas d'un questionnaire générique.", icon: Search },
  { title: "Nous comparons les assureurs", desc: "Nous mettons en concurrence les principaux acteurs du marché pour obtenir le bon niveau de garanties au bon prix.", icon: Scale },
  { title: "Nous sécurisons la souscription", desc: "Vous recevez vos attestations rapidement, avec des exclusions et des franchises expliquées clairement.", icon: FileCheck },
  { title: "Nous restons à vos côtés", desc: "Évolution de votre activité, renouvellement, déclaration de sinistre : vous gardez un interlocuteur unique.", icon: PhoneCall },
];

function AssurancesProPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-primary-light">
        <Container className="py-12 md:py-20">
          <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1.5 text-small text-slate">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            <Link to="/professionnels" className="hover:text-primary">Professionnels</Link>
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-ink font-medium">Assurances Professionnelles</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-6">
              <IconTile icon={ShieldCheck} className="h-16 w-16 md:h-20 md:w-20" />
              <div>
                <Badge variant="primary-light" className="mb-4 w-fit px-4 py-2 text-xs">
                  Professionnels
                </Badge>
                <h1 className="text-h1 text-ink">Assurances Professionnelles</h1>
                <p className="mt-3 text-h3 text-primary">
                  Responsabilité civile, garantie décennale : protégez votre activité avec les
                  bonnes garanties, au bon prix.
                </p>
              </div>
              <p className="text-body text-slate">
                MERCIKI compare pour vous les offres des principaux assureurs du marché et vous
                accompagne de la souscription à la gestion de vos sinistres.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                  <Link to="/contact">
                    <Mail className="h-5 w-5" strokeWidth={1.75} />
                    Être rappelé
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <a href={COMPANY.phone.href}>
                    <Phone className="h-5 w-5" strokeWidth={1.75} />
                    {COMPANY.phone.display}
                  </a>
                </Button>
              </div>
            </div>
            <Card className="hidden lg:flex flex-col gap-5 p-8">
              <h2 className="text-h3 text-ink">Un courtier, toutes vos garanties</h2>
              <ul className="flex flex-col gap-4">
                {[
                  "RC Pro, RC Exploitation et décennale réunies chez un seul interlocuteur",
                  "Comparaison des principaux assureurs du marché",
                  "Attestations transmises rapidement à vos clients",
                  "Accompagnement en cas de sinistre",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2} />
                    <span className="text-body text-slate">{text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* 1. GARANTIES */}
      <Section background="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="NOS GARANTIES"
            title="Les garanties que nous couvrons"
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {GUARANTEES.map((g) => (
              <Card key={g.short} className="flex h-full flex-col gap-4 p-6">
                <IconTile icon={g.icon} className="h-14 w-14" />
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

      {/* 2. SECTEURS */}
      <Section background="mist">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="POUR QUI"
            title="À qui s'adressent ces garanties"
            className="mb-12"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s) => (
              <li
                key={s.label}
                className="flex items-center gap-4 rounded-2xl bg-background p-5 shadow-soft"
              >
                <s.icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} />
                <span className="text-body text-ink">{s.label}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 3. NOTRE ACCOMPAGNEMENT */}
      <Section background="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="NOTRE APPROCHE"
            title="Comment nous intervenons"
            className="mb-12"
          />
          <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
            {STEPS.map((step, i) => (
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

      {/* 3bis. NAV CROISÉE */}
      <section className="py-12 md:py-16 bg-background">
        <Container>
          <p className="mb-5 text-label uppercase tracking-wider text-slate">
            Nos autres solutions pour les professionnels
          </p>
          <div className="flex flex-wrap gap-3">
            {getOtherPublicVerticals("professionnels", "assurances-professionnelles").map((v) => {
              const OtherIcon = v.icon;
              return (
                <Link
                  key={v.id}
                  to={v.href}
                  className="inline-flex items-center gap-2 rounded-full border border-mist bg-background px-4 py-2 text-small text-ink shadow-soft transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <OtherIcon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  <span>{v.label}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. CTA */}
      <Section background="mist">
        <Container>
          <Card className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
            <h2 className="text-h2 text-ink">Parlons de vos risques professionnels</h2>
            <p className="max-w-2xl text-body text-slate">
              Un échange suffit pour faire le point sur vos garanties actuelles et identifier ce
              qui manque ou ce que vous payez en trop. Service gratuit et sans engagement.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                <Link to="/contact">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                  Être rappelé
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a href={COMPANY.phone.href}>
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                  {COMPANY.phone.display}
                </a>
              </Button>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
