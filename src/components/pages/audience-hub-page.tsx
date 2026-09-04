import { Link } from "@tanstack/react-router";
import {
  Check, Phone, Mail, ChevronRight, ArrowRight,
  Zap, Wifi, HeartPulse, PawPrint, HandCoins, Sun, CreditCard, Factory,
  PhoneCall, Search, Scale, PartyPopper,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { PartnerLogo } from "@/components/partners/partner-logo";
import { PartnerStrip } from "@/components/partners/partner-strip";
import { ResponsablesB2B } from "@/components/pages/responsables-b2b";
import { COMPANY, type Audience, type Partner } from "@/data/verticals";
import { getPublicVerticals, type PublicVertical } from "@/data/public-verticals";

type HubCopy = {
  badge: string;
  h1: string;
  intro: string;
  crumb: string;
  eyebrow: string;
  gridTitle: string;
  steps: { n: string; icon: LucideIcon; title: string; desc: string }[];
  reassuranceTitle: string;
  reassurance: { title: string; desc: string }[];
  finalTitle: string;
};

const PARTICULIERS_COPY: HubCopy = {
  badge: "Pour les particuliers",
  h1: "Vos dépenses du quotidien, enfin sous contrôle.",
  intro:
    "Électricité, gaz, box internet, forfait mobile, mutuelle, assurance de prêt, chauffage… Ce sont des postes que l'on subit rarement par choix. Nous les reprenons un par un, nous comparons le marché et nous vous proposons mieux. Gratuitement.",
  crumb: "Particuliers",
  eyebrow: "9 EXPERTISES",
  gridTitle: "Ce que nous pouvons optimiser pour vous",
  steps: [
    { n: "01", icon: PhoneCall, title: "Vous nous contactez", desc: "Un appel ou un formulaire suffit. Vous nous dites ce que vous payez aujourd'hui." },
    { n: "02", icon: Search, title: "Nous analysons", desc: "Nous étudions vos contrats en cours et identifions ce qui peut être amélioré." },
    { n: "03", icon: Scale, title: "Nous comparons", desc: "Nous mettons nos partenaires en concurrence pour trouver l'offre la plus juste." },
    { n: "04", icon: PartyPopper, title: "Vous décidez", desc: "Nous vous présentons la meilleure solution. Vous restez libre de dire oui ou non." },
  ],
  reassuranceTitle: "Un service pensé pour vous simplifier la vie",
  reassurance: [
    { title: "Zéro frais", desc: "Notre accompagnement est intégralement gratuit. Nous sommes rémunérés par nos partenaires, jamais par vous." },
    { title: "Zéro paperasse", desc: "Nous gérons les démarches avec vous : résiliation, portabilité, mise en service. Vous n'avez presque rien à faire." },
    { title: "Zéro engagement", desc: "Vous êtes libre d'accepter, de refuser ou de prendre le temps de réfléchir. Aucune pression, aucune obligation." },
  ],
  finalTitle: "Et si on regardait vos contrats ensemble ?",
};

const PROFESSIONNELS_COPY: HubCopy = {
  badge: "Pour les professionnels",
  h1: "Moins de charges, un meilleur encaissement.",
  intro:
    "Vos contrats d'énergie et vos frais d'encaissement pèsent sur votre rentabilité, souvent sans que personne ne les ait renégociés depuis des années. Nous mettons le marché en concurrence pour vous, sans interrompre votre activité.",
  crumb: "Professionnels",
  eyebrow: "2 EXPERTISES",
  gridTitle: "Ce que nous pouvons optimiser pour votre entreprise",
  steps: [
    { n: "01", icon: Search, title: "Nous analysons vos factures", desc: "Vous nous transmettez vos contrats actuels. Nous les décryptons ligne par ligne." },
    { n: "02", icon: PhoneCall, title: "Nous consultons les fournisseurs", desc: "Nous sollicitons nos partenaires et négocions les meilleures conditions pour votre profil." },
    { n: "03", icon: Scale, title: "Nous vous présentons un comparatif clair", desc: "Vous recevez une synthèse simple à lire, avec les postes d'économies identifiés." },
    { n: "04", icon: PartyPopper, title: "Nous gérons le changement de contrat", desc: "Une fois votre décision prise, nous orchestrons la bascule sans interrompre votre activité." },
  ],
  reassuranceTitle: "Un interlocuteur unique pour vos charges",
  reassurance: [
    { title: "Aucune interruption d'activité", desc: "La bascule est planifiée pour être totalement transparente. Votre commerce, votre bureau, votre site continuent de fonctionner." },
    { title: "Comparatif transparent", desc: "Vous accédez à un tableau clair avec les offres consultées, les postes d'économies et notre recommandation motivée." },
    { title: "Suivi dans le temps", desc: "Nous restons votre interlocuteur au fil des ans pour anticiper les renouvellements et réajuster si le marché bouge." },
  ],
  finalTitle: "Prêt à regarder vos contrats d'entreprise ?",
};

export function AudienceHubPage({ audience }: { audience: Audience }) {
  const copy = audience === "particuliers" ? PARTICULIERS_COPY : PROFESSIONNELS_COPY;
  const verticals = getPublicVerticals(audience);
  const audiencePath = audience === "particuliers" ? "/particuliers" : "/professionnels";
  const partners = dedupePartners(verticals);

  return (
    <>
      <HubHero copy={copy} />
      {audience === "professionnels" ? <ResponsablesB2B /> : null}
      <VerticalsSection copy={copy} verticals={verticals} audience={audience} />
      <HowSection copy={copy} />
      <ReassuranceSection copy={copy} />
      <PartnersSection partners={partners} />
      <FinalCta title={copy.finalTitle} />
    </>
  );
}

function dedupePartners(verticals: PublicVertical[]): Partner[] {
  const seen = new Set<string>();
  const out: Partner[] = [];
  for (const v of verticals) {
    for (const p of v.partners) {
      if (!seen.has(p.name)) {
        seen.add(p.name);
        out.push(p);
      }
    }
  }
  return out;
}

/* ---------------- HERO ---------------- */

function HubHero({ copy }: { copy: HubCopy }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary-light">
      <Container className="py-12 md:py-20">
        <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-1.5 text-small text-slate">
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          <span className="text-ink font-medium">{copy.crumb}</span>
        </nav>
        <div className="flex max-w-3xl flex-col gap-6">
          <Badge variant="primary-light" className="w-fit px-4 py-2 text-xs">
            {copy.badge}
          </Badge>
          <h1 className="text-h1 text-ink">{copy.h1}</h1>
          <p className="text-body text-slate">{copy.intro}</p>
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
                Nous écrire
              </Link>
            </Button>
          </div>
          <ul className="flex flex-col gap-2 pt-2 text-small text-slate sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {["Service 100 % gratuit", "Sans engagement", "Partenaires reconnus"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- VERTICALS ---------------- */

function VerticalsSection({
  copy, verticals, audience,
}: {
  copy: HubCopy; verticals: PublicVertical[]; audience: Audience;
}) {
  const gridCols =
    audience === "particuliers"
      ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-6 md:grid-cols-2";
  return (
    <Section background="mist">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={`${verticals.length} EXPERTISES`}
          title={copy.gridTitle}
          className="mb-12"
        />
        <div className={gridCols}>
          {verticals.map((v) => (
            <VerticalCard key={`${v.tunnel}-${v.id}`} v={v} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function VerticalCard({ v }: { v: PublicVertical }) {
  const Icon = v.icon;
  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <IconTile icon={Icon} />
      <div>
        <h3 className="text-h3 text-ink">{v.label}</h3>
        <p className="mt-2 text-small font-semibold text-primary">{v.accroche}</p>
      </div>
      <p className="text-body text-slate">{v.description}</p>
      <ul className="flex flex-col gap-2">
        {v.products.map((p) => (
          <li key={p.name} className="flex items-start gap-2 text-small text-ink">
            <Check className="h-4 w-4 shrink-0 text-primary mt-1" strokeWidth={2.25} />
            <span>{p.name}</span>
          </li>
        ))}
      </ul>
      {v.partners.length > 0 ? (
        <>
          <div className="border-t border-mist my-2" />
          <div className="flex flex-col gap-2">
            <span className="text-slate" style={{ fontSize: 12, letterSpacing: "0.05em" }}>
              NOS PARTENAIRES
            </span>
            <div className="flex flex-wrap gap-2">
              {v.partners.map((p) => (
                <PartnerLogo
                  key={p.name}
                  name={p.name}
                  domain={p.domain}
                  showName
                  className="px-3 py-2 shadow-none"
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
      <Button asChild variant="outline" size="md" className="mt-auto w-full">
        <Link to={v.href}>
          Découvrir
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </Button>
    </Card>
  );
}


/* ---------------- HOW ---------------- */

function HowSection({ copy }: { copy: HubCopy }) {
  return (
    <Section background="white">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="SIMPLE ET RAPIDE"
          title="Comment ça se passe ?"
          className="mb-12"
        />
        <div className="relative">
          <div
            className="absolute left-0 right-0 top-8 hidden lg:block border-t-2 border-dashed border-primary-light"
            aria-hidden="true"
          />
          <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            {copy.steps.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.n} className="relative flex gap-4 lg:flex-col lg:gap-3">
                  <div className="flex flex-col items-center lg:items-start">
                    <div
                      className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-background shadow-soft"
                      style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700 }}
                    >
                      <span className="text-2xl text-accent">{s.n}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-h3 text-ink">{s.title}</h3>
                    <p className="text-body text-slate mt-2">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- REASSURANCE ---------------- */

function ReassuranceSection({ copy }: { copy: HubCopy }) {
  return (
    <Section background="accent-soft">
      <Container>
        <SectionHeading
          align="center"
          title={copy.reassuranceTitle}
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {copy.reassurance.map((r) => (
            <Card key={r.title} className="flex h-full flex-col gap-3 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Check className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <h3 className="text-h3 text-ink">{r.title}</h3>
              <p className="text-body text-slate">{r.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- PARTNERS ---------------- */

function PartnersSection({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  const half = Math.ceil(partners.length / 2);
  const row1 = partners.slice(0, half);
  const row2 = partners.slice(half);
  return (
    <Section background="white">
      <Container>
        <SectionHeading
          align="center"
          title="Nos partenaires"
          subtitle="Nous travaillons avec des acteurs reconnus du marché français."
          className="mb-12"
        />
        <div className="hidden lg:block">
          <PartnerStrip partners={partners} />
        </div>
        <div className="flex flex-col gap-4 lg:hidden">
          <PartnerStrip partners={row1} marquee />
          {row2.length > 0 ? (
            <div className="[&_.animate-merciki-marquee]:[animation-direction:reverse]">
              <PartnerStrip partners={row2} marquee />
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function FinalCta({ title }: { title: string }) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-3xl bg-ink px-6 py-12 text-primary-foreground sm:px-12 md:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-h2 text-primary-foreground">{title}</h2>
            <p className="text-body text-primary-foreground/80">
              Un échange de quelques minutes suffit pour savoir ce que vous pourriez économiser.
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
  );
}